import * as React from "react";
import { t } from 'i18next';
import { Tabs, Tab } from "react-bootstrap";
import VliwConfigModalComponent from "./modal/VLIWConfigModalComponent";
import OptionsModalComponent from "../Superescalar/modal/OptionsModalComponent";
import AutorModalComponent from "./modal/AutorModalComponent";

import BatchModalComponent from "../Common/Modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";

import GeneralVLIWTabComponent from "./tab/GeneralVLIWTabComponent";
import RegisterVLIWTabComponent  from "./tab/RegistersVLIWTabComponent";
import VLIWFileBarComponent from "./navbar/VLIWFileBarComponent";
import VLIWLoadModalComponent from "./modal/VLIWLoadModalComponent";
import VLIWAccessBarComponent from "./navbar/VLIWAccessBarComponent";

import VLIWLoadContentModalComponent from "./modal/VLIWLoadContentModalComponent";


export const VLIWComponent = () => (
    <div className='smd'>
        <div className='navigation-bars'>
            <VLIWFileBarComponent />
            <VLIWAccessBarComponent />
        </div>
        <Tabs defaultActiveKey={1} id='working-area-tabs'>
            <Tab eventKey={1} title={t('accessBar.vliw')}>
                <GeneralVLIWTabComponent />
            </Tab>
            <Tab eventKey={2} title={t('accessBar.memReg')}>
                <RegisterVLIWTabComponent />
            </Tab>
        </Tabs>
        <VLIWLoadModalComponent />
        <VLIWLoadContentModalComponent />
        <VliwConfigModalComponent />
        <OptionsModalComponent />
        <AutorModalComponent />
        <BatchModalComponent />
        <BatchResultsModalComponent />
    </div>
);
