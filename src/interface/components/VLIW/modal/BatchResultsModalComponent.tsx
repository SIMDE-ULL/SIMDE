import { type FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { closeBatchResults } from "../../../actions/modals";

/** VLIW batch execution results modal showing statistics. */
export const BatchResultsModalComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isBatchResultsModalOpen = useAppSelector(
    (state) => state.Ui.isBatchResultsModalOpen
  );
  const results = useAppSelector((state) => state.Ui.batchResults) as any;

  const close = () => {
    dispatch(closeBatchResults());
  };

  return (
    <Modal show={isBatchResultsModalOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t("batchResults.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="smd-batch_results">
          <div className="smd-batch_results-entry">
            <div className="smd-batch_results-entry_label">
              {t("batchResults.replications")}:
            </div>
            <div className="smd-batch_results-entry_value">
              {results.replications}
            </div>
          </div>
          <div className="smd-batch_results-entry">
            <div className="smd-batch_results-entry_label">
              {t("batchResults.average")}
            </div>
            <div className="smd-batch_results-entry_value">
              {results.average}
            </div>
          </div>
          <div className="smd-batch_results-entry">
            <div className="smd-batch_results-entry_label">
              {t("batchResults.standardDeviation")}
            </div>
            <div className="smd-batch_results-entry_value">
              {results.standardDeviation}
            </div>
          </div>
          <div className="smd-batch_results-entry">
            <div className="smd-batch_results-entry_label">
              {t("batchResults.worst")}:
            </div>
            <div className="smd-batch_results-entry_value">
              {results.worst}
            </div>
          </div>
          <div className="smd-batch_results-entry">
            <div className="smd-batch_results-entry_label">
              {t("batchResults.best")}:
            </div>
            <div className="smd-batch_results-entry_value">
              {results.best}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>{t("commonButtons.close")}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchResultsModalComponent;
