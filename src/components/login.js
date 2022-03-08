import React, {useRef, useState} from 'react';
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
  const [usrNotFoundFailure, setUsrNotFoundFailure] = useState(false);
  const [usrOrPwdWrongFailure, setUsrOrPwdWrongFailure] = useState(false);
  const [usrFound, setUsrFound] = useState(false);

  // Username and password from user form.
  let loginObject = {
    username: usernameValue,
    password: pwdValue,
  };

  // Trigger addInfo() when form is submitted.
  const addInfo = async (event) => {
    const form = event.currentTarget;
    // Check if both username and password fields are not empty.
    // If either is empty, enter if-statement where error is shown.
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    } else {
      event.preventDefault();
    }
    // If both fields have data, reset form and move focus to username field.
    formReset.current.reset();
    setValidated(false);
    usernameFocus.current.focus();

    // Send form data to server.
    await axios
        .post('http://localhost:8080/login', loginObject)
        .then(async response => {
          // If username is not found in database, enter if-statements depending on response status.
          if (response.status === 202) {
            setUsrNotFoundFailure(true);
            setUsrOrPwdWrongFailure(false);
          }
          if (response.status === 203) {
            setUsrNotFoundFailure(false);
            setUsrOrPwdWrongFailure(true);
            // If user is found, add response data to localstorage.
          } else if (response.status === 201) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUsrNotFoundFailure(false);
            setUsrOrPwdWrongFailure(false);
            setUsrFound(true);
            // Wait 2 seconds before redirect to home page.
            await new Promise(r => setTimeout(r, 2000));
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
                          pattern="[\S]{1,}"
                          type="text"
                          onChange={event => setUsernameValue(event.target.value)}
                          placeholder="Käyttäjänimi"
            />
            <Form.Control.Feedback type="invalid">
              Käyttäjänimi vaaditaan (välilyöntejä ei hyväksytä).
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Control
                type="password"
                required
                pattern="[\S]{1,}"
                onChange={event => setPwdValue(event.target.value)}
                placeholder="Salasana"
            />
            <Form.Control.Feedback type="invalid">
              Salasana vaaditaan (välilyöntejä ei hyväksytä).
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
            {usrNotFoundFailure && <div className="alert alert-danger" role="alert" style={marginTop}>Käyttäjänimeä ei löydy.</div>}
            {usrOrPwdWrongFailure && <div className="alert alert-danger" role="alert" style={marginTop}>Käyttäjänimi tai salasana väärin.</div>}
            {usrFound && <div className="alert alert-success" role="alert" style={marginTop}>Kirjautuminen onnistui!<br /><br />Uudelleenohjataan...</div>}
          </Form.Group>
        </Col>
        <Button type="submit" variant="success">Kirjaudu</Button>
      </Form>
      </div>
  );
};

export default Login;
