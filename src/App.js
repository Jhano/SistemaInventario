import React from 'react';
import Login from './screens/login';
import history from './history'
import Asignatura from './screens/asignatura';
import { BrowserRouter as Router,Switch,Route } from 'react-router-dom';

import './App.css';

function App() {
  
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path="/asignatura" component={Asignatura}/>
        </Switch>
      </Router>
       
        
      
     
    </div>
  );
}

export default App;
