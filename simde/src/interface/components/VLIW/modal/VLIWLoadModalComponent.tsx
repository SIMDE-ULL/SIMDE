import { Code } from "@/core/Common/Code";
import { VLIWCode } from "@/core/VLIW/VLIWCode";
import FileReaderInput from "@/interface/components/Common/FileReaderInput";
import * as React from "react";
import { useState } from "react";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import VLIWIntegration from "../../../../integration/vliw-integration";
import { toggleLoadModal } from "../../../actions/modals";

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

const DEFAULT_MODAL_VLIW_CODE = `2	0 0 0 0	2 0 1 0
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
`;

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
  const [modalError, setModalError] = useState({ general: "", vliw: "" });
  const [modalCode, setModalCode] = useState({
    general: DEFAULT_MODAL_CODE,
    vliw: DEFAULT_MODAL_VLIW_CODE,
  });
  const [t] = useTranslation();

  const close = () => {
    actions.toggleLoadModal(false);
  };

  const loadCodeFromFile = ([[fileContent]]) => {
    setModalCode({ ...modalCode, general: fileContent.target.result });
  };

  const loadVLIWCodeFromFile = ([[fileContent]]) => {
    setModalCode({ ...modalCode, vliw: fileContent.target.result });
  };

  const loadCode = () => {
    const code = new Code();
    const vliwCode = new VLIWCode();
    let { general: generalError, vliw: vliwError } = modalError;

    try {
      code.load(modalCode.general);
      generalError = "";
    } catch (error) {
      // Check if error has the property position. Checking instance of TokenError not working
      const errorMessage = error.pos
        ? `Syntax error at line ${error.pos?.rowBegin}, column ${error.pos?.columnBegin}:
        ${error.errorMessage}`
        : error.message;

      setModalError({ vliw: "", general: errorMessage });
      return;
    }

    try {
      vliwCode.load(modalCode.vliw, code);
      VLIWIntegration.loadCode(vliwCode);

      vliwError = "";
      close();
    } catch (error) {
      // Check if error has the property position. Checking instance of TokenError not working
      const errorMessage = error.pos
        ? `Syntax error at line ${error.pos?.rowBegin}, column ${error.pos?.columnBegin}:
        ${error.errorMessage}`
        : error.message;
      vliwError = errorMessage;
    }

    setModalError({ general: generalError, vliw: vliwError });
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
                modalError.general
                  ? "border-bottom-0 rounded-bottom-0 border-danger-subtle"
                  : ""
              }`}
              value={modalCode.general}
              onChange={(event) => {
                setModalCode({ ...modalCode, general: event.target.value });
              }}
            />
          </Form>
          <div>
            {modalError.general && (
              <Alert className="border-top-0 rounded-top-0" variant={"danger"}>
                {modalError.general}
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
                modalError.vliw
                  ? "border-bottom-0 rounded-bottom-0 border-danger-subtle"
                  : ""
              }`}
              value={modalCode.vliw}
              onChange={(event) => {
                setModalCode({ ...modalCode, vliw: event.target.value });
              }}
            />
          </Form>
          <div>
            {modalError.vliw && (
              <Alert className="border-top-0 rounded-top-0" variant={"danger"}>
                {modalError.vliw}
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
