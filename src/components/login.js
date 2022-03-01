import React, {useEffect, useRef, useState} from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/login.css';

const Login = () => {
  const marginTop = {
    marginTop: 15,
  };

  let [usernameValue, setUsernameValue] = useState('');
  let [pwdValue, setPwdValue] = useState('');
  const [validated, setValidated] = useState(false);
  const formReset = useRef(null);
  const usernameFocus = React.useRef();
  const [failure, setFailure] = useState(false);
  const [failure2, setFailure2] = useState(false);
  const [success, setSuccess] = useState(false);
  let [, setResponseValue] = useState(0);

  let loginObject = {
    username: usernameValue,
    password: pwdValue,
  };

  const addInfo = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    } else {
      event.preventDefault();
    }
    formReset.current.reset();
    setValidated(false);
    usernameFocus.current.focus();

    await axios
        .post('http://localhost:8080/login', loginObject)
        .then(response => {
          setResponseValue(response.status);
          if (response.status === 202) {
            setFailure2(false);
            setFailure(true);
          }
          if (response.status === 203) {
            setFailure(false);
            setFailure2(true);
          } else if (response.status === 201) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccess(true);
            window.location.href = "/";
          }
        });

  };

  return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <Form noValidate ref={formReset} validated={validated} onSubmit={addInfo}>
        <h3><Form.Label>Kirjaudu sisään</Form.Label></h3>
        <Col className="mb-3">
          <Form.Group as={Col}>
            <Form.Control ref={usernameFocus}
                          autoFocus
                          required
                          type="text"
                          onChange={event => setUsernameValue(event.target.value)}
                          placeholder="Käyttäjänimi"
            />
            <Form.Control.Feedback type="invalid">
              Käyttäjänimi vaaditaan.
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Control
                type="password"
                required
                onChange={event => setPwdValue(event.target.value)}
                placeholder="Salasana"
            />
            <Form.Control.Feedback type="invalid">
              Salasana vaaditaan.
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
            {failure && <div className="alert alert-danger" role="alert" style={marginTop}>Käyttäjää ei löydy.</div>}
            {failure2 && <div className="alert alert-danger" role="alert" style={marginTop}>Käyttäjätunnus tai salasana väärin.</div>}
            {success && <div className="alert alert-success" role="alert" style={marginTop}>Kirjautuminen onnistui.</div>}
          </Form.Group>
        </Col>
        <Button type="submit" variant="success">Kirjaudu</Button>
      </Form>
      </div>
  );
};

export default Login;
