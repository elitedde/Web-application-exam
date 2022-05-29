import { useState } from "react";
import {useHistory} from 'react-router-dom';
import {Form, Button,Col,Alert,FormGroup,Row,Table,Container} from 'react-bootstrap';
import {deleteIcon, arrowdown, arrowup, left, right} from '../icons'
import {Answer} from './Answer.js';
import {NameQuestForm} from './MyForms';
import {DomApertaMod,DomChiusaMod} from './MyModal';
import API from '../API.js';
import {Question} from './Question.js'

/*passo oggetto questionario*/
function CompileForm(props){
const [countAnswers,setCountAnswers]=useState([]);
const history = useHistory();
const [answers, setAnswers] = useState([]);
const [errorMessage, setErrorMessage] = useState('') ;

/*aggiunta o eliminazione domanda aperta*/
const addedCAnswers=(event, text, questionID) =>{
    if(countAnswers[questionID]===undefined){
        setCountAnswers((old)=>{
            let answ=[...old];
            answ[questionID]=0;
            return answ;
        });
    }
    if(event.target.checked){
        const ans = new Answer(null,props.user,text,questionID,props.questionario.id);
        console.log(ans);
        setAnswers((old) => {return [...old, ans]});
        setCountAnswers((old)=>{
            let answ=[...old];
            answ[questionID]++;
            return answ;
        });
    }
    else{
        setAnswers(() => { return answers.filter(t => t.text != text)});
        setCountAnswers((old)=>{
            let answ=[...old];
            answ[questionID]--;
            return answ;
        });
    }
}

/*aggiunta o eliminazione domanda chiusa*/
const addedOAnswers=(event, questionID) =>{
    if(answers.find( a => a.questionID == questionID)){
        if(event.target.value=='')
            setAnswers((old) => { return old.filter(t => t.questionID != questionID)});
            setAnswers((old)=>{
                    return old.map(r =>{
                        if(r.questionID === questionID){
                            return new Answer(null, props.user,event.target.value,questionID,props.questionario.id);
                        }
                        else
                            return r;
                    });
                });
        }   
        
    else{
        let ans =  new Answer(null,props.user,event.target.value,questionID,props.questionario.id);        
        setAnswers((old) => {return [...old, ans]});
    }       
}
/*aggiunta questionario*/
const handleAnsw = () =>{
    setErrorMessage('');
    let valid = true;
    //verifico se ho risposto a tutte le domande obbligatorie
    props.questionario.domande.filter(x => x.min>0).forEach(x => {
        if(x.max>0){
            if(answers.filter(y=>y.questionID==x.id).length<x.min)
                valid=false;
        }else{
            if(answers.find(y => y.questionID==x.id)==null)
                valid=false;
            }
    });
    if(valid){
        answers.map(async a => {
                            API.fetchAddAnswer(a)});
        API.fetchUpdateSurvey(props.questionario.id);
        API.fetchAddCompiledQuest(props.user,props.questionario.id);
        props.setQ('');
        props.setUser('');
        setErrorMessage('');
        props.setV(false);
        props.setMessage({msg:`Questionario compilato con successo!`, type: 'success'});
        history.push("/"); 
    }
    else
        setErrorMessage('Error(s) in the form, please fix it.');
}

    return(<Container fluid>
        <h2 className="compila-titolo">Benvenuta/o {props.user}</h2>
        <h3>Questionario selezionato: {props.questionario.title}</h3>
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <Form>
        {props.questionario.domande.map((dom) => 
            <FormGroup key={dom.id}>
                <Form.Label><h4>Domanda - {dom.text}</h4></Form.Label>
                {dom.max>0?
                    <>{dom.possible_answers.map((risp)=>
                        <Form.Check key={risp} type="checkbox" disabled={countAnswers[dom.id]===undefined?false:(countAnswers[dom.id]==dom.maxrisposte && answers.find(a=>a.text==risp)==undefined)} label={risp} onChange={(event) => addedCAnswers(event,risp,dom.id)}/>
                    )}
                    <Form.Text className="text-muted">Massimo {dom.maxrisposte} risposte consentite</Form.Text>
                    </>
                    :
                    <Form.Control size="lg" type="text" maxLength="200" onChange={(event) => addedOAnswers(event,dom.id)}/> 
                }
                {dom.min>0? 
                    (dom.max>0?
                    <Form.Text id="campofac_obbl" muted>Campo obbligatorio con numero minimo di risposte: {dom.min} </Form.Text>
                    :
                    <Form.Text id="campofac_obbl" muted>Campo obbligatorio </Form.Text>)
                    :
                    <Form.Text id="campofacobbl" muted>Campo facoltativo</Form.Text>
                }
            </FormGroup>
            )
        }
        {answers && 
            <Row style={{paddingTop:'3rem'}}><h4> Vuoi confermare i dati?</h4>
            <Col style={{paddingLeft:'5rem'}}>
                <Button variant="success" onClick={handleAnsw}>
                Submit
                </Button>
            </Col>
            </Row>
        }        
        </Form>
        </Container>);
}


