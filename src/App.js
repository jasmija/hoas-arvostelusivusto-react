import './App.css';
import Login from './components/login';
import Register from './components/register';
import Home from './components/main';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {Navbar, Nav, Button} from 'react-bootstrap';
import {useEffect, useState} from 'react';

const App = () => {

  const [user, setUser] = useState();
  const [userBoolean, setUserBoolean] = useState(false);

  // Check user's localstorage for token.
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    // If token is found, set "setUserBoolean" to true which is used to show parts of page only to logged in users.
    // Also get username from token and show it in navbar.
    if (loggedInUser) {
      setUserBoolean(true);
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // Clear localstorage when log out is clicked.
  const handleLogout = () => {
    setUserBoolean(false);
    localStorage.clear();
    window.location.href = '/';
  };

  return (
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <a href="/"><img className="img-fluid shadow-4" src="img/logo.png" alt="HOAS-arvostelut-logo"
                           style={{maxHeight: 80}}/></a>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="nav navbar-nav ms-auto">
              <Button variant="secondary"><Nav.Link as={Link} to="/">Etusivu</Nav.Link></Button>
              {!userBoolean && <Button variant="secondary"><Nav.Link as={Link} to="/login">Kirjaudu</Nav.Link></Button>}
              {!userBoolean && <Button variant="secondary"><Nav.Link as={Link} to="/register">Rekisteröidy</Nav.Link></Button>}
            </Nav>
            {userBoolean && <div id="userControl">
              <p id="loggedInUser">Hei {user.username}</p>
              <Nav.Link id="logOutText" onClick={handleLogout}>Kirjaudu ulos</Nav.Link>
            </div>}
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/login">
            <Login  />
          </Route>
          <Route path="/register">
            <Register />
          </Route>

          {/*Always keep "<Route path="/">" last in <Switch>*/}
          <Route path="/">
            <Home />
          </Route>

        </Switch>
      </Router>
  );
};

export default App;
