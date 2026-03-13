import * as React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { toggleAuthorModal } from "../../../actions/modals";

/** VLIW about/author modal showing original, new, and co-author credits. */
export const AutorModalComponent: React.FC = () => {
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
              <label>{t("authorModal.newAuthor")}</label>: Melissa Díaz Arteaga
            </div>
            <div className="col-sm-12">
              <label>{t("authorModal.coAuthor")}</label> Adrian Abreu González
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
