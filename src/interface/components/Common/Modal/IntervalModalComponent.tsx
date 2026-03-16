import { type ChangeEvent, type FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { generateIntervalFromImput } from "../../../utils/interval";

/** Props for the interval input modal. */
interface IntervalModalComponentProps {
  title: string;
  onAccept: (value: number[]) => void;
  max: number;
  open: boolean;
  close: () => void;
}

/** Modal dialog for entering register/memory index intervals (e.g. "0-15,32"). */
export const IntervalModalComponent: FC<IntervalModalComponentProps> = ({
  title,
  onAccept,
  max,
  open,
  close,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError("");
  };

  const accept = () => {
    try {
      const interval = generateIntervalFromImput(value, max);
      onAccept(interval);
      setValue("");
      close();
    } catch (err: any) {
      setError(err.message || err);
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
          <div />
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
