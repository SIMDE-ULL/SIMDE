import { type FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleAuthorModal } from "../../../actions/modals";

/** About/author information modal. */
export const AutorModalComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthorModalOpen = useAppSelector(
    (state) => state.Ui.isAuthorModalOpen
  );

  const close = () => {
    dispatch(toggleAuthorModal(false));
  };

  return (
    <Modal show={isAuthorModalOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t("authorModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <div className="row">
            <div className="col-sm-12">
              <label>{t("authorModal.originalAuthor")}</label>: Iván Castilla
              Rodríguez
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label>{t("authorModal.newAuthor")}</label>: Adrián Abreu González
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

export default AutorModalComponent;
