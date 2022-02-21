import './App.css';
import Login from "./components/login.js";
import Register from "./components/register.js";
import Home from "./components/main.js";
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter as Router,
  Switch, Route,
} from 'react-router-dom';
import {
  Container
  , Navbar, Nav
}from 'react-bootstrap';

const App = () => {


  return (
      <div id="container">
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <a href="/"><img src="img/logo.png" /></a>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="header">
                <li><Nav.Link to="/home">Home</Nav.Link></li>
                <li><Nav.Link to="/register">Register</Nav.Link></li>
                <li><Nav.Link to="/login">Login</Nav.Link></li>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
        </Router>
      </div>
  )

}
export default App
