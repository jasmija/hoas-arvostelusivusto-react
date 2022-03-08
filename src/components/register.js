import React, { useRef, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/login.css';

const Register = () => {
  const marginTop = {
    marginTop: 15
  }

  let [usernameValue, setUsernameValue] = useState('');
  let [pwdValue, setPwdValue] = useState('');
  const [validated, setValidated] = useState(false);
  const formReset = useRef(null);
  const usernameFocus = React.useRef();
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  let registerObject = {
    username: usernameValue,
    password: pwdValue,
  }

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
    }
    event.preventDefault();
    // If both fields have data, reset form and move focus to username field.
    formReset.current.reset();
    setValidated(false);
    usernameFocus.current.focus();

    // Send form data to server.
    await axios
        .post('http://localhost:8080/api/adduser', registerObject)
        .then(async response => {
          // If user already exists in database, receive status 202 from server and show error.
          if (response.status === 202) {
            setSuccess(false);
            setFailure(true);
            // If user was added to database successfully, receive status 201 from server and show success message.
          } else if (response.status === 201) {
            setFailure(false);
            setSuccess(true);
            // Wait 2 seconds before redirect to login page.
            await new Promise(r => setTimeout(r, 2000));
            window.location.href = "/login";
          }
        })
  };

  return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <Form noValidate ref={formReset} validated={validated} onSubmit={addInfo}>
        <h3><Form.Label>Rekisteröidy</Form.Label></h3>
        <Col className="mb-3">
          <Form.Group as={Col}>
            <Form.Control ref={usernameFocus}
                          autoFocus
                          required
                          pattern="[\S]{3,}"
                          type="text"
                          onChange={event => setUsernameValue(event.target.value)}
                          placeholder="Käyttäjänimi"
            />
            <Form.Control.Feedback type="invalid">
              Käyttäjänimen täytyy olla vähintään 3 merkkiä pitkä (välilyöntejä ei hyväksytä).
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Control
                type="password"
                required
                pattern="[\S]{8,}"
                onChange={event => setPwdValue(event.target.value)}
                placeholder="Salasana"
            />
            <Form.Control.Feedback type="invalid">
              Salasanan täytyy olla vähintään 8 merkkiä pitkä (välilyöntejä ei hyväksytä).
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
            {success && <div className="alert alert-success" role="alert" style={marginTop}>Rekisteröityminen onnistui!<br /><br /> Uudelleenohjataan...</div>}
            {failure && <div className="alert alert-danger" role="alert" style={marginTop}>Käyttäjä on jo olemassa.</div>}
          </Form.Group>
        </Col>
        <Button type="submit" variant="success">Rekisteröidy</Button>
      </Form>
      </div>
  );
};

export default Register;
