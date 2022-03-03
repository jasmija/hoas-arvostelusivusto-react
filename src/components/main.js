import { Button, Form, Modal, Table, ListGroup, Accordion, Toast, ToastContainer} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Login from './login';

const Main = () => {

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

  const [chat, setChat] = useState([0]); //chatin sisältö
  const [content, setChatContent] = useState([0]); //chatin sisältö
  const [showChat, setShowChat] = useState(false); //chat sisällön näyttäminen/piilotus

  const [showModal, setShowModal] = useState(false); //modaali
  const handleCloseModal = () => setShowModal(false); //modaali sulku

  const [showModal2, setShowModal2] = useState(false); //modaali
  const handleCloseModal2= () => setShowModal2(false); //modaali sulku

  const [ratings, setRatings] = useState([0]) //arvostelut tietokannasta
  const imagePath = ["img/kimpitie.jpg", "img/berliininkatu.jpg", "img/hakaniemenranta.jpg", "img/siltakuja.jpg", "img/vaskivuorentie.jpg",  "img/juusintie.jpg", "img/kilonkallio.jpg","img/haukilahdenkuja.jpg", "img/leppäsuonkatu.jpg", "img/majurinkulma.jpg", "img/servinkuja.jpg",  "img/akanapolku.jpg"];

  const ul = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:'center',
    alignItems:'center',
    padding: 10,
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

  //Klikatun asunnon nimi asetetaan modaaalin otsikoksi
  function makeQueryForAddNewReview(id) {
    const apartment = id;
    console.log("id "+ apartment)

    axios
        .get('http://localhost:8080/api/address?id='+ apartment)
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          let json = JSON.stringify(response.data)
          setName(response.data)
          //setNewId(response.data)
          if (json.length > 0) {
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  }

  //Asuntojen osoitteet otsikoksi kun sivu ladataan
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
            //setImages(imagePath)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })

    axios
        .get('http://localhost:8080/api/chat')
        .then(response => {
          console.log('Vastaus chat: ' + JSON.stringify(response.data))
          let json;
          json = JSON.stringify(response.data);
          json = response.data;

          if (json.length > 0) {
            console.log("json pituus isompi kuin 0")
            console.log(response.data)
            setChat(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  },[])

  function showForm(id) {
    console.log("showForm function function")
    console.log("id passed " + id)
    //setNewId(JSON.stringify(id))
    //console.log("newId " + newId)
    //setNewRating("" + id);
    setShowModal(true)
    makeQueryForAddNewReview(id)
  }

  function showReviews(id){
    console.log("showReviews function")
    console.log("id passed " + id)
    //makeQueryForAddNewReview(1)
    setShowModal2(true)
    makeQueryForAddNewReview(id)
    showRatings(id)
  }

  /*function showAnswers(id){
    console.log("showAnswers function")
    //setShowChat(true)
    openChat(id)
  }*/

  //Chat kysymysten vastaukset
  function openChat(id) {

    axios
        .get('http://localhost:8080/api/chatcontent?id='+ id)
        .then(response => {
          console.log('Vastaus chat content: ' + JSON.stringify(response.data))
          let json = JSON.stringify(response.data)
          //const ReactElement = React.createElement('p', null, response.data)
          //setShowChat(true)
          if (json.length > 0) {
            setChatContent(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
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

    console.log("ratingobject newId " + newId)

    const ratingObject = {
      id: "1",
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

  //Arvostelujen keskiarvo
  function countAverage(json) {

    let sumcomfort = 0;
    let sumgrade = 0;
    let sumshape = 0;

    for (let i = 0; i < json.length; i++) {
      sumcomfort = sumcomfort + json[i].comfort;
      sumgrade = sumgrade + json[i].grade;

      if (json[i].shape === 'Välttävä') {
        json[i].shape = 1;
      } else if (json[i].shape === 'Tyydyttävä') {
        json[i].shape = 2;
      } else if (json[i].shape === 'Hyvä') {
        json[i].shape = 3;
      } else if (json[i].shape === 'Kiitettävä') {
        json[i].shape = 4;
      } else if (json[i].shape === 'Erinomainen') {
        json[i].shape = 5;
      }
      sumshape = sumshape + json[i].shape;
    }

    const averageshape = (sumshape / json.length).toFixed(0);
    const averagecomfort = (sumcomfort / json.length).toFixed(0);
    const averagegrade = (sumgrade / json.length).toFixed(0);

    console.log("averageshape " + averageshape + ", averagecomfort " + averagecomfort + ", " + "averagegrade " + averagegrade)

  }

  //Näytetäään asunnon kaikki arvostelut
  function showRatings(id){
    console.log("SHOW RATING")
    console.log("passed id: " + id)
    let json;

    axios
        .get('http://localhost:8080/api/results?id='+id)
        .then(response => {
          console.log('Vastaus: ' + JSON.stringify(response.data))
          setRatings([])
          setRatings(response.data)
          json = response.data;
          countAverage(json);
        })
  }

  return (
      <div id="root">
        <div style={ul}>

          {apartments.map(content => (
              <ul className="apartments"  key={''+content.id}>
                <figure>
                  <img  id="image" src={""+content.image} alt="kimpitie"/>
                  <figcaption style={{backgroundColor: 'rgba(0,0,0, 0.8)', color: 'white', display: "flex", flexWrap: "wrap"}} >
                    <h3>{content.address}</h3>
                    <Button style={{margin: 2}} id={content.id} onClick={() => showForm(content.id)} variant="light" className="rateButtons">Arvostele</Button>
                    <Button style={{margin: 2}} id={content.id} onClick={() => showReviews(content.id)} variant="light">Katso arvostelut</Button>
                  </figcaption>
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
                  <Modal.Title key={''+ t.id} id="apartmentaddress">Arvostelu kohteeseen: {t.address} </Modal.Title>
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
          </Modal>

          <Modal id="modal"
              show={showModal2}
              onHide={handleCloseModal2}
              backdrop="static"
              keyboard={false}>
            <Modal.Header closeButton>
              {name.map(t => (
                  <Modal.Title key={''+ t.id} id="apartmentaddress">Arvostelut kohteesta: {t.address}</Modal.Title>
              ))}
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
          </Modal>
        </div>

        <div>
          <h3>Keskustelupalsta</h3>
          {chat.map(chat => (
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header key={''+chat.id} >{chat.header}</Accordion.Header>
                  <Accordion.Body>
                    Vastaukset
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
          ))}
        </div>

        {chat.map(chat => (
            <ToastContainer>
              <Toast style={{margin: 10}}>
                <Toast.Header>
                  <img src="" className="rounded me-2" alt="" />
                  <strong className="me-auto">{chat.username}</strong>
                  <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body key={''+chat.id}>{chat.header}</Toast.Body>
                <Button variant={'dark'} >Vastaa</Button>
              </Toast>
            </ToastContainer>
        ))}

      </div>
  );
}
export default Main





