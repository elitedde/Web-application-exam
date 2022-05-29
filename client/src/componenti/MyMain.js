/*non renderizza bene navbar*/
/*clicco add questionario e non va molto*/
import {Col, Row, Button,Container} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import {MyModal} from './MyModal.js';
import {ret} from '../icons'
import API from '../API.js';
import {CompileForm,AddSurvey,VisualizeForm} from './SurveyForms';
import validator from 'validator';
import {Switch, Route, useHistory, Redirect,useRouteMatch} from 'react-router-dom';

function Main(props){
    const match = useRouteMatch('/VisualizzaQuestionari/:title');
    const selQ = (match && match.params && match.params.title) ? match.params.title : undefined;
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [utenti, setUtenti] = useState([]); /*elenco utenti che hanno compilato questionario SID*/
    const [risposte, setRisposte] = useState([]); /*elenco risposte a questionario SID*/
    const [domande, setDomande] = useState([]); /*elenco domande a questionario SID*/
    const [user, setUser] = useState(''); /*setto username per compilare questionario*/
    const [errorMessage, setErrorMessage] = useState('');
    const handleClose = () => {setShow(false); setErrorMessage('');}
    const handleShow = () => {setShow(true);}
    let valid=false;

    useEffect(()=>{
      const SelQuest = async()=>{
        try{
            if(selQ !== undefined){
              const quest = await API.fetchSurveybyTitle(selQ);
              props.setQ(quest[0]);
              handleVisualizza(quest[0],true);
            }     
          }
        catch(err){
          console.error(err.error);
        }
      };
      SelQuest();
    },[]);
    const handleVisualizza = async(q,flag) => {
      const x = flag?q:props.selectedQ;
      console.log("ciao");
      console.log(props.selectedQ);
      const d = await API.fetchQuestions(x.id);
      setDomande(d);
      const u = await API.fetchTotalUsers(x.id);
      setUtenti(u);
      const r = await API.fetchAnswers(x.id);
      setRisposte(r);
      props.setV(true);
      history.push("/VisualizzaQuestionari/"+x.title);
  };
    function validate(user){
        if(validator.isEmpty(user)){
          setErrorMessage('Username required'); 
          return false;
        }
        else
          return true;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        valid = validate(user);
        if(valid){    
          handleClose();
          props.setV(true);
          history.push("/Questionario/"+props.selectedQ.title);
        }
    }

  return(
    <Switch>
      <Route path="/Questionario/" render={()=><>
          {user=='' || props.loggedIn ? <Redirect to="/" />:
          <CompileForm questionario={props.selectedQ} setMessage={props.setMessage} setV={props.setV} user={user} setQ={props.setQ} setUser ={setUser} />}
          </>}/>
      <Route path="/AggiungiQuestionario" render={()=>
      <>
        {!props.loggedIn ? 
        (props.isLoading?"Please wait, loading the surveys...":<Redirect to="/" />):
        <AddSurvey user={props.user} questionari={props.questionari} setMessage={props.setMessage} setQuestionari={props.setQuestionari}/>}
      </>}/>
      <Route path="/VisualizzaQuestionari/:title" render={()=>
      <>
        {!props.loggedIn ? 
        (props.isLoading?"Please wait, loading the surveys...":<Redirect to="/" />)
        :
        (props.selectedQ===''?<Redirect to="/" />:<VisualizeForm u ={utenti} r={risposte} d={domande} setV={props.setV} q ={props.selectedQ}/>)}
      </>}/>
      <Route path="/" render={()=><>
          {props.loggedIn ?                    
              (props.selectedQ ?
                <Container fluid className="sceltain">
                  <Container><Button className="visualizza-back" onClick={() => props.setQ('')}>{ret}</Button></Container>
                  <h1 className="text-center" style={{paddingTop:'25px'}}>Questionario: {props.selectedQ.title}</h1>
                  <Row><h1 className="text-center" style={{paddingTop:'25px'}}>Numero compilazioni: {props.selectedQ.compilazioni}</h1></Row>
                  <Row>
                  {props.selectedQ.compilazioni>0 && <Col><h1 className="text-center" style={{paddingTop:'25px'}}>Vuoi vedere i questionari compilati?</h1></Col>
                  && <Col style={{paddingTop:'25px'}}><Button className="btn-centered" onClick={()=>handleVisualizza(null,false)} size="lg">Visualizza</Button></Col>}
                  </Row>
                </Container> 
              :
              <Container fluid className="sceltain">
                <Row><h1>Vuoi aggiungere un nuovo questionario?</h1></Row>
                <Row style={{paddingTop:'40px'}}>
                <Button className="btn-centered" href = "/AggiungiQuestionario" size="lg">Add</Button>
                </Row>
              </Container>
              )
            :        
              props.selectedQ ? 
              <Container fluid className="sceltain">
                <h2> Vuoi compilare il questionario {props.selectedQ.title} ? </h2>
                <Row style={{paddingTop:'40px'}} className="justify-content-center"><Button className="btn-centered" size="lg" onClick={handleShow}>Compila</Button></Row>
              </Container> 
              :
              <h2 className="text-center">Benvenuto nel Portale dei Questionari COVID19</h2>
          }
          <MyModal username={true} show={show} errorMessage={errorMessage} handleSubmit={handleSubmit}
            handleClose={handleClose} handleShow={handleShow} setUser={setUser}/>
          </>}/> 
      </Switch>
  );}
  
export {Main};