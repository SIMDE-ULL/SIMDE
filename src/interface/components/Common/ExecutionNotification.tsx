import { type FC, useEffect, useRef } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearNotification } from "../../reducers/notification";

const AUTO_DISMISS_MS = 5000;

const ExecutionNotification: FC = () => {
  const message = useAppSelector((state) => state.Notification.message);
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (message) {
      timerRef.current = setTimeout(() => {
        dispatch(clearNotification());
        timerRef.current = null;
      }, AUTO_DISMISS_MS);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [message, dispatch]);

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dispatch(clearNotification());
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={message !== null} onClose={handleClose} bg="info">
        <Toast.Header>
          <strong className="me-auto">SIMDE</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ExecutionNotification;
