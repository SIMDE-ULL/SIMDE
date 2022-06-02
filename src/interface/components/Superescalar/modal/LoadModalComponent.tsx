import * as React from 'react';
import FileReaderInput from 'react-file-reader-input';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { toggleLoadModal } from '../../../actions/modals';
import { bindActionCreators } from 'redux';

import SuperescalarIntegration from '../../../../integration/superescalar-integration';
import { Code } from '../../../../core/Common/Code';

export class LoadModalComponent extends React.Component<any, any> {

    constructor(public props: any, public state: any) {
        super(props);
        this.close = this.close.bind(this);
        this.loadCode = this.loadCode.bind(this);
    }

    close() {
        this.props.actions.toggleLoadModal(false);
    };

    handleInputFileChange = (e, results) => {
        results.forEach(result => {
            const [e, file] = result;
            let a = document.getElementById('codeInput') as HTMLInputElement;
            a.value = e.target.result;
        });
    }

    loadCode() {
        try {
            let code = new Code();
            code.load((document.getElementById('codeInput') as HTMLInputElement).value);
            this.setState({error: ''})
            SuperescalarIntegration.loadCode(code);
            this.close();
        } catch (error) {
            this.setState({error: error.message});
        }
    }

    render() {
        return (
        <Modal className="smd-load_modal" show={this.props.isLoadModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.t('loadModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea id='codeInput' defaultValue={`18
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
   SF	F2 1(R3)`}>
                </textarea>
                <div className="smd-load_modal-errors">
                    {this.state.error && <div className="smd-forms_error">{this.state.error}</div>}
                </div>
            </Modal.Body>

            <Modal.Footer className="smd-load_modal-footer">
                <div className="smd-load_modal-file_input">
                    <FileReaderInput as='text' onChange={this.handleInputFileChange} accept='.pla'>
                        <Button className='btn btn-primary'>{this.props.t('commonButtons.uploadFromFile')}</Button>
                    </FileReaderInput>
                </div>
                <div className="smd-load_modal-actions">
                    <Button onClick={this.close}>{this.props.t('commonButtons.close')}</Button>
                    <Button className='btn btn-primary' onClick={this.loadCode}>{this.props.t('loadModal.load')}</Button>
                </div>
            </Modal.Footer>
        </Modal>);
    }
}

const mapStateToProps = state => {
    return {
        isLoadModalOpen: state.Ui.isLoadModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({toggleLoadModal}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LoadModalComponent));
