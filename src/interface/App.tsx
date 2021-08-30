import * as React from "react";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { translate } from "react-i18next";
import LandingPageComponent from "./components/LandingPage/LandingPageComponent";
import ProjectPage from "./components/LandingPage/ProjectPageComponent";

import { SuperescalarComponent } from "./components/Superescalar/SuperescalarComponent";
import { VLIWComponent } from "./components/VLIW/VLIWComponent";


class App extends React.Component<any, any> {
   render() {
      return (
          <Router basename={process.env.PUBLIC_URL} >
              <Structure />
          </Router>
     );
   }
}

const Structure = () => (
    <div className="pagebody">
      <Route exact path="/" component={LandingPageComponent} />
      <Route path="/superescalar" component={SuperescalarComponent} />
      <Route path="/vliw" component={VLIWComponent} />
      <Route path="/project" component={ProjectPage} />
    </div>
);

export default translate('common', { wait: true })(App);
