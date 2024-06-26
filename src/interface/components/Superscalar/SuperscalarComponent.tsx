import * as React from "react";
import { t } from 'i18next';
import { Tabs, Tab } from "react-bootstrap";

import FileBarComponent from './navbar/FileBarComponent';
import AccessBarComponent from "./navbar/AccessBarComponent";

import GeneralTabComponent from "./tab/GeneralTabComponent";
import RegisterTabComponent from './tab/RegistersTabComponent';
import StatsTabComponent from './tab/StatsTabComponent';

import LoadModalComponent from "./modal/LoadModalComponent";
import SuperscalarConfigModalComponent from "./modal/SuperscalarConfigModal";
import SuperscalarLoadContentModalComponent from "./modal/SuperscalarLoadContentModalComponent";

import OptionsModalComponent from "./modal/OptionsModalComponent";
import AutorModalComponent from "./modal/AutorModalComponent";

import BatchModalComponent from "../Common/Modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";

const SuperscalarComponent = () => {
    return (
        <div className='smd'>
            <div className='navigation-bars'>
                <FileBarComponent />
                <AccessBarComponent />
            </div>
            <Tabs defaultActiveKey={1} id='working-area-tabs'>
                <Tab eventKey={1} title={t('accessBar.superscalar')}>
                    <GeneralTabComponent />
                </Tab>
                <Tab eventKey={2} title={t('accessBar.memReg')}>
                    <RegisterTabComponent />
                </Tab>
                <Tab eventKey={3} title={t('accessBar.stats')}>
                    <StatsTabComponent />
                </Tab>
            </Tabs>
            <LoadModalComponent />
            <SuperscalarLoadContentModalComponent />
            <SuperscalarConfigModalComponent />
            <OptionsModalComponent />
            <AutorModalComponent />
            <BatchModalComponent />
            <BatchResultsModalComponent />
        </div>
    )
};

export default SuperscalarComponent;
