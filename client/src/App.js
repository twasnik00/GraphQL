import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../src/pages/Home';
import ShowPage from '../src/pages/ShowPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/people/:id" component={ShowPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
