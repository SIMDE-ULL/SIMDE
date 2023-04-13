import * as React from "react";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
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
    <React.Suspense fallback={<div>Loading... </div>}>
      <Route path="/" element={LandingPageComponent} />
      <Route path="/superescalar" element={SuperescalarComponent} />
      <Route path="/vliw" element={VLIWComponent} />
      <Route path="/project" element={ProjectPage} />
    </React.Suspense>
    </div>
);

export default App;
