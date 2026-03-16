import type { FC } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { closeBatchResults } from "../../../actions/modals";
import { downloadJsonFile } from "../../../utils/Downloader";

/** Displays batch execution results with an option to download as JSON. */
export const BatchResultsModalComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isBatchResultsModalOpen = useAppSelector(
    (state) => state.Ui.isBatchResultsModalOpen,
  );
  const batchStatsResults = useAppSelector(
    (state) => state.Ui.batchStatsResults,
  );

  const close = () => {
    dispatch(closeBatchResults());
  };

  const download = () => {
    downloadJsonFile("batch_stats.json", batchStatsResults);
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
              {t("batchResults.subtext")}
            </div>
          </div>
          <Button onClick={download}>{t("batchResults.download")}</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>{t("commonButtons.close")}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchResultsModalComponent;
