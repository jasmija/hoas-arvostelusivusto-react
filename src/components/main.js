import {Button, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from 'react';
import axios from "axios";

const Main = () => {

  const [newRating, setNewRating] = useState("")
  const [newShape, setNewShape] = useState("")
  const [newComfort, setNewComfort] = useState("")
  const [newGrade, setNewGrade] = useState("")
  const [newWord, setNewWord] = useState("")

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [validated, setValidate] = useState("")

  const [formMessage, setMessage] = useState(''); //arvostelu lisätty onnistuneesti teksti
  const [showMessage, setShowMessage] = useState(false); //tekstin näyttäminen/piilotus

  const [apartments, setApartments] = useState([0])
  const [name, setName] = useState("");


  const ul = {
    display: "flex",
    flexWrap: "wrap",
  }

  const handleRatingChange = (event) => {
    console.log(event.target.value)
    setNewRating(event.target.value)
  }

  const handleShapeChange = (event) => {
    console.log(event.target.value)
    setNewShape(event.target.value)
  }

  const handleComfortChange = (event) => {
    console.log(event.target.value)
    setNewComfort(event.target.value)
  }

  const handleGradeChange = (event) => {
    console.log(event.target.value)
    setNewGrade(event.target.value)
  }

  const handleWordChange = (event) => {
    console.log(event.target.value)
    setNewWord(event.target.value)
  }

  const reset = () => {
    document.getElementById("form").reset();
    setValidate(false)
  }

  const addRating = event =>{

    console.log("ADD RATING")
    event.preventDefault()

    const form = event.currentTarget;
    if(form.checkValidity() === false){
      event.stopPropagation();
    }
    setValidate(true);
    if(form.checkValidity() === false){
      return
    }
    setValidate(true);

    const ratingObject = {
      name: 1,
      shape: newShape,
      comfort: newComfort,
      grade: newGrade,
      word: newWord
    }
    console.log(ratingObject);

    axios
        .post('http://localhost:8080/api/sendform', ratingObject)
        .then(response => {
          console.log('ratingObject: ' + JSON.stringify(ratingObject))
          console.log(response)

          setNewRating('')
          setNewShape('')
          setNewComfort('')
          setNewGrade('')
          setNewWord('')
          if(response.status === 200)
            setMessage('Uuden arvostelun lisääminen onnistui!')
          else if(response.status === 401)
            setMessage('Uuden arvostelun lisääminen epäonnistui, täytä puuttuvat kentät!')
          //setMessage("Tapahtuma lisätty onnistuneesti")
          setShowMessage(true)
          reset()
        })
  }

  function getName(id) {

    const apartment = id;
    console.log("Inside getName")
    axios
        .get('http://localhost:8080/api/apartments?id='+ apartment)
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          let json;
          json = JSON.stringify(response.data);

          if (json.length > 0) {
            console.log("json pituus isompi kuin 0")
            console.log("osoite " + response.data.address)
            setName(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  }

  function onclickFunction() {
    handleShow()
    //getName(id)
  }

  useEffect(() =>{

    axios
        .get('http://localhost:8080/api/apartments')
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          let json;
          json = JSON.stringify(response.data);
          console.log("json " + json.address)

          if (json.length > 0) {
            console.log("json pituus isompi kuin 0")
            console.log(response.data)
            setApartments(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  },[])

  return (
        <div style={ul}>
          {apartments.map(content => (
          <ul id="apartments"  key={''+content.id}>
              <figure>
                <img id="image" src="img/kimpitie.jpg" alt="kimpitie"/>
                <figcaption>
                  <h3>{content.address}</h3>
                </figcaption>
                <Button onClick={onclickFunction} variant="light" className="rate">Arvostele</Button>
              </figure>
          </ul>
          ))}

          <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
          >
            <Modal.Header closeButton onClick={reset}>

              <Modal.Title >Arvostelu kohteeseen: {name}</Modal.Title>

            </Modal.Header>
            <Modal.Body>
              <Form form id="form" noValidate validated={validated} onSubmit={addRating}>
                <Form.Group>
                  <Form.Label>Kunto</Form.Label>
                  <select value={newShape} onChange={handleShapeChange} required>
                    <option value="Erinomainen">Erinomainen</option>
                    <option value="Kiitettävä">Kiitettävä</option>
                    <option value="Hyvä">Hyvä</option>
                    <option value="Tyydyttävä">Tyydyttävä</option>
                    <option value="Välttävä">Välttävä</option>
                  </select>
                  <Form.Control.Feedback type="invalid">Lisää kunto</Form.Control.Feedback>
                </Form.Group>
                <br/>

                <Form.Group>
                  <Form.Label>Viihtyvyys</Form.Label>
                  <select value={newComfort} onChange={handleComfortChange} required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <Form.Control.Feedback type="invalid">Lisää viihtyvyys</Form.Control.Feedback>
                </Form.Group>
                <br/>

                <Form.Group>
                  <Form.Label>Kokonaisarvosana</Form.Label>
                  <select value={newGrade} onChange={handleGradeChange} required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <Form.Control.Feedback type="invalid">Lisää kokonaisarvosana</Form.Control.Feedback>
                </Form.Group>
                <br/>

                <Form.Group>
                  <Form.Label>Vapaa sana</Form.Label>
                  <Form.Control
                      onChange={handleWordChange}
                      required
                      type="text"
                      placeholder="Kerro kokemuksia ja mielipiteitä asunnosta"
                  />
                  <Form.Control.Feedback type="invalid">Lisää vapaa sana</Form.Control.Feedback>
                </Form.Group>
                <br/>
                <div show={showMessage}>{formMessage}</div>
                <br/>
                <Button type="submit">Lähetä</Button>
                <br/>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
    );
}
export default Main