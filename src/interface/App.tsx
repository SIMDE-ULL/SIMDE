import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";

import { Superescalar } from "../core/Superescalar/Superescalar";
import { t } from 'i18next';

import FileBarComponent from './components/navbar/FileBarComponent';
import AccessBarComponent from "./components/navbar/AccessBarComponent";

import GeneralTabComponent from "./components/tab/GeneralTabComponent";
import { RegisterTabComponent } from './components/tab/RegistersTabComponent';

import LoadModalComponent from "./components/modal/LoadModalComponent";
import SuperescalarConfigModalComponent from "./components/modal/SuperescalarConfigModalComponent";
import OptionsModalComponent from "./components/modal/OptionsModalComponent";
import AutorModalComponent from "./components/modal/AutorModalComponent";

import { translate } from "react-i18next";

class App extends React.Component<any, any> {
   constructor(props: Superescalar) {
      super(props);
  }

   render() {
      return (
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
        </div>
     );
   }
}

export default translate('common', { wait: true })(App);
