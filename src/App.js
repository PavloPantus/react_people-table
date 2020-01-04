import React from 'react';
import './App.scss';
import {
  Route,
} from 'react-router-dom';

import HomePage from './HomePage';
import PeopleTable from './PeopleTable';

const App = () => (
  <div className="App">
    <Route exact path="/" component={HomePage} />
    <Route path="/people/:person?" component={PeopleTable} />
  </div>
);

export default App;
