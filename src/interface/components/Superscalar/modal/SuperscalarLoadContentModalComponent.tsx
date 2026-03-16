import * as React from "react";
import { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleSuperscalarLoadContentModal } from "../../../actions/modals";
import FileReaderInput from "../../Common/FileReaderInput";
import SuperscalarIntegration from "../../../../integration/superscalar-integration.client";
import { ContentIntegration } from "../../../../integration/content-integration";

/** Modal for loading initial register/memory content into the superscalar simulator. */
export const SuperscalarLoadContentModalComponent: React.FC = () => {
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isSuperscalarLoadContentModalOpen = useAppSelector(
    (state) => state.Ui.isSuperscalarLoadContentModalOpen
  );

  const close = () => {
    dispatch(toggleSuperscalarLoadContentModal(false));
  };

  const handleInputFileChange = (_e: any, results: any) => {
    results.forEach((result: any) => {
      const [e] = result;
      if (contentRef.current) {
        contentRef.current.value = e.target.result;
      }
    });
  };

  const loadContent = () => {
    try {
      const content = contentRef.current?.value || "";
      setError("");
      const contentIntegration = new ContentIntegration(content);
      SuperscalarIntegration.contentIntegration = contentIntegration;
      SuperscalarIntegration.setFpr(contentIntegration.FPRContent);
      SuperscalarIntegration.setGpr(contentIntegration.GPRContent);
      SuperscalarIntegration.setMemory(contentIntegration.MEMContent);
      SuperscalarIntegration.dispatchAllSuperscalarActions();
      close();
    } catch (err: any) {
      if (err.pos) {
        setError(
          `[${err.pos?.rowBegin}:${err.pos?.columnBegin}]: ${err.errorMessage}`
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <Modal
      className="smd-load_content_modal"
      show={isSuperscalarLoadContentModalOpen}
      onHide={close}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("loadContentModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea ref={contentRef} defaultValue="" />
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

export default SuperscalarLoadContentModalComponent;
