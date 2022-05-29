import {Button, Modal} from 'react-bootstrap';
import {LoginForm, UsernameForm,DomApertaForm, DomChiusaForm} from './MyForms.js'
function MyModal(props){
    return(        
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Body>
                {props.username?<UsernameForm setUser={props.setUser} errorMessage={props.errorMessage} />
                    :<LoginForm login={props.login} handleClose={props.handleClose}/>}
            </Modal.Body>
            {props.username && 
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.handleSubmit}>
                    Confirm
                </Button>
                </Modal.Footer>
            }
        </Modal>
    );
}
function DomApertaMod(props){
    return(        
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Body>
                <DomApertaForm handleClose={props.handleClose} addQuestion={props.addQuestion} id = {props.id}/>
            </Modal.Body>
        </Modal>
    );
}
function DomChiusaMod(props){
    return(        
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Body>
                <DomChiusaForm handleClose={props.handleClose} addQuestion={props.addQuestion} id = {props.id}s />
            </Modal.Body>
        </Modal>
    );
}
export{MyModal, DomApertaMod,DomChiusaMod };