import * as React from "react";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { translate } from "react-i18next";
import LandingPageComponent from "./components/LandingPage/LandingPageComponent";
import projectpage from "./components/LandingPage/ProjectPageComponent";

import { SuperescalarComponent } from "./components/Superescalar/SuperescalarComponent";
import { VLIWComponent } from "./components/VLIW/VLIWComponent";


class App extends React.Component<any, any> {
   render() {
      return (
          <Router basename={"/"} >
              <Structure />
          </Router>
     );
   }
}

const Structure = () => (
    <div className="pagebody">
      <Route exact path="/" component={LandingPageComponent} />
      <Route path="/Superescalar" component={SuperescalarComponent} />
      <Route path="/VLIW" component={VLIWComponent} />
      <Route path="/Project" component={projectpage} />
    </div>
);

export default translate('common', { wait: true })(App);
