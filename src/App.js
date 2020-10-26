import React from 'react';
import { Provider } from 'react-redux';
import Players from './components/Players/Players';
import Timer from './components/Timer/Timer';
import store from './store';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom';
import Register from './components/Register/Register';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/' exact component={Players} />
          <Route path='/match' component={Timer} />
          <Route path='/register' component={Register} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
