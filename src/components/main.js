import {Button, Form, ListGroup, Modal, Table} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/main.css';

const Main = () => {

  const [newId, setNewId] = useState(0)
  const [newShape, setNewShape] = useState("Erinomainen")
  const [newComfort, setNewComfort] = useState("1")
  const [newGrade, setNewGrade] = useState("1")
  const [newWord, setNewWord] = useState("")
  const [validated, setValidate] = useState("")

  const [newAnswer, setNewAnswer] = useState("")
  const [newChatId, setNewChatId] = useState(0)
  const [validatedForm, setValidateForm] = useState("")
  const [chatMessage, setChatMessage] = useState('');

  const [formMessage, setMessage] = useState(''); //arvostelu lisätty onnistuneesti teksti
  const [showMessage, setShowMessage] = useState(false); //tekstin näyttäminen/piilotus

  const [apartments, setApartments] = useState([0]) //asunnot tietokannasta sivulle
  const [name, setName] = useState([0]); //asuntojen nimet otsikoksi

  const [chat, setChat] = useState([0]); //chatin sisältö
  const [content, setChatContent] = useState([0]); //chatin sisältö

  const [showModal, setShowModal] = useState(false); //modaali
  //modaali sulku
  const handleCloseModal = () => {
    setShowModal(false);
    setMessage(false);
    reset()
  }

  const [showModal2, setShowModal2] = useState(false); //modaali
  const handleCloseModal2= () => setShowModal2(false); //modaali sulku

  const [showModal3, setShowModal3] = useState(false); //modaali
  //modaali sulku
  const handleCloseModal3= () => {
    setShowModal3(false);
    setChatMessage(false);
    resetChatForm()
  }

  const [ratings, setRatings] = useState([0]) //arvostelut tietokannasta
  const imagePath = ["img/kimpitie.jpg", "img/berliininkatu.jpg", "img/hakaniemenranta.jpg", "img/siltakuja.jpg", "img/vaskivuorentie.jpg",  "img/juusintie.jpg", "img/kilonkallio.jpg","img/haukilahdenkuja.jpg", "img/leppäsuonkatu.jpg", "img/majurinkulma.jpg", "img/servinkuja.jpg",  "img/akanapolku.jpg"];

  const [userBoolean, setUserBoolean] = useState(false);

  const [newUsername, setNewUsername] = useState(0)
  const [newHeader, setNewChatHeader] = useState(0)

  const ul = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:'center',
    alignItems:'center',
    padding: 10,
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');

    //Käyttäjänimi chattiin
    let user = JSON.parse(loggedInUser);
    setNewUsername(user.username)

    if (loggedInUser) {
      setUserBoolean(true);
    }
  }, []);

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

  const handleAnswerChange = (event) =>{
    console.log(event.target.value)
    setNewAnswer(event.target.value)
  }

  const reset = () => {
    document.getElementById("form").reset();
    setValidate(false)
  }

  const resetChatForm = () => {
    document.getElementById("formChat").reset();
    setValidateForm(false)
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
          if (json.length > 0) {
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  }

  //Asuntojen osoitteet otsikoksi kun sivu ladataan
  useEffect(() => {
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
            setFilteredData(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })

    axios
        .get('http://localhost:8080/api/chat')
        .then(response => {
          console.log('Vastaus chat: ' + JSON.stringify(response.data))
          let json;
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
    console.log("showForm function")
    console.log("id passed " + id)
    setNewId(id)
    console.log("newId " + newId)
    setShowModal(true)
    makeQueryForAddNewReview(id)
  }

  function showReviews(id){
    console.log("showReviews function")
    console.log("id passed " + id)
    setShowModal2(true)
    makeQueryForAddNewReview(id)
    showRatings(id)
  }

  function showAnswers(id){
    console.log("showAnswers function")
    console.log("chat id " + id)
    setShowModal3(true)
    openChat(id)
    setNewChatId(id)
  }


  //Chat kysymysten vastaukset
  function openChat(id) {

    axios
        .get('http://localhost:8080/api/chatcontent?id='+ id)
        .then(response => {
          console.log('Vastaus chat content: ' + JSON.stringify(response.data))
          let json = JSON.stringify(response.data)
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
      id: newId,
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

  const addAnswer = event => {

    console.log("SEND CHAT ANSWER")
    event.preventDefault()

    const form = event.currentTarget;
    if(form.checkValidity() === false){
      event.stopPropagation();
    }
    setValidateForm(true);
    if(form.checkValidity() === false){
      return
    }
    setValidateForm(true);

    const answerObject = {
      id_chat: newChatId,
      answer: newAnswer,
    }
    console.log('answerObject: ' + answerObject.id_chat + ", " + answerObject.answer)

    axios
        .post('http://localhost:8080/api/addchatanswer', answerObject)
        .then(response => {
          console.log('answerObject: ' + JSON.stringify(answerObject))
          console.log(response)

          if(response.status === 200)
            setChatMessage('Uuden chatin lisääminen onnistui!')
          else if(response.status === 401)
            setChatMessage('Uuden chatin lisääminen epäonnistui, täytä puuttuvat kentät!')

          resetChatForm()
        })
  }

  const [wordEntered, setWordEntered] = useState("");
  const [filteredData, setFilteredData] = useState([]);



  const handleFilter = () => {
    const searchWord = document.getElementById("search").value;
    setWordEntered(searchWord);
    const newFilter = apartments.filter((value) => {
      return value.address.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === '') {
      setFilteredData(apartments);
    } else {
      setFilteredData(newFilter);
    }
  };


  const addChatQuestion = event => {

    console.log("SEND CHAT QUESTION")
    event.preventDefault()

    const form = event.currentTarget;
    if(form.checkValidity() === false){
      event.stopPropagation();
    }
    //setValidateForm(true);
    if(form.checkValidity() === false){
      return
    }
    setValidateForm(true);

    const questionObject = {
      username: newUsername,
      header: newHeader,
    }
    console.log('questionObject: ' + questionObject.username + ", " + questionObject.header)

    axios
        .post('http://localhost:8080/api/addchat', questionObject)
        .then(response => {
          console.log('questionObject: ' + JSON.stringify(questionObject))
          console.log(response)

          if(response.status === 200)
            setChatMessage('Uuden kysymyksen lisääminen onnistui!')
          else if(response.status === 401)
            setChatMessage('Uuden kysymyksen lisääminen epäonnistui, täytä puuttuvat kentät!')

          //resetChatForm()
        })
  }

  const handleQuestionChange = (event) =>{
    console.log(event.target.value)
    setNewChatHeader(event.target.value)
  }

  return (
      <div id="root">
        <div id="filter">
          <h3>Haku</h3>
        <input type="search"
               className="d-flex"
               id="search"
               placeholder="Hae kohdetta..."
               autoComplete="off"
               autoFocus
               style={{padding: 8}}
               onChange={handleFilter}
        />
        </div>
        <div style={ul}>
          {filteredData.map(content => (
              <ul className="apartments"  key={''+content.id}>
                <figure>
                  <figcaption style={{backgroundColor: 'rgba(0,0,0, 0.8)', color: 'white'}}>
                    <h3>{content.address}</h3>
                    <div id="buttons">
                      {userBoolean && <Button id={content.id} onClick={() => showForm(content.id)} variant="light">Arvostele</Button>}
                      <Button style={{marginLeft: 5}} id={content.id} onClick={() => showReviews(content.id)} variant="light">Katso</Button>
                    </div>
                    </figcaption>
                <img id="image" src={""+content.image} alt="kimpitie" />
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
                  <Modal.Title key={''+ t.id} id="apartmentaddress">Arvostelu kohteeseen: <b>{t.address}</b> </Modal.Title>
              ))}
            </Modal.Header>
            <Modal.Body>
              <Form form id="form" noValidate validated={validated} onSubmit={addRating}>
                <Form.Group>
                  <Form.Label style={{fontSize:"20px"}}>Kunto</Form.Label>
                  <br />
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
                  <Form.Label style={{fontSize:"20px"}}>Viihtyvyys</Form.Label>
                  <br />
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
                  <Form.Label style={{fontSize:"20px"}}>Kokonaisarvosana</Form.Label>
                  <br />
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
                  <Form.Label style={{fontSize:"20px"}}>Vapaa sana</Form.Label>
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
                  <Modal.Title key={''+ t.id} id="apartmentaddress">Arvostelut kohteesta: <b>{t.address}</b></Modal.Title>
              ))}
            </Modal.Header>
            <Modal.Body>
              <Table striped>
                <tbody>
                {ratings.map(c => (
                    <tr key={''+c.id}>
                      <td>
                        <p style={{fontSize:"22px"}}>Arvostelu lisätty: {c.date}</p>
                        <p style={{display: 'inline-block', marginRight: 5}}><b>Kokonaisarvosana: </b></p><p style={{fontSize:"20px", display: 'inline-block'}}>{c.grade}</p>
                        <br />
                        <p style={{display: 'inline-block', marginRight: 5}}><b>Kunto: </b></p><p style={{fontSize:"20px", display: 'inline-block'}}>{c.shape}</p>
                        <br />
                        <p style={{display: 'inline-block', marginRight: 5}}><b>Viihtyvyys: </b></p><p style={{fontSize:"20px", display: 'inline-block'}}>{c.comfort}</p>
                        <br />
                        <p><b>Vapaa sana: </b>{c.free_word}</p>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>
        </div>

        <div>
          <h3 style={{justifyContent:'center',
            alignItems:'center', display: "flex",
            flexWrap: "wrap"}}>Keskustelupalsta</h3>

          {chat.map(chat => (
              <ListGroup style={{justifyContent:'center',
                alignItems:'center'}}>
                <ListGroup.Item onClick={() => showAnswers(chat.id)} key={''+chat.id}>{chat.header} {chat.username}</ListGroup.Item>
              </ListGroup>
          ))}
        </div>

        <Form style={{justifyContent:'center',
          alignItems:'center'}} form id="formChat" noValidate onSubmit={addChatQuestion}>
          <Form.Group >
            <Form.Label>Kirjoita uusi kysymys:</Form.Label>
            <Form.Control
                onChange={handleQuestionChange}
                required
                type="text"
                placeholder=""
            />
            <Form.Control.Feedback type="invalid">Täytä kenttä!</Form.Control.Feedback>
          </Form.Group>
          <p></p>
          <br/>
          <Button type="submit">Lähetä kysymys</Button>
          <br/>
        </Form>

        <Modal
               show={showModal3}
               onHide={handleCloseModal3}
               backdrop="static"
               keyboard={false}>
          <Modal.Header closeButton>
                <Modal.Title>Vastaukset:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped>
              <tbody>
              {content.map(answers => (
                  <tr>
                    <td>
                      <p key={''+ answers.id_chat}>{answers.answer}</p>
                    </td>
                  </tr>
              ))}
              <br/>
              </tbody>
            </Table>

            <Form form id="formChat" noValidate validated={validatedForm} onSubmit={addAnswer}>
              <Form.Group>
                <Form.Label>Kirjoita vastaus:</Form.Label>
                <Form.Control
                    onChange={handleAnswerChange}
                    required
                    type="text"
                    placeholder=""
                />
                <Form.Control.Feedback type="invalid">Täytä kenttä!</Form.Control.Feedback>
              </Form.Group>
              <p>{chatMessage}</p>
              <br/>
              <Button type="submit">Lähetä vastaus</Button>
              <br/>
            </Form>

          </Modal.Body>
        </Modal>
        <div className="img-fluid shadow-4" style={{height: 80, backgroundColor: "#282c34", marginTop: 15}} />
      </div>
  );
}
export default Main





