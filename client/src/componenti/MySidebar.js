
import ListGroup from 'react-bootstrap/ListGroup';
import {Col} from 'react-bootstrap';
function MySidebar(props){

  const handleQuest=(q)=>{
    q.setDomande(); /*inserisco le domande del questionario selezionato e possibili risposte multiple*/
    props.setMessage(''); 
    props.setQ(q); /*questionario selezionato**/
  }
  return (
    <Col className="sidepad">
      <ListGroup className="pad-top-4rem text-center" >
        {props.questionari.map((ts) => <ListGroup.Item key={ts.id} action 
          active={ts.id === props.selectedQ.id} onClick={()=> handleQuest(ts)}>{ts.title}</ListGroup.Item>)}  
      </ListGroup>
    </Col>
  )
  }

  export {MySidebar};