/*visualizzo questionario compilato dagli utenti*/
function VisualizeForm(props){
    const history = useHistory();
    const [ID, setID] = useState(0);
    const [username, setUsername] = useState(props.u[0]);
    const handleUser = (par) => {      
        setUsername(props.u[ID+par]);
        setID((old) => {return old + par});
    }
    const handleClose = () => {
        props.setV(false);
        history.push("/"); 
    }
    return(
        <Container>
        <h2 className="compila-titolo">Questionario: {props.q.title}</h2> 
        <h3>Compilato da: {username}</h3> 
        {props.d.map((dom) => 
                        <Table key={dom.id} striped hover bordered>
                            <thead>
                                <tr>
                                    <th>Domanda: {dom.text}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.r.filter(x => x.username == username && x.questionID == dom.id).map(a => 
                                <tr key={a.id}>
                                    <td>{a.text}</td>
                                </tr>)}
                            </tbody>
                        </Table>)
            }
            <Button onClick={()=> handleUser(-1)} disabled={ID == 0}>{left}</Button>
            <Button onClick={()=> handleUser(1)} disabled={ID == (props.u.length-1)}>{right}</Button>
            <Button style={{float:'right'}} onClick={()=> handleClose()}>Chiudi</Button>
        </Container>
        )
}        

