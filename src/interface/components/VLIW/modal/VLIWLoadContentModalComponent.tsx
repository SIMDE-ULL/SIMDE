import { useRef, useState, type FC } from "react";
import FileReaderInput from "../../Common/FileReaderInput";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleVliwLoadContentModal } from "../../../actions/modals";
import VLIWIntegration from "../../../../integration/vliw-integration.client";
import { ContentIntegration } from "../../../../integration/content-integration";

/** VLIW content loading modal with textarea and file upload. */
export const VLIWLoadContentModalComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isVliwLoadContentModalOpen = useAppSelector(
    (state) => state.Ui.isVliwLoadContentModalOpen
  );
  const [error, setError] = useState("");
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const close = () => {
    dispatch(toggleVliwLoadContentModal(false));
  };

  const handleInputFileChange = (e, results) => {
    results.forEach((result) => {
      const [e] = result;
      if (contentInputRef.current) {
        contentInputRef.current.value = e.target.result;
      }
    });
  };

  const loadContent = () => {
    try {
      const content = contentInputRef.current?.value || "";
      setError("");
      const contentIntegration = new ContentIntegration(content);
      VLIWIntegration.contentIntegration = contentIntegration;
      VLIWIntegration.setFpr(contentIntegration.FPRContent);
      VLIWIntegration.setGpr(contentIntegration.GPRContent);
      VLIWIntegration.setMemory(contentIntegration.MEMContent);
      VLIWIntegration.dispatchAllVLIWActions();
      close();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal
      size="xl"
      className="smd-load_content_modal"
      show={isVliwLoadContentModalOpen}
      onHide={close}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("loadContentModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea ref={contentInputRef} defaultValue=""></textarea>
        <div className="smd-load_content_modal-errors">
          {error && <div className="smd-forms_error">{error}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer className="smd-load_modal-footer">
        <div className="smd-load_modal-file_input">
          <FileReaderInput
            as="text"
            onChange={handleInputFileChange}
            accept=".mem"
          >
            <Button className="btn btn-primary">
              {t("commonButtons.loadFromFile")}
            </Button>
          </FileReaderInput>
        </div>
        <div className="smd-load_modal-actions">
          <Button onClick={close}>{t("commonButtons.close")}</Button>
          <Button className="btn btn-primary" onClick={loadContent}>
            {t("loadModal.load")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default VLIWLoadContentModalComponent;
