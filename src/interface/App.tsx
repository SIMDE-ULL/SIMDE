import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import { Superescalar } from "../core/Superescalar/Superescalar";
import { t } from 'i18next';

import FileBarComponent from './components/Superescalar/navbar/FileBarComponent';
import AccessBarComponent from "./components/Superescalar/navbar/AccessBarComponent";

import GeneralTabComponent from "./components/Superescalar/tab/GeneralTabComponent";
import RegisterTabComponent from './components/Superescalar/tab/RegistersTabComponent';

import LoadModalComponent from "./components/Superescalar/modal/LoadModalComponent";
import SuperescalarConfigModalComponent from "./components/Superescalar/modal/SuperescalarConfigModalComponent";
import OptionsModalComponent from "./components/Superescalar/modal/OptionsModalComponent";
import AutorModalComponent from "./components/Superescalar/modal/AutorModalComponent";

import { translate } from "react-i18next";
import BatchModalComponent from "./components/Superescalar/modal/BatchModalComponent";
import BatchResultsModalComponent from "./components/Superescalar/modal/BatchResultsModalComponent";

import landingpage from "./components/landingpage/LandingPageComponent";
import projectpage from "./components/landingpage/ProjectPageComponent";

class App extends React.Component<any, any> {
   render() {
      return (
          <Router>
              <Structure />
          </Router>
     );
   }
}

const Structure = () => (
    <div className="pagebody">
      <Route exact path="/" component={landingpage} />
      <Route path="/Superescalares" component={Superescalares} />
      <Route path="/VLIW" component={VeryLong} />
      <Route path="/Project" component={projectpage} />
    </div>
);

const Superescalares = () => (
  <div className='smd'>
      <div className='navigation-bars'>
          <FileBarComponent />
          <AccessBarComponent />
      </div>
      <Tabs defaultActiveKey={1} id='working-area-tabs'>
          <Tab eventKey={1} title={t('accessBar.superescalar')}>
              <GeneralTabComponent />
          </Tab>
          <Tab eventKey={2} title={t('accessBar.memReg')}>
              <RegisterTabComponent />
          </Tab>
      </Tabs>
      <LoadModalComponent />
      <SuperescalarConfigModalComponent />
      <OptionsModalComponent />
      <AutorModalComponent />
      <BatchModalComponent />
      <BatchResultsModalComponent />
  </div>
);

const VeryLong = () => (
  <div className='smd'>
      <div className='navigation-bars'>
          <FileBarComponent />
          <AccessBarComponent />
      </div>
      <Tabs defaultActiveKey={1} id='working-area-tabs'>
          <Tab eventKey={1} title={t('accessBar.superescalar')}>
              <GeneralTabComponent />
          </Tab>
          <Tab eventKey={2} title={t('accessBar.memReg')}>
              <RegisterTabComponent />
          </Tab>
      </Tabs>
      <LoadModalComponent />
      <SuperescalarConfigModalComponent />
      <OptionsModalComponent />
      <AutorModalComponent />
      <BatchModalComponent />
      <BatchResultsModalComponent />
  </div>
);

export default translate('common', { wait: true })(App);
