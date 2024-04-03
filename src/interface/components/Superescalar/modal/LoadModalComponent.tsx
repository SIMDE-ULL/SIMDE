import { toggleLoadModal } from "@/interface/actions/modals";
import FileReaderInput from "@/interface/components/Common/FileReaderInput";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Code } from "@/core/Common/Code";
import SuperescalarIntegration from "@/integration/superescalar-integration";
import { useState } from "react";

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
  const [t] = useTranslation();

  const close = () => {
    actions.toggleLoadModal(false);
  };

  const handleInputFileChange = (_, results) => {
    for (const result of results) {
      const [e, file] = result;
      const a = document.getElementById("codeInput") as HTMLInputElement;
      a.value = e.target.result;
    }
  };

  const loadCode = () => {
    try {
      const code = new Code();
      code.load(
        (document.getElementById("codeInput") as HTMLInputElement).value,
      );
      setModalError("");
      SuperescalarIntegration.loadCode(code);
      close();
    } catch (error) {
      // Check if error has the property position. Checking instance of TokenError not working
      setModalError(
        error.pos
          ? `[${error.pos?.rowBegin}:${error.pos?.columnBegin}]: ${error.errorMessage}`
          : error.message,
      );
    }
  };

  return (
    <Modal className="smd-load_modal" show={isLoadModalOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{t("loadModal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          id="codeInput"
          defaultValue={`   ADDI	R2 R0 #50
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
   SF	F2 1(R3)`}
        />
        <div className="smd-load_modal-errors">
          {modalError && <div className="smd-forms_error">{modalError}</div>}
        </div>
      </Modal.Body>

      <Modal.Footer className="smd-load_modal-footer">
        <div className="smd-load_modal-file_input">
          <FileReaderInput
            as="text"
            onChange={handleInputFileChange}
            accept=".pla"
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadModalComponent);
