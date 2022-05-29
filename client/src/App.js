import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container, Row,Col, Alert} from 'react-bootstrap';
import {MyNavbar} from './componenti/MyNavbar.js';
import {MySidebar} from './componenti/MySidebar.js';
import {Main} from './componenti/MyMain.js';
import {BrowserRouter as Router} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import API from './API.js';
import { useState,useEffect } from 'react';

function App() {
  const [selectedQ, setSelectedQ] = useState(''); /*setto questionario selezionato*/
  const [visualizza, setVisualizza] = useState(false); /*setto quando è in stato visualizzazione/compilazione quest*/
  const [questionari, setQuestionari] = useState([]); /*setto questionari totali visualizzati*/
  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser,setcurrUser] = useState(''); /*indica admin id*/
  const [message, setMessage] = useState('');
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(()=>{
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const uInfo = await API.getUserInfo();
        setcurrUser(uInfo.id);
        setLoggedIn(true);
        setIsLoading(false);
      } catch(err) {
        setIsLoading(false);
        console.error(err.error);
      }
    };
    checkAuth();
  },[]);
   
  useEffect(()=>{
    const getQs = async()=>{
      try{ 
          if(!isLoading){
              if(loggedIn){
                const qs = await API.fetchSurveysAdmin(currUser);
                setQuestionari(qs);
              }
              else{
                const qs = await API.fetchSurveys();
                setQuestionari(qs);
              }
          }
      }
      catch(err){
        console.error(err.error);
      }
    };
    getQs();
  },[loggedIn,isLoading]);

  const doLogin = async (credentials) => {
    try{
        setIsLoading(true);
        setQuestionari([]);
        const user = await API.login(credentials);
        setcurrUser(user.id);
        setLoggedIn(true);
        setSelectedQ('');
        setMessage({msg:`Welcome ${user.username}!`, type: 'success'});
        setVisualizza(false);
        setIsLoading(false);
    }
    catch(err) {
        setIsLoading(false);
        setMessage({msg: " Incorrect username and/or password", type: 'danger'});
    }
  } 
  
  const doLogout = async () => {
    await API.logOut().then(setMessage({msg: 'Successfully logged out', type: 'success'}));
    setQuestionari([]);
    setSelectedQ('');
    setLoggedIn(false);
    setVisualizza(false);
    setIsLoading(false);
  }

  return (
  <Router>
  <Container fluid >
    <Row> 
      <MyNavbar loggedIn={loggedIn} login={doLogin} doLogout={doLogout} setMessage={setMessage}/>
    </Row> 
    {isLoading?"loading":
    <Row>
        {!visualizza && <MySidebar selectedQ = {selectedQ} setMessage={setMessage} 
                              setQ = {setSelectedQ} questionari = {questionari}/>}
        <Col className="colcenter">
          {message && <Row>
            <Alert closeLabel="" variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Main setQ = {setSelectedQ} visualizza={visualizza} setV={setVisualizza} isLoading={isLoading} 
          questionari={questionari} setQuestionari = {setQuestionari} loggedIn={loggedIn}  message={message} 
          setMessage={setMessage} selectedQ={selectedQ} user={currUser}/>
        </Col>
    </Row>}
  </Container>
  </Router>
  );
}

export default App;
