import * as React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleOptionsModal } from "../../../actions/modals";

/** VLIW options modal with cache fail percentage configuration. */
export const OptionsModalComponent: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isOptionsModalOpen = useAppSelector(
    (state) => state.Ui.isOptionsModalOpen
  );
  const [cacheFailPercentage, setCacheFailPercentage] = useState(0);

  const close = () => {
    dispatch(toggleOptionsModal(false));
  };

  const setOptions = () => {
    close();
  };

  return (
    <Modal show={isOptionsModalOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t("optionsModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form form-horizontal">
          <div className="form-group">
            <div className="col-sm-4">
              <label htmlFor="cacheFailPercentage" className="control-label">
                {t("optionsModal.cacheFault")}
              </label>
            </div>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="cacheFailPercentage"
                type="number"
                min="0"
                max="100"
                value={cacheFailPercentage}
                onChange={(e) => setCacheFailPercentage(Number(e.target.value))}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>{t("commonButtons.close")}</Button>
        <Button className="btn btn-primary" onClick={setOptions}>
          {t("commonButtons.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OptionsModalComponent;
