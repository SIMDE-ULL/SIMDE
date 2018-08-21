
import * as React from "react";
import { t } from 'i18next';
import { Tabs, Tab } from "react-bootstrap";
import VliwConfigModalComponent from "./modal/VliwConfigModalComponent";
import OptionsModalComponent from "../Superescalar/modal/OptionsModalComponent";
import AutorModalComponent from "../Common/Modal/AutorModalComponent";

import BatchModalComponent from "../Common/Modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";


import GeneralVLIWTabComponent from "./tab/GeneralVLIWTabComponent";
import RegisterVLIWTabComponent  from "./tab/RegistersVLIWTabComponent";
import VLIWFileBarComponent from "./navbar/VLIWFileBarComponent";
import VLIWLoadModalComponent from "./modal/VLIWLoadModalComponent";
import VLIWAccessBarComponent from "./navbar/VLIWAccessBarComponent";

import VliwLoadContentModalComponent from "./modal/VliwLoadContentModalComponent";


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
        <VliwLoadContentModalComponent />
        <VliwConfigModalComponent />
        <OptionsModalComponent />
        <AutorModalComponent />
        <BatchModalComponent />
        <BatchResultsModalComponent />
    </div>
);