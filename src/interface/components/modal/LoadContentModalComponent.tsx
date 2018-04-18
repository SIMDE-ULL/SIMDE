import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { connect } from 'react-redux';
import * as FileReaderInput from 'react-file-reader-input';

import { bindActionCreators } from 'redux';
import { toggleLoadContentModal } from '../../actions/modals';
import SuperescalarIntegration from '../../../integration/superescalar-integration';
import { ContentIntegration} from '../../../integration/content-integration';

class LoadContentModalComponent extends React.Component<any, any> {

      constructor(public props: any, public state: any) {
            super(props);

            this.close = this.close.bind(this);
            this.loadContent = this.loadContent.bind(this);
      }

      close() {
            this.props.actions.toggleLoadContentModal(false);
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
            return (<Modal className="smd-load_content_modal" show={this.props.isLoadContentModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{t('loadContentModal.title')}</Modal.Title>
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
                        <Button className='btn btn-primary'>{t('commonButtons.uploadFromFile')}</Button>
                    </FileReaderInput>
                </div>
                <div className="smd-load_modal-actions">
                    <Button onClick={this.close}>{t('commonButtons.close')}</Button>
                    <Button className='btn btn-primary' onClick={this.loadContent}>{t('loadModal.load')}</Button>
                </div>
            </Modal.Footer>
        </Modal>);
      }
}

const mapStateToProps = state => {
      return {
          isLoadContentModalOpen: state.isLoadContentModalOpen,
      }
  }
  
function mapDispatchToProps(dispatch) {
      return { actions: bindActionCreators({toggleLoadContentModal}, dispatch)};
} 
export default translate('common', { wait: true })(connect(mapStateToProps, mapDispatchToProps)(LoadContentModalComponent));
