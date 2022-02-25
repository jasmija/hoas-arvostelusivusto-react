import './App.css';
import Login from './components/login';
import Register from './components/register';
import Home from './components/main';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

const App = () => {

  return (
      <div id="container">
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <a href="/"><img src="img/logo.png" alt='HOAS-arvostelut-logo'/></a>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="header">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>

          {/*Always keep "<Route path="/"> last in <Switch>*/}
          <Route path="/">
            <Home />
          </Route>

        </Switch>
        </Router>
      </div>
  )

}
export default App
