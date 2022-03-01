import React, { useRef, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';

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
  let [, setResponseValue] = useState(0);

  let loginObject = {
    username: usernameValue,
    password: pwdValue,
  }

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
        .post('http://localhost:8080/api/adduser', loginObject)
        .then(response => {
          setResponseValue(response.status);
          if (response.status === 202) {
            setSuccess(false);
            setFailure(true);
          } else if (response.status === 201) {
            setFailure(false);
            setSuccess(true);
          }
        })
  };

  return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <Form noValidate ref={formReset} validated={validated} onSubmit={addInfo}>
        <Col className="mb-3">
          <Form.Group as={Col}>
            <Form.Label style={marginTop}>Käyttäjätunnus:</Form.Label>
            <Form.Control ref={usernameFocus}
                          autoFocus
                          required
                          type="text"
                          onChange={event => setUsernameValue(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Käyttäjänimi vaaditaan.
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label style={marginTop}>Salasana:</Form.Label>
            <Form.Control
                type="password"
                required
                onChange={event => setPwdValue(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Salasana vaaditaan.
            </Form.Control.Feedback>
            <Form.Control.Feedback/>
            {success && <div className="alert alert-success" role="alert" style={marginTop}>Rekisteröityminen onnistui.</div>}
            {failure && <div className="alert alert-danger" role="alert" style={marginTop}>Käyttäjä on jo olemassa.</div>}
          </Form.Group>

        </Col>

        <Button type="submit" variant="success">Rekisteröidy</Button>
      </Form>
      </div>
  );
};

export default Register;
