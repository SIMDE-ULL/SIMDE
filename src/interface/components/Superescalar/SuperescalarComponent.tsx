import * as React from "react";
import FileReaderInput from '../Common/FileReaderInput';
import { t } from 'i18next';
import { Tabs, Tab } from "react-bootstrap";

import FileBarComponent from './navbar/FileBarComponent';
import AccessBarComponent from "./navbar/AccessBarComponent";

import GeneralTabComponent from "./tab/GeneralTabComponent";
import RegisterTabComponent from './tab/RegistersTabComponent';

import LoadModalComponent from "./modal/LoadModalComponent";
import SuperescalarConfigModalComponent from "./modal/SuperescalarConfigModalComponent";
import SuperescalarLoadContentModalComponent from "./modal/SuperescalarLoadContentModalComponent";

import OptionsModalComponent from "./modal/OptionsModalComponent";
import AutorModalComponent from "./modal/AutorModalComponent";

import BatchModalComponent from "../Common/Modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";

export const SuperescalarComponent = () => (
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
    <SuperescalarLoadContentModalComponent />
    <SuperescalarConfigModalComponent />
    <OptionsModalComponent />
    <AutorModalComponent />
    <BatchModalComponent />
    <BatchResultsModalComponent />
    </div>
);
