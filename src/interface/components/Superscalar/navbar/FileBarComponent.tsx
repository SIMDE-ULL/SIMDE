import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  toggleLoadModal,
  toggleAuthorModal,
  toggleOptionsModal,
  toggleSuperConfigModal,
  toggleBatchModal,
  toggleSuperscalarLoadContentModal,
} from "../../../actions/modals";
import { viewBasicBlocks } from "../../../actions";
import { downloadJsonFile, downloadTextFile } from "../../../utils/Downloader";
import SuperscalarIntegration from "../../../../integration/superscalar-integration.client";

/** Superscalar menu bar with file, view, config, experimentation, and help menus. */
export const FileBarComponent: React.FC = () => {
  const [color, setColor] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const memory = useAppSelector((state) => state.Machine.memory);

  const downloadContentFile = () => {
    if (SuperscalarIntegration.contentIntegration) {
      downloadTextFile(
        "content.txt",
        SuperscalarIntegration.contentIntegration.deparse()
      );
    } else {
      downloadTextFile("content.txt", "");
    }
  };

  const downloadCodeFile = () => {
    if (SuperscalarIntegration.superscalar.code) {
      downloadTextFile(
        "code.txt",
        SuperscalarIntegration.superscalar.code.save()
      );
    } else {
      downloadTextFile("code.txt", "");
    }
  };

  return (
    <Dropdown className="smd-filebar">
      <DropdownButton
        title={t("fileBar.file.name")}
        key={"dropdown-load"}
        id={"dropdown-load"}
      >
        <Dropdown.Item
          eventKey="1"
          onClick={() => dispatch(toggleLoadModal(true))}
        >
          {t("fileBar.file.load")}
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="2"
          onClick={() => downloadJsonFile("memory.json", memory)}
        >
          {t("fileBar.file.exportMemory")}
        </Dropdown.Item>
        <Dropdown.Item eventKey="3" onClick={downloadContentFile}>
          {t("fileBar.file.exportContent")}
        </Dropdown.Item>
        <Dropdown.Item eventKey="4" onClick={downloadCodeFile}>
          {t("fileBar.file.exportCode")}
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="5"
          onClick={() =>
            downloadJsonFile(
              "stats.json",
              SuperscalarIntegration.stats.exportStats()
            )
          }
        >
          {t("fileBar.file.exportStats")}
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        title={t("fileBar.view.name")}
        key={"dropdown-view"}
        id={"dropdown-view"}
      >
        <Dropdown.Item
          eventKey="1"
          onClick={() => {
            const newColor = !color;
            setColor(newColor);
            dispatch(viewBasicBlocks(newColor));
          }}
        >
          {t("fileBar.view.basicBlocks")}
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        title={t("fileBar.config.name")}
        key={"dropdown-options"}
        id={"dropdown-options"}
      >
        <Dropdown.Item
          eventKey="1"
          onClick={() => dispatch(toggleSuperConfigModal(true))}
        >
          {t("fileBar.config.superscalar")}
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="1"
          onClick={() => dispatch(toggleSuperscalarLoadContentModal(true))}
        >
          {t("fileBar.config.content")}
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        title={t("fileBar.experimentation.name")}
        key={"dropdown-experimentation"}
        id={"dropdown-experimentation"}
      >
        <Dropdown.Item
          eventKey="2"
          onClick={() => dispatch(toggleBatchModal(true))}
        >
          {t("fileBar.experimentation.batch")}
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        title={t("fileBar.help.name")}
        key={"dropdown-help"}
        id={"dropdown-help"}
      >
        <Dropdown.Item
          eventKey="1"
          href="https://etsiiull.gitbooks.io/simde/"
        >
          {t("fileBar.help.docs")}
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="2"
          onClick={() => dispatch(toggleAuthorModal(true))}
        >
          {t("fileBar.help.about")}
        </Dropdown.Item>
      </DropdownButton>
    </Dropdown>
  );
};

export default FileBarComponent;
