import { toggleLoadModal } from "@/interface/actions/modals";
import FileReaderInput from "@/interface/components/Common/FileReaderInput";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Code } from "@/core/Common/Code";
import SuperscalarIntegration from "@/integration/superscalar-integration";
import { useState } from "react";

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

const mapStateToProps = (state) => {
  return {
    isLoadModalOpen: state.Ui.isLoadModalOpen,
  };
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ toggleLoadModal }, dispatch) };
}

export type LoadModalComponentProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const LoadModalComponent = ({
  isLoadModalOpen,
  actions,
}: LoadModalComponentProps) => {
  const [modalError, setModalError] = useState("");
  const [modalCode, setModalCode] = useState(DEFAULT_MODAL_CODE);
  const [t] = useTranslation();

  const close = () => {
    actions.toggleLoadModal(false);
  };

  const loadCodeFromFile = ([[fileContent]]) => {
    setModalCode(fileContent.target.result);
  };

  const loadCode = () => {
    const code = new Code();

    try {
      code.load(modalCode);
      SuperscalarIntegration.loadCode(code);

      setModalError("");
      close();
    } catch (error) {
      // Check if error has the property position. Checking instance of TokenError not working
      const errorMessage = error.pos
        ? `Syntax error at line ${error.pos?.rowBegin}, column ${error.pos?.columnBegin}:
        ${error.errorMessage}`
        : error.message;

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

export default connect(mapStateToProps, mapDispatchToProps)(LoadModalComponent);
