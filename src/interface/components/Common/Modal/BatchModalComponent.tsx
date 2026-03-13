import * as React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleBatchModal } from "../../../actions/modals";
import SuperscalarIntegration from "../../../../integration/superscalar-integration";

/** Superscalar batch execution configuration modal. */
export const BatchModalComponent: React.FC = () => {
  const [replications, setReplications] = useState(10);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isBatchModalOpen = useAppSelector((state) => state.Ui.isBatchModalOpen);

  const close = () => {
    dispatch(toggleBatchModal(false));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReplications(Number(event.target.value));
  };

  const setOptions = () => {
    SuperscalarIntegration.setBatchMode(replications);
    close();
    SuperscalarIntegration.makeBatchExecution();
  };

  return (
    <Modal show={isBatchModalOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t("batchModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form form-horizontal">
          <div className="form-group">
            <label htmlFor="replications" className="control-label col-sm-4">
              {t("batchModal.replications")}
            </label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="replications"
                type="number"
                min="0"
                max="100"
                value={replications}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>{t("commonButtons.close")}</Button>
        <Button className="btn btn-primary" onClick={setOptions}>
          {t("commonButtons.launch")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchModalComponent;
