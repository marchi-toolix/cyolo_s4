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
          <Route exact path="/main" component={Main} />
          <Route exact path="/" component={LoginScreen} />
        </Switch>
      </Router>
    </div>
  ));
}

export default App;
