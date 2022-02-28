import { Button, Form, Modal, Table } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const Main = () => {

  //Modaalin kanssa säätäminen kesken, ei toimi vielä

  const [newId, setNewId] = useState("")
  const [newShape, setNewShape] = useState("")
  const [newComfort, setNewComfort] = useState("")
  const [newGrade, setNewGrade] = useState("")
  const [newWord, setNewWord] = useState("")
  const [validated, setValidate] = useState("")

  const [formMessage, setMessage] = useState(''); //arvostelu lisätty onnistuneesti teksti
  const [showMessage, setShowMessage] = useState(false); //tekstin näyttäminen/piilotus

  const [apartments, setApartments] = useState([0]) //asunnot tietokannasta sivulle
  const [name, setName] = useState([0]); //asuntojen nimet otsikoksi

  const [showModal, setShowModal] = useState(false); //modaali
  const handleCloseModal = () => setShowModal(false); //modaali sulku
  const [showRatingContent, setShowRatings] = useState(false); //turha ehkä
  const [showFormContent, setShowForm] = useState(false);  //turha ehkä
  const [ratings, setRatings] = useState([0]) //arvostelut tietokannasta

  const ul = {
    display: "flex",
    flexWrap: "wrap",
  }

  //id:tä varten
  const handleRatingChange = (event) => {
    console.log(event.target.value)
    setNewId(event.target.value)
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

  function makeQueryForAddNewReview(id) {
    const apartment = id;
    console.log("id "+ apartment)

    axios
        .get('http://localhost:8080/api/address?id='+ apartment)
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          let json = JSON.stringify(response.data)
          setName(response.data)
          setNewId(response.data)
          if (json.length > 0) {
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  }

  //Asuntojen osoitteet otsikoksi
  useEffect(() =>{
    axios
        .get('http://localhost:8080/api/apartments')
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          let json;
          json = JSON.stringify(response.data);
          console.log("json " + json.address)
          json = response.data;

          if (json.length > 0) {
            console.log("json pituus isompi kuin 0")
            console.log(response.data)
            setApartments(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  },[])

  function showForm(id) {
    console.log("onclickfunction function")
    console.log("id passed " + id)
    //setNewRating("" + id);
    setShowModal(true)
    makeQueryForAddNewReview(id)
  }

  function showReviews(id){
    console.log("showReviews function")
    console.log("id passed " + id)
    //makeQueryForAddNewReview(1)
    setShowModal(true)
    showRatings(id)
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
      id: 1,
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

            setNewId('')
            setNewShape('')
            setNewComfort('')
            setNewGrade('')
            setNewWord('')
            if(response.status === 200)
              setMessage('Uuden arvostelun lisääminen onnistui!')
            else if(response.status === 401)
              setMessage('Uuden arvostelun lisääminen epäonnistui, täytä puuttuvat kentät!')
            setShowMessage(true)
            reset()
          })
  }

  //Asunnon kaikki arvostelut
  function showRatings(id){
    console.log("SHOW RATING")
    console.log("passed id: " + id)

    axios
        .get('http://localhost:8080/api/results?id='+id)
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          setRatings(response.data)
        })
  }

  return (
        <div style={ul}>
          {apartments.map(content => (
          <ul className="apartments"  key={''+content.id}>
              <figure>
                <img id="image" src="img/kimpitie.jpg" alt="kimpitie"/>
                <figcaption>
                  <h3>{content.address}</h3>
                </figcaption>
                <Button  id={content.id} onClick={() => showForm(content.id)} variant="light" className="rateButtons">Arvostele</Button>
                <Button id={content.id} onClick={() => showReviews(content.id)} variant="light">Katso arvostelut</Button>
              </figure>
          </ul>
          ))}

          <Modal
              show={showModal}
              onHide={handleCloseModal}
              backdrop="static"
              keyboard={false}
          >
            <Modal.Header closeButton onClick={reset}>
              {name.map(t => (
              <Modal.Title key={''+ t.id} id="apartmentaddress">Arvostelu kohteeseen: {t.address}</Modal.Title>
              ))}
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

            <div>
              <Table striped>
              <tbody>
              {ratings.map(c => (
                  <tr key={''+c.id}>
                    <td>
                      <p>{c.address}</p>
                      <p>{c.shape}</p>
                      <p>{c.comfort}</p>
                      <p>{c.grade}</p>
                      <p>{c.free_word}</p>
                    </td>
                  </tr>
              ))}
                </tbody>
              </Table>
            </div>
          </Modal>
        </div>
    );
}
export default Main
