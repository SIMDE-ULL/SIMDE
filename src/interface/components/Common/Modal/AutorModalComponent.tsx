import type { FC } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { toggleAuthorModal } from "../../../actions/modals";

interface AuthorInfo {
  newAuthor: string;
  coAuthor?: string;
}

interface AutorModalProps {
  authors: AuthorInfo;
}

/** About/author information modal. */
export const AutorModalComponent: FC<AutorModalProps> = ({ authors }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthorModalOpen = useAppSelector(
    (state) => state.Ui.isAuthorModalOpen,
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
              <span>{t("authorModal.originalAuthor")}</span>: Iván Castilla
              Rodríguez
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <span>{t("authorModal.newAuthor")}</span>: {authors.newAuthor}
            </div>
            {authors.coAuthor && (
              <div className="col-sm-12">
                <span>{t("authorModal.coAuthor")}</span>: {authors.coAuthor}
              </div>
            )}
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
