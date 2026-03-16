import { Code } from "@/core/Common/Code";
import SuperscalarIntegration from "@/integration/superscalar-integration.client";
import { toggleLoadModal } from "@/interface/actions/modals";
import FileReaderInput from "@/interface/components/Common/FileReaderInput";
import { type FC, useState } from "react";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

const DEFAULT_MODAL_CODE = `
ADDI	R2 R0 #50
ADDI	R3 R0 #70
ADDI	R4 R0 #40
LF	F0 (R4)
ADDI	R5 R2 #16

// Setup Code
LF	F1 (R2)
ADDF	F2 F1 F0
LF	F1 1(R2)
ADDI	R2 R2 #2

LOOP:
SF	F2 (R3)
ADDF	F2 F1 F0
LF	F1 (R2)
ADDI	R2 R2 #1
ADDI	R3 R3 #1
BNE	R2 R5 LOOP

// Ending Code
SF	F2 (R3)
ADDF	F2 F1 F0
SF	F2 1(R3)
`.trim();

/** Superscalar code loading modal with inline editor and file upload. */
export const LoadModalComponent: FC = () => {
  const [modalError, setModalError] = useState("");
  const [modalCode, setModalCode] = useState(DEFAULT_MODAL_CODE);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoadModalOpen = useAppSelector((state) => state.Ui.isLoadModalOpen);

  const close = () => {
    dispatch(toggleLoadModal(false));
  };

  const loadCodeFromFile = (files: [ProgressEvent<FileReader>, File][]) => {
    const [event] = files[0];
    setModalCode((event.target as FileReader).result as string);
  };

  const loadCode = () => {
    const code = new Code();

    try {
      code.load(modalCode);
      SuperscalarIntegration.loadCode(code);

      setModalError("");
      close();
    } catch (error: unknown) {
      const err = error as {
        pos?: { rowBegin: number; columnBegin: number };
        errorMessage?: string;
        message?: string;
      };
      const errorMessage = err.pos
        ? `Syntax error at line ${err.pos.rowBegin}, column ${err.pos.columnBegin}:
        ${err.errorMessage}`
        : (err.message ?? String(error));

      setModalError(errorMessage);
    }
  };

  return (
    <Modal show={isLoadModalOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t("loadModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={0}>
          <Form>
            <Form.Control
              as="textarea"
              style={{ resize: "none" }}
              className={`smd-monospace mx-0 ${
                modalError
                  ? "border-bottom-0 rounded-bottom-0 border-danger-subtle"
                  : ""
              }`}
              value={modalCode}
              onChange={(event) => {
                setModalCode(event.target.value);
              }}
            />
          </Form>
          <div>
            {modalError && (
              <Alert className="border-top-0 rounded-top-0" variant={"danger"}>
                {modalError}
              </Alert>
            )}
          </div>
        </Stack>
      </Modal.Body>

      <Modal.Footer>
        <div>
          <FileReaderInput
            as="text"
            onChange={(_, files) => {
              loadCodeFromFile(files);
            }}
            accept=".pla"
          >
            <Button>{t("commonButtons.loadFromFile")}</Button>
          </FileReaderInput>
        </div>
        <div>
          <Button onClick={close}>{t("commonButtons.close")}</Button>
          <Button className="ml-2" onClick={loadCode}>
            {t("loadModal.load")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LoadModalComponent;
