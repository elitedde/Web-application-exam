import {Navbar,Button, Col} from "react-bootstrap";
import {NavIcon} from '../icons';
import {MyModal} from './MyModal.js';
import { useState } from 'react';
function MyNavbar(props){
    const [show, setShow] = useState(false);
    const handleShow = () => {setShow(true); props.setMessage('');}
    const handleClose = () => {setShow(false);}
    return (
        <>
        <Navbar bg = "danger" variant = "light " className="expand-sm fixed-top">
            <Col>
                <Navbar.Brand  href="/" >
                {NavIcon}
                Questionari- CovSars-19
                </Navbar.Brand>
            </Col>       
            <Col>
                {!props.loggedIn ? <Button variant="secondary" style={{float:'right'}} onClick={handleShow}>
                    Login
                </Button>:
                <Button variant="danger" style={{float:'right'}} onClick={props.doLogout}>
                    Logout
                </Button>
                }
            </Col>
      </Navbar>);
      <MyModal username={false} show={show} login={props.login} handleClose={handleClose} />
      </>
    )};

export {MyNavbar};