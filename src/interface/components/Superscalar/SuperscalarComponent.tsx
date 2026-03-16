import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import AccessBarComponent from "../Common/AccessBarComponent";
import FileBarComponent from "../Common/FileBarComponent";

import RegisterTabComponent from "../Common/RegistersTabComponent";
import GeneralTabComponent from "./tab/GeneralTabComponent";
import StatsTabComponent from "./tab/StatsTabComponent";

import LoadModalComponent from "./modal/LoadModalComponent";
import SuperscalarConfigModalComponent from "./modal/SuperscalarConfigModal";
import SuperscalarLoadContentModalComponent from "./modal/SuperscalarLoadContentModalComponent";

import AutorModalComponent from "../Common/Modal/AutorModalComponent";
import OptionsModalComponent from "../Common/Modal/OptionsModalComponent";

import BatchModalComponent from "../Common/Modal/BatchModalComponent";
import BatchResultsModalComponent from "../Common/Modal/BatchResultsModalComponent";

import SuperscalarIntegration from "../../../integration/superscalar-integration.client";
import { useAppDispatch } from "../../../store/hooks";
import {
  toggleSuperConfigModal,
  toggleSuperscalarLoadContentModal,
} from "../../actions/modals";
import { downloadJsonFile, downloadTextFile } from "../../utils/Downloader";
import ExecutionNotification from "../Common/ExecutionNotification";

/** Superscalar simulation page with tabbed views and modal dialogs. */
const SuperscalarComponent = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <div className="smd">
      <ExecutionNotification />
      <div className="navigation-bars">
        <FileBarComponent
          configLabel="fileBar.config.superscalar"
          onOpenConfigModal={() => dispatch(toggleSuperConfigModal(true))}
          onOpenContentModal={() =>
            dispatch(toggleSuperscalarLoadContentModal(true))
          }
          onDownloadContent={() => {
            if (SuperscalarIntegration.contentIntegration) {
              downloadTextFile(
                "content.txt",
                SuperscalarIntegration.contentIntegration.deparse(),
              );
            } else {
              downloadTextFile("content.txt", "");
            }
          }}
          onDownloadCode={() => {
            if (SuperscalarIntegration.superscalar.code) {
              downloadTextFile(
                "code.txt",
                SuperscalarIntegration.superscalar.code.save(),
              );
            } else {
              downloadTextFile("code.txt", "");
            }
          }}
          onExportStats={() =>
            downloadJsonFile(
              "stats.json",
              SuperscalarIntegration.stats.exportStats(),
            )
          }
        />
        <AccessBarComponent integration={SuperscalarIntegration} />
      </div>
      <Tabs defaultActiveKey={1} id="working-area-tabs">
        <Tab eventKey={1} title={t("accessBar.superscalar")}>
          <GeneralTabComponent />
        </Tab>
        <Tab eventKey={2} title={t("accessBar.memReg")}>
          <RegisterTabComponent />
        </Tab>
        <Tab eventKey={3} title={t("accessBar.stats")}>
          <StatsTabComponent />
        </Tab>
      </Tabs>
      <LoadModalComponent />
      <SuperscalarLoadContentModalComponent />
      <SuperscalarConfigModalComponent />
      <OptionsModalComponent />
      <AutorModalComponent authors={{ newAuthor: "Adrián Abreu González" }} />
      <BatchModalComponent integration={SuperscalarIntegration} />
      <BatchResultsModalComponent />
    </div>
  );
};

export default SuperscalarComponent;
