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
import RegisterVLIWTabComponent  from "../Common/RegistersTabComponent";
import StatsTabComponent from "./tab/StatsTabComponent";
import FileBarComponent from "../Common/FileBarComponent";
import VLIWLoadModalComponent from "./modal/VLIWLoadModalComponent";
import AccessBarComponent from "../Common/AccessBarComponent";

import VLIWLoadContentModalComponent from "./modal/VLIWLoadContentModalComponent";
import ExecutionNotification from "../Common/ExecutionNotification";
import { toggleVliwConfigModal, toggleVliwLoadContentModal } from "../../actions/modals";
import { downloadJsonFile, downloadTextFile } from "../../utils/Downloader";
import { useAppDispatch } from "../../../store/hooks";

/** VLIW simulation page with tabbed views and modal dialogs. */
const VLIWComponent = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    return (
        <div className='smd'>
            <ExecutionNotification />
            <div className='navigation-bars'>
                <FileBarComponent
                    configLabel="fileBar.config.vliw"
                    onOpenConfigModal={() => dispatch(toggleVliwConfigModal(true))}
                    onOpenContentModal={() => dispatch(toggleVliwLoadContentModal(true))}
                    onDownloadContent={() => {
                        if (VLIWIntegration.contentIntegration) {
                            downloadTextFile("content.txt", VLIWIntegration.contentIntegration.deparse());
                        } else {
                            downloadTextFile("content.txt", "");
                        }
                    }}
                    onDownloadCode={() => {
                        if (VLIWIntegration.vliw.code) {
                            downloadTextFile("code.txt", VLIWIntegration.vliw.code.save());
                        } else {
                            downloadTextFile("code.txt", "");
                        }
                    }}
                    onExportStats={() => downloadJsonFile("stats.json", VLIWIntegration.stats.exportStats())}
                />
                <AccessBarComponent integration={VLIWIntegration} />
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
            <AutorModalComponent authors={{ newAuthor: "Melissa Díaz Arteaga", coAuthor: "Adrián Abreu González" }} />
            <BatchModalComponent integration={VLIWIntegration} />
            <BatchResultsModalComponent />
        </div>
    )
};

export default VLIWComponent;
