import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { toggleAuthorModal } from '../../actions/modals';

class AutorModalComponent extends React.Component<any, any> {

      constructor(public props: any, public state: any) {
            super(props);

            this.close = this.close.bind(this);
      }

      close() {
            this.props.actions.toggleAuthorModal(false);
      };

      render() {
            return (<Modal show={this.props.isAuthorModalOpen} onHide={this.close}>
                  <Modal.Header closeButton>
                        <Modal.Title>{t('authorModal.title')}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className='text-center'>
                              <div className='row'>
                                    <div className='col-sm-12'>
                                          <label>{t('authorModal.originalAuthor')}</label>: Iván Castilla Rodríguez
            </div>
                              </div>
                              <div className='row'>
                                    <div className='col-sm-12'>
                                          <label>{t('authorModal.newAuthor')}</label>: Adrián Abreu González
               </div>
                              </div>
                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button onClick={this.close}>{t('commonButtons.close')}</Button>
                  </Modal.Footer>
            </Modal>);
      }
}

const mapStateToProps = state => {
      return {
          isAuthorModalOpen: state.isAuthorModalOpen,
      }
  }
  
function mapDispatchToProps(dispatch) {
      return { actions: bindActionCreators({toggleAuthorModal}, dispatch)};
} 
export default translate('common', { wait: true })(connect(mapStateToProps, mapDispatchToProps)(AutorModalComponent));
