import * as React from "react";
import { t } from 'i18next';
import { Tabs, Tab } from "react-bootstrap";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import VliwConfigModalComponent from "./modal/VLIWConfigModalComponent";
import OptionsModalComponent from "../Superescalar/modal/OptionsModalComponent";
import AutorModalComponent from "./modal/AutorModalComponent";

import BatchModalComponent from "../VLIW/modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";

import GeneralVLIWTabComponent from "./tab/GeneralVLIWTabComponent";
import RegisterVLIWTabComponent  from "./tab/RegistersVLIWTabComponent";
import VLIWFileBarComponent from "./navbar/VLIWFileBarComponent";
import VLIWLoadModalComponent from "./modal/VLIWLoadModalComponent";
import VLIWAccessBarComponent from "./navbar/VLIWAccessBarComponent";

import VLIWLoadContentModalComponent from "./modal/VLIWLoadContentModalComponent";


const VLIWComponent = () => {
    return (
        <div className='smd'>
            <div className='navigation-bars'>
                <VLIWFileBarComponent />
                <VLIWAccessBarComponent />
            </div>
            <Tabs defaultActiveKey={1} id='working-area-tabs'>
                <Tab eventKey={1} title={t('accessBar.vliw')}>
                    <DndProvider backend={HTML5Backend}>
                        <GeneralVLIWTabComponent />
                    </DndProvider>
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
    )
};

export default VLIWComponent;
