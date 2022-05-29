
import { useState } from "react";
import {Form, Button,Col,Alert, Row} from 'react-bootstrap';
import {Question} from './Question'
import {Survey} from './Survey'
function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('') ;
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        let valid = true;
        if(username === '' || password === '' || password.length < 6)
            valid = false;
        if(valid){
          props.login(credentials);
          props.handleClose();
        }
        else
          setErrorMessage('Error(s) in the form, please fix it.');
    };
  
    return (
      <Form>
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='username' value={username} onChange={ev => setUsername(ev.target.value)} />
        </Form.Group>
        <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
        </Form.Group>
        <Row>
        <Form.Group className="close-button">
          <Col><Button onClick={props.handleClose}>Close</Button></Col>
        </Form.Group>
        <Form.Group className="custom-button">
          <Col><Button onClick={handleSubmit}>Login</Button></Col>
        </Form.Group>
        </Row>       
    </Form>
    )
  }
function UsernameForm(props) {
    return(
      <Form>
          {props.errorMessage ? <Alert variant='danger'>{props.errorMessage}</Alert>  : ''}
          <Form.Group controlId="username">
              <Form.Label>Inserire username per procedere con la compilazione</Form.Label>
              <Form.Control type="username" placeholder="Enter username" onChange={ev => props.setUser(ev.target.value)} />
          </Form.Group>
      </Form>
    );
}
function DomApertaForm(props) {
  const [testo, setTesto] = useState('');
  const [obbl, setObbl] = useState(0);
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
    /*chiamo la funzione per inserimento nell'elenco*/
      event.preventDefault();
      setErrorMessage('');
      /*null indicano id questionario, survey id */
      let valid = true;
      if(testo === '' || (obbl != 0 && obbl != 1))
          valid = false;
      if(valid){
        const question = new Question(null,testo, null, obbl, 0, 1, props.id);
        props.addQuestion(question)
        props.handleClose();
      }
      else
        setErrorMessage('Error(s) in the form, please fix it.');
  };
  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='text'>
          <Form.Label>Inserire testo della domanda</Form.Label>
          <Form.Control type='text' value={testo} onChange={ev => setTesto(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId="formCheckbox">
        <Form.Check custom type="checkbox" id="formCheckbox" label="Domanda obbligatoria" onChange={event =>
          event.target.checked?setObbl(1):setObbl(0)}/>
      </Form.Group>
      <Row>
      <Form.Group className="custom-button">
        <Col><Button onClick={handleSubmit}>Submit</Button></Col>
      </Form.Group>
      <Form.Group className="close-button">
        <Col><Button onClick={props.handleClose}>Close</Button></Col>
      </Form.Group>
      </Row>    
  </Form>
  )
}
function DomChiusaForm(props) {
  const [testo, setTesto] = useState('');
  const [maxRisposte, setMaxRisposte] = useState(1);
  const [errorMessage, setErrorMessage] = useState('') ;
  const [obbl, setObbl] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [nA, setNA] = useState(0); /*numero risposte inserite per una certa domanda*/
  const addAnswer =() => {
    if(answer === ''){
      setErrorMessage('Error(s) in the form, please fix it.');
    }
    else{
      setErrorMessage('');
      setAnswers((old) => {return [...old, answer]});
      setAnswer('');
      setNA((old) => {return old + 1;});
    }
}
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      let valid = true;
      if(testo === '' || nA<2 || maxRisposte < obbl || maxRisposte > nA)
          valid = false;
      if(valid){
        const question = new Question(null,testo, null, obbl, nA, maxRisposte,props.id);
        console.log(question);
        question.setAnswers(answers);
        props.addQuestion(question);
        setNA(0);
        props.handleClose();
      }
      else
        setErrorMessage('Error(s) in the form, please fix it.');
  };

  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='text'>
          <Form.Label>Inserire testo della domanda</Form.Label>
          <Form.Control type='text' value={testo} onChange={ev => setTesto(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId="formCheckbox">
        <Form.Check custom type="checkbox" id="formCheckbox" checked={obbl>0} label="Domanda obbligatoria" onChange={event =>
          event.target.checked?setObbl(1):setObbl(0)}/>
      </Form.Group>
      <Form.Group controlId='text'>
          <Form.Label>Inserire numero massimo di risposte ammissibili</Form.Label>
          <Form.Control value={maxRisposte} onChange={ev => setMaxRisposte(ev.target.value)} />
      </Form.Group>
        <Form.Group controlId='text'>
          <Form.Label>Inserire numero minimo di risposte ammissibili</Form.Label>
          <Form.Control type='text' value={obbl} onChange={ev => setObbl(ev.target.value)} />
      </Form.Group>
     {/*visualizzo risposte inserite se presenti*/}
     {nA>0 &&  answers.map(a => <h5 key={a}>risposta:{a}</h5>)}
     {/*ciclo su risposte da inserire*/}
     {nA<10 && <><Form.Group controlId='text'>
          <Form.Label>Inserire testo di una possibile risposta</Form.Label>
          <Form.Control type='text' value={answer} onChange={ev => setAnswer(ev.target.value)} />
      </Form.Group>
      <Form.Group className="custom-button">
        <Button onClick={addAnswer}>Conferma risposta</Button>
      </Form.Group></>}
      <Row>
      <Form.Group className="close-button">
        <Col><Button variant = "danger" onClick={props.handleClose}>Close</Button></Col>
      </Form.Group>
      <Form.Group className="custom-button">
        <Col><Button variant = "success" onClick={handleSubmit}>Conferma</Button></Col>
      </Form.Group>
      </Row>     
  </Form>
  )
}
function NameQuestForm(props) {
  const [errorMessage, setErrorMessage] = useState('') ;
  const [titolo, setTitolo] =  useState('') ;
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      let valid = true;
      if(titolo === '' )
          valid = false;
      if(valid){
        const survey = new Survey(null,titolo, props.user, 0);
        props.setQuest(survey)
      }
      else
        setErrorMessage('Error(s) in the form, please fix it.');
  };

  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='text'>
          <Form.Label>Inserire titolo del questionario</Form.Label>
          <Form.Control style={{width:'70%'}} type='text' value={titolo} onChange={ev => setTitolo(ev.target.value)} />
      </Form.Group>
      <Row>
      <Form.Group className="custom-button">
        <Col><Button variant="success" onClick={handleSubmit}>Conferma</Button></Col>
      </Form.Group>
      </Row>
    </Form>
   )}


export {LoginForm, UsernameForm, DomChiusaForm, DomApertaForm, NameQuestForm};