import { type ChangeEvent, type FC } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleOptionsModal } from "../../../actions/modals";

/** Options modal (currently a placeholder for cache fault percentage). */
export const OptionsModalComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isOptionsModalOpen = useAppSelector(
    (state) => state.Ui.isOptionsModalOpen
  );

  const cacheFailPercentage = 0;

  const close = () => {
    dispatch(toggleOptionsModal(false));
  };

  const handleChange = (_event: ChangeEvent<HTMLInputElement>) => {
    // TODO: implement cache fail percentage state update
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
                onChange={handleChange}
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