function AddSurvey(props){
    const history = useHistory();
    const [questions, setQuestions] = useState([]);
    const [id, setID] = useState(1); /*indica id domande per riordinarle*/
    const [quest, setQuest] = useState('');
    const [showA, setShowA] = useState(false);
    const [showC, setShowC] = useState(false);
    const handleShowA = () => {setShowA(true);}
    const handleShowC = () => {setShowC(true);}
    const handleCloseA= () => {setShowA(false);}
    const handleCloseC= () => {setShowC(false);}

    const addQuestion=(q) => {
        setQuestions((old) => {return [...old, q]});
        setID((old) => {return old + 1});
    }
    const handleQuest = async()=> {
        props.setQuestionari((old) => {return [...old, quest]});
        const idQ = await API.fetchAddSurvey(quest);
        questions.forEach(async a => {
                        const idD = await API.fetchAddQuestion(a, idQ);
                        a.possible_answers.forEach(async r => await API.fetchAddMutipleAnswers(r,idD))});
        props.setMessage({msg:`Questionario aggiunto con successo!`, type: 'success'});
        history.push("/");
    }
    const deleteQuestion = (o) => {
        setQuestions((oldQ) => {return oldQ.filter(x => x.ordine!= o)
                            .map(x => {
                                if(x.ordine < o)
                                    return x;
                                else
                                    return new Question(null,x.text, null, x.min, x.max, null, x.ordine-1);     
                            })});
        setID((old) => {return old - 1});
    } 

    const switchQ = (ordine, par) => {
        let q1, q2, q;
        if(par){
            q = questions.filter(x => {return x.ordine == ordine});
            q1 = new Question(null,q[0].text,null,q[0].min,q[0].max,q[0].maxrisposte,(q[0].ordine)-1);
            q1.possible_answers=q[0].possible_answers;
            q = questions.filter(x => {return x.ordine == (ordine-1)});
            q2 = new Question(null,q[0].text,null,q[0].min,q[0].max,q[0].maxrisposte,(q[0].ordine)+1);
            q2.possible_answers=q[0].possible_answers;
            setQuestions((old) => {return old.filter(x=>{return x.ordine!=ordine && x.ordine!=ordine-1})});
        }
        else{
            q = questions.filter(x=> {return x.ordine == ordine});
            q1 = new Question(null,q[0].text,null,q[0].min,q[0].max,q[0].maxrisposte,(q[0].ordine)+1);
            q1.possible_answers=q[0].possible_answers;
            q = questions.filter(x=> {return x.ordine == (ordine+1)});
            q2 = new Question(null,q[0].text,null,q[0].min,q[0].max,q[0].maxrisposte,(q[0].ordine)-1);
            q2.possible_answers=q[0].possible_answers;
            setQuestions((old) => {return old.filter(x=>{return x.ordine!=ordine && x.ordine != (ordine+1)})}); 
        }
        setQuestions((old) =>{return [...old,q1,q2]});
        
    };   
    return(<Container fluid>
            {!quest && <h2 className="compila-titolo">Benvenuto nell'area per creare un Nuovo Questionario!</h2>}
            {quest ? <h3 className="compila-titolo" >NUOVO QUESTIONARIO:{quest.title}</h3>: <div style={{paddingTop:'30px'}}><NameQuestForm setQuest={setQuest} user={props.user}/></div>}
            <DomApertaMod show={showA} handleClose={handleCloseA} addQuestion={addQuestion} id = {id}/>
            <DomChiusaMod show={showC} handleClose={handleCloseC} addQuestion={addQuestion} id = {id}/>
            {id!=1 && <h4 style={{paddingTop:'30px'}}>Domande inserite:</h4>
                && <Table striped hover bordered>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>TESTO</th>
                        <th>DOMANDA CHIUSA</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.sort((x,y) => y.ordine < x.ordine? 1: -1).map(a => 
                    <tr key={a.id}>
                        <td>{a.ordine}</td>
                        <td>{a.text}</td>
                        {a.max==0?
                            <td>NO</td>:
                            <td>SI</td>}
                        <td style ={{width:'200px'}}>
                            <Button onClick={()=> switchQ(a.ordine, 0)} disabled = {a.ordine == id-1} >  
                                {arrowdown}
                            </Button>
                            <Button onClick={()=> switchQ(a.ordine, 1)} disabled = {a.ordine == 1}>  
                                {arrowup}
                            </Button>
                            <Button onClick={()=> deleteQuestion(a.ordine)} >  
                                {deleteIcon}
                            </Button>
                        </td>
                    </tr>)}
                    </tbody>
                </Table>
            }
            <Container>
            {quest && <><h4 style={{paddingTop:'15px'}}> Ora puoi aggiungere una nuova domanda:</h4> 
                <Row style={{paddingTop:'20px'}}>
                <Col>
                    <Button size="lg" onClick={handleShowA}>
                        Domanda Aperta
                    </Button>
                </Col>
                <Col>
                    <Button size="lg" onClick={handleShowC}>
                        Domanda Chiusa
                    </Button>
                </Col>
                </Row></>
            }
            {id!=1 &&
            <Row style={{paddingTop:'50px'}}>
                <Col><h4> Vuoi confermare i dati?</h4></Col>
                <Col><Button variant = "success" size = "lg" onClick={handleQuest}>Conferma</Button></Col>
            </Row>
            }
            </Container>
        </Container>);
}

export {CompileForm,VisualizeForm,AddSurvey};