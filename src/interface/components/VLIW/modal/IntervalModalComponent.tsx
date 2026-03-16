import { useState, type ChangeEvent, type FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { generateIntervalFromImput } from "../../../utils/interval";

interface IntervalModalComponentProps {
  title: string;
  onAccept: (value: number[]) => void;
  max: number;
  open: boolean;
  close: () => void;
}

/** VLIW interval input modal for adding/removing register display ranges. */
export const IntervalModalComponent: FC<IntervalModalComponentProps> = ({
  title,
  onAccept,
  max,
  open,
  close,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError("");
  };

  const accept = () => {
    try {
      const result = generateIntervalFromImput(value, max);
      onAccept(result);
      setValue("");
      close();
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form intervalForm">
          <div className="form-group">
            <div className="col-sm-12 text-center">
              <label className="control-label">
                {t("intervalModal.intervalMessage")}
              </label>
            </div>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control"
                value={value}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        {error ? (
          <div className="smd-forms_error">
            {t(`intervalModal.errors.${error}`)}
          </div>
        ) : (
          <div></div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>{t("commonButtons.close")}</Button>
        <Button className="btn btn-primary" onClick={accept}>
          {t("commonButtons.accept")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IntervalModalComponent;
