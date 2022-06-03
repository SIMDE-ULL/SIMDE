import * as React from 'react';
import FileReaderInput from 'react-file-reader-input';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { toggleSuperescalarLoadContentModal } from '../../../actions/modals';
import SuperescalarIntegration from '../../../../integration/superescalar-integration';
import { ContentIntegration} from '../../../../integration/content-integration';

class SuperescalarLoadContentModalComponent extends React.Component<any, any> {

      constructor(public props: any, public state: any) {
            super(props);

            this.close = this.close.bind(this);
            this.loadContent = this.loadContent.bind(this);
      }

      close() {
            this.props.actions.toggleSuperescalarLoadContentModal(false);
      };

      handleInputFileChange = (e, results) => {
            results.forEach(result => {
                const [e, file] = result;
                let a = document.getElementById('contentInput') as HTMLInputElement;
                a.value = e.target.result;
            });
        }
    
      loadContent() {
            try {
                const content = (document.getElementById('contentInput') as HTMLInputElement).value;
                this.setState({error: ''});
                const contentIntegration = new ContentIntegration(content);
                SuperescalarIntegration.contentIntegration = contentIntegration;
                SuperescalarIntegration.setFpr(contentIntegration.FPRContent);
                SuperescalarIntegration.setGpr(contentIntegration.GPRContent);
                SuperescalarIntegration.setMemory(contentIntegration.MEMContent);
                SuperescalarIntegration.dispatchAllSuperescalarActions();
                this.close();
            } catch (error) {
                this.setState({error: error.message});
            }
      }

      render() {
            return (
            <Modal className="smd-load_content_modal" show={this.props.isSuperescalarLoadContentModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.t('loadContentModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea id='contentInput' defaultValue={``}>
                </textarea>
                <div className="smd-load_content_modal-errors">
                    {this.state.error && <div className="smd-forms_error">{this.state.error}</div>}
                </div>
            </Modal.Body>

            <Modal.Footer className="smd-load_modal-footer">
                <div className="smd-load_modal-file_input">
                    <FileReaderInput as='text' onChange={this.handleInputFileChange} accept='.mem'>
                        <Button className='btn btn-primary'>{this.props.t('commonButtons.uploadFromFile')}</Button>
                    </FileReaderInput>
                </div>
                <div className="smd-load_modal-actions">
                    <Button onClick={this.close}>{this.props.t('commonButtons.close')}</Button>
                    <Button className='btn btn-primary' onClick={this.loadContent}>{this.props.t('loadModal.load')}</Button>
                </div>
            </Modal.Footer>
        </Modal>);
      }
}

const mapStateToProps = state => {
      return {
          isSuperescalarLoadContentModalOpen: state.Ui.isSuperescalarLoadContentModalOpen,
      }
  }
  
function mapDispatchToProps(dispatch) {
      return { actions: bindActionCreators({toggleSuperescalarLoadContentModal}, dispatch)};
} 
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SuperescalarLoadContentModalComponent));
