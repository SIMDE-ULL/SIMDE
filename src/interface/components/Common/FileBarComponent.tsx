import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  toggleLoadModal,
  toggleAuthorModal,
  toggleBatchModal,
} from "../../actions/modals";
import { viewBasicBlocks } from "../../actions";
import { downloadJsonFile } from "../../utils/Downloader";

interface FileBarProps {
  configLabel: string;
  onOpenConfigModal: () => void;
  onOpenContentModal: () => void;
  onDownloadContent: () => void;
  onDownloadCode: () => void;
  onExportStats: () => void;
}

/** Menu bar with file, view, config, experimentation, and help menus. */
export const FileBarComponent: FC<FileBarProps> = ({
  configLabel,
  onOpenConfigModal,
  onOpenContentModal,
  onDownloadContent,
  onDownloadCode,
  onExportStats,
}) => {
  const [color, setColor] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const memory = useAppSelector((state) => state.Machine.memory);

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
        <Dropdown.Item eventKey="3" onClick={onDownloadContent}>
          {t("fileBar.file.exportContent")}
        </Dropdown.Item>
        <Dropdown.Item eventKey="4" onClick={onDownloadCode}>
          {t("fileBar.file.exportCode")}
        </Dropdown.Item>
        <Dropdown.Item eventKey="5" onClick={onExportStats}>
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
        <Dropdown.Item eventKey="1" onClick={onOpenConfigModal}>
          {t(configLabel)}
        </Dropdown.Item>
        <Dropdown.Item eventKey="1" onClick={onOpenContentModal}>
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
