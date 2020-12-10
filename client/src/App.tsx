import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./screens/Main";
import {LoginScreen} from "./screens/LoginScreen";
import { useObserver } from "mobx-react-lite";

const App: React.FC = () => {
  return useObserver(() => (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/login" component={LoginScreen} />
        </Switch>
      </Router>
    </div>
  ));
}

export default App;
