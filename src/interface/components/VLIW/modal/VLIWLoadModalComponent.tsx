import * as React from 'react';
import FileReaderInput from '../../Common/FileReaderInput';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { toggleLoadModal } from '../../../actions/modals';
import { bindActionCreators } from 'redux';

import VLIWIntegration from '../../../../integration/vliw-integration';
import { Code } from '../../../../core/Common/Code';
import { VLIWCode } from '../../../../core/VLIW/VLIWCode';

export class VLIWLoadModalComponent extends React.Component<any, any> {

    constructor(public props: any, public state: any) {
        super(props);

        this.close = this.close.bind(this);
        this.loadCode = this.loadCode.bind(this);
        this.state = {
            superescalarCodeError: '',
            vliwCodeError: ''            
        }
    }

    close() {
        this.props.actions.toggleLoadModal(false);
    };

    handleSuperescalarInputFileChange = (e, results) => {
        results.forEach(result => {
            const [e, file] = result;
            let a = document.getElementById('superescalarCodeInput') as HTMLInputElement;
            a.value = e.target.result;
        });
    }

    handleVliwInputFileChange = (e, results) => {
        results.forEach(result => {
            const [e, file] = result;
            let a = document.getElementById('vliwCodeInput') as HTMLInputElement;
            a.value = e.target.result;
        });
    }

    loadCode() {
        let code = new Code();
        let vliwCode = new VLIWCode();
        
        try {
            code.load((document.getElementById('superescalarCodeInput') as HTMLInputElement).value);
            this.setState({superescalarCodeError: ''});
        } catch (error) {
            this.setState({superescalarCodeError: error.message});
        }

        try {
            let inputVliwCode = (document.getElementById('vliwCodeInput') as HTMLInputElement).value;
            vliwCode.load(inputVliwCode, code);
            VLIWIntegration.loadCode(vliwCode);
            
            this.setState({vliwCodeError: ''});
            this.close();
        } catch (error) {
            this.setState({ vliwCodeError: error.message });
        }
    }

    render() {
        return (<Modal size='xl' className="smd-load_modal" show={this.props.isLoadModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.t('loadModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea id='superescalarCodeInput' defaultValue={`11
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
	BNE	R2 R5 LOOP`}>
                </textarea>
                <div className="smd-load_modal-errors">
                    {this.state.superescalarCodeError && <div className="smd-forms_error">{this.state.superescalarCodeError}</div>}
                </div>
                <textarea id='vliwCodeInput' defaultValue={`15
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
    1	9 0 1 0`}>
                </textarea>
                <div className="smd-load_modal-errors">
                    {this.state.vliwCodeError && <div className="smd-forms_error">{this.state.vliwCodeError}</div>}
                </div>
            </Modal.Body>

            <Modal.Footer className="smd-load_modal-footer">
                <div className="smd-load_modal-file_input">
                    <FileReaderInput as='text' onChange={this.handleSuperescalarInputFileChange} accept='.pla'>
                        <Button className='btn btn-primary'>{this.props.t('commonButtons.uploadFromFile')}</Button>
                    </FileReaderInput>
                </div>
                <div className="smd-load_modal-file_input">
                    <FileReaderInput as='text' onChange={this.handleVliwInputFileChange} accept='.vliw'>
                        <Button className='btn btn-primary'>{this.props.t('commonButtons.uploadVliwFromFile')}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(VLIWLoadModalComponent));
