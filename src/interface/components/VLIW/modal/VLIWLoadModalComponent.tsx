import * as React from "react";
import FileReaderInput from "../../Common/FileReaderInput";
import { Modal, Button, Stack, Form, Alert } from "react-bootstrap";
import { useTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { toggleLoadModal } from "../../../actions/modals";
import { bindActionCreators } from "redux";

import VLIWIntegration from "../../../../integration/vliw-integration";
import { Code } from "../../../../core/Common/Code";
import { VLIWCode } from "../../../../core/VLIW/VLIWCode";
import { useState } from "react";

const DEFAULT_MODAL_CODE = `
ADDI	R2 R0 #50
ADDI	R3 R0 #70
ADDI	R4 R0 #40
LF	F0 (R4)
ADDI	R5 R2 #16
LOOP:
LF 	F1 (R2)
ADDF	F1 F1 F0
SF	F1 (R3)
ADDI 	R2 R2 #1
ADDI	R3 R3 #1
BNE	R2 R5 LOOP
`.trim();

const DEFAULT_MODAL_VLIW_CODE = `
2	0 0 0 0	2 0 1 0
3	1 0 0 0	4 0 1 0	3 4 0 0
1	5 4 0 0
0
0
0
1	6 2 0 0
1	8 0 0 0
0
0
1	7 4 1 0
0
0
1	10 5 0 0 2 1 2
1	9 0 1 0
`.trim();

const mapStateToProps = (state) => {
  return {
    isLoadModalOpen: state.Ui.isLoadModalOpen,
  };
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ toggleLoadModal }, dispatch) };
}

export type VLIWLoadModalComponentProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const VLIWLoadModalComponent = ({
  isLoadModalOpen,
  actions,
}: VLIWLoadModalComponentProps) => {
  const [modalError, setModalError] = useState("");
  const [modalVLIWError, setModalVLIWError] = useState("");
  const [modalCode, setModalCode] = useState(DEFAULT_MODAL_CODE);
  const [modalVLIWCode, setModalVLIWCode] = useState(DEFAULT_MODAL_VLIW_CODE);
  const [t] = useTranslation();

  const close = () => {
    actions.toggleLoadModal(false);
  };

  const loadCodeFromFile = ([[fileContent]]) => {
    setModalCode(fileContent.target.result);
  };

  const loadVLIWCodeFromFile = ([[fileContent]]) => {
    setModalVLIWCode(fileContent.target.result);
  };

  const loadCode = () => {
    const code = new Code();
    const vliwCode = new VLIWCode();

    try {
      code.load(modalCode);
      setModalError("");
    } catch (error) {
      // Check if error has the property position. Checking instance of TokenError not working
      const errorMessage = error.pos
        ? `Syntax error at line ${error.pos?.rowBegin}, column ${error.pos?.columnBegin}:
        ${error.errorMessage}`
        : error.message;

      setModalError(errorMessage);
    }

    try {
      vliwCode.load(modalVLIWCode, code);
      VLIWIntegration.loadCode(vliwCode);

      setModalVLIWError("");
      close();
    } catch (error) {
      // Check if error has the property position. Checking instance of TokenError not working
      const errorMessage = error.pos
        ? `Syntax error at line ${error.pos?.rowBegin}, column ${error.pos?.columnBegin}:
        ${error.errorMessage}`
        : error.message;

      setModalVLIWError(errorMessage);
    }
  };

  return (
    <Modal size="xl" show={isLoadModalOpen} onHide={close}>
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
        <Stack gap={0}>
          <Form>
            <Form.Control
              as="textarea"
              style={{ resize: "none" }}
              className={`smd-monospace mx-0 ${
                modalVLIWError
                  ? "border-bottom-0 rounded-bottom-0 border-danger-subtle"
                  : ""
              }`}
              value={modalVLIWCode}
              onChange={(event) => {
                setModalVLIWCode(event.target.value);
              }}
            />
          </Form>
          <div>
            {modalVLIWError && (
              <Alert className="border-top-0 rounded-top-0" variant={"danger"}>
                {modalVLIWError}
              </Alert>
            )}
          </div>
        </Stack>
      </Modal.Body>

      <Modal.Footer className="smd-load_modal-footer">
        <div className="smd-load_modal-file_input">
          <FileReaderInput
            as="text"
            onChange={(_, files) => {
              loadCodeFromFile(files);
            }}
            accept=".pla"
          >
            <Button className="btn btn-primary">
              {t("commonButtons.loadFromFile")}
            </Button>
          </FileReaderInput>
        </div>
        <div className="smd-load_modal-file_input">
          <FileReaderInput
            as="text"
            onChange={(_, files) => {
              loadVLIWCodeFromFile(files);
            }}
            accept=".vliw"
          >
            <Button className="btn btn-primary">
              {t("commonButtons.loadFromFile")}
            </Button>
          </FileReaderInput>
        </div>
        <div className="smd-load_modal-actions">
          <Button onClick={close}>{t("commonButtons.close")}</Button>
          <Button className="btn btn-primary" onClick={loadCode}>
            {t("loadModal.load")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VLIWLoadModalComponent);
