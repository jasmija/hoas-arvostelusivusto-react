import {Button, Form, ListGroup, Modal, Table} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/main.css';

const Main = () => {

  const [apartments, setApartments] = useState([0])
  const [name, setName] = useState([0]);
  const [ratings, setRatings] = useState([0])
  const [userBoolean, setUserBoolean] = useState(false);

  //Hooks for add new review
  const [newId, setNewId] = useState(0)
  const [newShape, setNewShape] = useState("Erinomainen")
  const [newComfort, setNewComfort] = useState("1")
  const [newGrade, setNewGrade] = useState("1")
  const [newWord, setNewWord] = useState("")

  //Hooks for review form validation
  const [validated, setValidate] = useState("")
  const [formMessage, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  //Hooks for chat
  const [newAnswer, setNewAnswer] = useState("")
  const [newChatId, setNewChatId] = useState(0)
  const [chat, setChat] = useState([0]);
  const [content, setChatContent] = useState([0]);
  const [newUsername, setNewUsername] = useState(0)
  const [newHeader, setNewChatHeader] = useState(0)
  const [header, setChatHeader] = useState([])

  //Hooks for chat validation
  const [validatedForm, setValidateForm] = useState("")
  const [chatMessage, setChatMessage] = useState('');
  const [validatedQuestionForm, setValidateQuestionForm] = useState("")
  const [showChatQuestionMessage, setShowChatQuestionMessage] = useState("");

  //Modal for rating form
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
    setMessage(false);
    reset()
  }

  //Modal for reviews
  const [showModal2, setShowModal2] = useState(false);
  const handleCloseModal2= () => setShowModal2(false);

  //Modal for chat
  const [showModal3, setShowModal3] = useState(false);
  const handleCloseModal3= () => {
    setShowModal3(false);
    setChatMessage(false);
    resetChatForm()
  }

  const ul = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:'center',
    alignItems:'center',
    padding: 10,
  }

  //If user is logged in set userBoolean variable true
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');

    if (loggedInUser) {
      setUserBoolean(true);

      //Set username for chat
      let user = JSON.parse(loggedInUser);
      setNewUsername(user.username)
    }
  }, []);

  //Handle functions for form input fields
  const handleShapeChange = (event) => {
    setNewShape(event.target.value)
  }

  const handleComfortChange = (event) => {
    setNewComfort(event.target.value)
  }

  const handleGradeChange = (event) => {
    setNewGrade(event.target.value)
  }

  const handleWordChange = (event) => {
    setNewWord(event.target.value)
  }

  const handleAnswerChange = (event) =>{
    setNewAnswer(event.target.value)
  }

  const handleQuestionChange = (event) =>{
    setNewChatHeader(event.target.value)
  }

  //Reset functions for forms
  const resetQuestionForm = () => {
    document.getElementById("formChatQuestion").reset();
    setValidateQuestionForm(false)
  }

  const reset = () => {
    document.getElementById("form").reset();
    setValidate(false)
  }

  const resetChatForm = () => {
    document.getElementById("formChat").reset();
    setValidateForm(false)
  }

  //Set apartment name to modal header
  function makeQueryForAddNewReview(id) {
    const apartment = id;

    axios
        .get('http://localhost:8080/api/address?id='+ apartment)
        .then(response => {
          let json = JSON.stringify(response.data)

          if (json.length > 0) {
            setName(response.data)
          } else {
            console.log("Ei löytynyt asuntoa");
          }
        })
  }

  //Set apartment addresses and chat content from database when page loads
  useEffect(() => {

    axios
        .get('http://localhost:8080/api/apartments')
        .then(response => {
          let json = response.data;

          if (json.length > 0) {
            setApartments(response.data)
            setFilteredData(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })

    axios
        .get('http://localhost:8080/api/chat')
        .then(response => {
          let json = response.data;

          if (json.length > 0) {
            setChat(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  },[])

  //Get clicked chats header from database
  function getChatHeader(id) {

    axios
        .get('http://localhost:8080/api/chatheader?id='+ id)
        .then(response => {
          let json = JSON.stringify(response.data)

          if (json.length > 0) {
            setChatHeader(response.data)
          } else {
            console.log("Ei löytynyt chatin otsikkoa");
          }
        })
  }

  //Get answers for chat questions from database
  function openChat(id) {

    axios
        .get('http://localhost:8080/api/chatcontent?id='+ id)
        .then(response => {
          let json = JSON.stringify(response.data)

          if (json.length > 0) {
            setChatContent(response.data)
          } else {
            console.log("Ei löytynyt vastauksia");
          }
        })
  }
  
  //Add new apartment review to database
  const addRating = event =>{

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
      id: newId,
      shape: newShape,
      comfort: newComfort,
      grade: newGrade,
      word: newWord
    }

    axios
        .post('http://localhost:8080/api/sendform', ratingObject)
        .then(response => {

          if(response.status === 200)
            setMessage('Uuden arvostelun lisääminen onnistui!')
          else if(response.status === 401)
            setMessage('Uuden arvostelun lisääminen epäonnistui, täytä puuttuvat kentät!')
          setShowMessage(true)

          reset()
        })
  }

  //Show all reviews for a specific apartment
  function showRatings(id){

    axios
        .get('http://localhost:8080/api/results?id='+id)
        .then(response => {
          setRatings([])
          setRatings(response.data)
        })
  }

  //Add answer for chat question
  const addAnswer = event => {

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
      username: newUsername
    }

    axios
        .post('http://localhost:8080/api/addchatanswer', answerObject)
        .then(response => {

          if(response.status === 200){
            setUpdatedChatAnswers(newChatId)
            setChatMessage('Uuden vastauksen lisääminen onnistui!')
          }
          else if(response.status === 401)
            setChatMessage('Uuden vastauksen lisääminen epäonnistui, täytä puuttuvat kentät!')

          resetChatForm()
        })
  }

  //Get updated chat answers from database
  function setUpdatedChatAnswers(id){

    axios
        .get('http://localhost:8080/api/chatcontent?id='+ id)
        .then(response => {
          let json = JSON.stringify(response.data)

          if (json.length > 0) {
            setChatContent(response.data)
          } else {
            console.log("Ei löytynyt vastauksia");
          }
        })
  }

  //Add new question to chat
  const addChatQuestion = event => {

    event.preventDefault()

    const form = event.currentTarget;
    if(form.checkValidity() === false){
      event.stopPropagation();
    }
    setValidateQuestionForm(true);
    if(form.checkValidity() === false){
      return
    }
    setValidateQuestionForm(true);

    const questionObject = {
      username: newUsername,
      header: newHeader,
    }

    axios
        .post('http://localhost:8080/api/addchat', questionObject)
        .then(response => {

          if(response.status === 200){
            setUpdatedChatContents()
            setShowChatQuestionMessage('Uuden kysymyksen lisääminen onnistui!')
          }
          else if(response.status === 401)
            setShowChatQuestionMessage('Uuden kysymyksen lisääminen epäonnistui, täytä puuttuvat kentät!')

          resetQuestionForm()
        })
  }

  //Get updated chat data from database
  function setUpdatedChatContents(){
    console.log("ennen get")
    axios
        .get('http://localhost:8080/api/chat')
        .then(response => {

          console.log(response.data)
          let json = response.data;

          if (json.length > 0) {
            console.log("inside if")
            setChat(response.data)
          } else {
            console.log("Ei löytynyt yhtäkään asuntoa");
          }
        })
  }

  const [wordEntered, setWordEntered] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  //Filter apartments by user input
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

  //Set id for review form, show modal, and calls function which show apartment address in modal header
  function showForm(id) {
    setNewId(id)
    setShowModal(true)
    makeQueryForAddNewReview(id)
  }

  //Show review modal, calls function which show apartment address in modal header, calls function which get all reviews from database
  function showReviews(id){
    setShowModal2(true)
    makeQueryForAddNewReview(id)
    showRatings(id)
  }

  //Show chat answers modal, calls function which get chat header from database to modal header, calls function which get chat answers from database
  function showAnswers(id){
    setShowModal3(true)
    getChatHeader(id)
    openChat(id)
    setNewChatId(id)
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
                <img id="image" src={""+content.image} alt="img" />
                </figure>
              </ul>
          ))}

          <Modal
              show={showModal}
              onHide={handleCloseModal}
              backdrop="static"
              keyboard={false}
          >
            <Modal.Header style={{backgroundColor: 'rgba(0,0,0, 0.8)', color: 'white'}} closeButton closeVariant={'white'} onClick={reset}>
              {name.map(content => (
                  <Modal.Title key={''+ content.id} id="apartmentaddress">Arvostelu kohteeseen: <b>{content.address}</b> </Modal.Title>
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
                <Button variant="secondary" type="submit">Lähetä</Button>
                <br/>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal id="modal"
              show={showModal2}
              onHide={handleCloseModal2}
              backdrop="static"
              keyboard={false}>
            <Modal.Header style={{backgroundColor: 'rgba(0,0,0, 0.8)', color: 'white'}} closeButton closeVariant={'white'}>
              {name.map(content => (
                  <Modal.Title key={''+ content.id} id="apartmentaddress">Arvostelut kohteesta: <b>{content.address}</b></Modal.Title>
              ))}
            </Modal.Header>
            <Modal.Body>
              <Table striped>
                <tbody>
                {ratings.map(content => (
                    <tr key={''+content.id}>
                      <td>
                        <p style={{fontSize:"22px"}}>Arvostelu lisätty: {content.date}</p>
                        <p style={{display: 'inline-block', marginRight: 5}}><b>Kokonaisarvosana: </b></p><p style={{fontSize:"20px", display: 'inline-block'}}>{content.grade}</p>
                        <br />
                        <p style={{display: 'inline-block', marginRight: 5}}><b>Kunto: </b></p><p style={{fontSize:"20px", display: 'inline-block'}}>{content.shape}</p>
                        <br />
                        <p style={{display: 'inline-block', marginRight: 5}}><b>Viihtyvyys: </b></p><p style={{fontSize:"20px", display: 'inline-block'}}>{content.comfort}</p>
                        <br />
                        <p><b>Vapaa sana: </b>{content.free_word}</p>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>
        </div>

        <div style={{justifyContent:'center',
          alignItems:'center'}}>
          <h3 style={{justifyContent:'center',
            alignItems:'center', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0, 0.8)', color: 'white', maxWidth: 600, display: 'block', margin: 'auto', borderRadius: 5, padding: 5}}>Keskustelupalsta</h3>
          {chat.map(content => (
              <ListGroup style={{justifyContent:'center',
                alignItems:'center'}}>
                <ListGroup.Item action variant="dark" style={{maxWidth: 600, justifyContent:'center',
                  alignItems:'center'}} onClick={() => showAnswers(content.id)} key={''+content.id}> <p style={{display: 'flex', flexWrap: 'wrap'}}><p style={{textDecoration: 'underline'}}>{content.username}</p> <p style={{marginTop: 0, right: 2, position: 'absolute'}}>{content.date}</p></p> <p style={{fontWeight: 'bold', marginRight: 5}}>{content.header}</p></ListGroup.Item>
              </ListGroup>
          ))}

          {userBoolean &&<Form  form id="formChatQuestion" noValidate validated={validatedQuestionForm} onSubmit={addChatQuestion}>
            <Form.Group>
              <Form.Label style={{fontWeight: 'bold'}}>Kirjoita uusi kysymys:</Form.Label>
              <Form.Control style={{display: 'block', margin: 'auto', justifyContent:'center',
                alignItems:'center', maxWidth: 600}}
                  onChange={handleQuestionChange}
                  required
                  type="text"
                  placeholder=""
              />
              <Form.Control.Feedback type="invalid">Täytä kenttä!</Form.Control.Feedback>
              <p> {showChatQuestionMessage}</p>
            </Form.Group>
            <p></p>
            <br/>
             <Button variant="secondary" type="submit">Lähetä kysymys</Button>
            <br/>
          </Form>}

        </div>
        <Modal
               show={showModal3}
               onHide={handleCloseModal3}
               backdrop="static"
               keyboard={false}>
          <Modal.Header style={{backgroundColor: 'rgba(0,0,0, 0.8)', color: 'white'}} closeButton closeVariant={'white'}>
            {header.map(content => (
                <Modal.Title key={''+ content.id}>{content.header}</Modal.Title>
            ))}
          </Modal.Header>
          <Modal.Body>
            <Table striped>
              <tbody>
              {content.map(content => (
                  <tr>
                    <td>
                      <p key={''+ content.id_chat}> <p style={{display: 'flex', flexWrap: 'wrap'}}><p style={{ textDecoration: 'underline'}}>{content.username}</p> <p style={{marginTop: 0, right: 20, position: 'absolute'}}>{content.date}</p> </p> <p style={{fontWeight: 'bold', marginRight: 5}}> {content.answer}</p> </p>
                    </td>
                  </tr>
              ))}
              <br/>
              </tbody>
            </Table>

            {userBoolean &&<Form form id="formChat" noValidate validated={validatedForm} onSubmit={addAnswer}>
              <Form.Group>
                <Form.Label  style={{fontWeight: 'bold'}}>Kirjoita vastaus:</Form.Label>
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
               <Button variant="secondary" type="submit">Lähetä vastaus</Button>
              <br/>
            </Form>}

          </Modal.Body>
        </Modal>
        <div className="img-fluid shadow-4" style={{height: 80, backgroundColor: "#282c34", marginTop: 15}} />
      </div>
  );
}
export default Main





