import { useState, type FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleBatchModal } from "../../../actions/modals";
import type { MachineIntegration } from "../../../../integration/machine-integration.client";

interface BatchModalProps {
  integration: MachineIntegration;
}

/** Batch execution configuration modal for both Superscalar and VLIW. */
export const BatchModalComponent: FC<BatchModalProps> = ({ integration }) => {
  const [replications, setReplications] = useState(10);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isBatchModalOpen = useAppSelector((state) => state.Ui.isBatchModalOpen);

  const close = () => {
    dispatch(toggleBatchModal(false));
  };

  const setOptions = () => {
    integration.setBatchMode(replications);
    close();
    integration.makeBatchExecution();
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
                onChange={(e) => setReplications(Number(e.target.value))}
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
