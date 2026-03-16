import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "react-bootstrap";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import VliwConfigModalComponent from "./modal/VLIWConfigModalComponent";
import OptionsModalComponent from "../Common/Modal/OptionsModalComponent";
import AutorModalComponent from "../Common/Modal/AutorModalComponent";

import BatchModalComponent from "../Common/Modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";

import VLIWIntegration from "../../../integration/vliw-integration.client";

import GeneralVLIWTabComponent from "./tab/GeneralVLIWTabComponent";
import RegisterVLIWTabComponent  from "./tab/RegistersVLIWTabComponent";
import StatsTabComponent from "./tab/StatsTabComponent";
import VLIWFileBarComponent from "./navbar/VLIWFileBarComponent";
import VLIWLoadModalComponent from "./modal/VLIWLoadModalComponent";
import VLIWAccessBarComponent from "./navbar/VLIWAccessBarComponent";

import VLIWLoadContentModalComponent from "./modal/VLIWLoadContentModalComponent";


/** VLIW simulation page with tabbed views and modal dialogs. */
const VLIWComponent = () => {
    const { t } = useTranslation();
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
                <Tab eventKey={3} title={t('accessBar.stats')}>
                    <StatsTabComponent />
                </Tab>
            </Tabs>
            <VLIWLoadModalComponent />
            <VLIWLoadContentModalComponent />
            <VliwConfigModalComponent />
            <OptionsModalComponent />
            <AutorModalComponent />
            <BatchModalComponent integration={VLIWIntegration} />
            <BatchResultsModalComponent />
        </div>
    )
};

export default VLIWComponent;
