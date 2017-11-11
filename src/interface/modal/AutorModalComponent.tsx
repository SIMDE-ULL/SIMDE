import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class AutorModalComponent extends React.Component<any, any> {

   constructor(public props: any, public state: any) {
      super(props);
      window['autorModal'] = (showModal) => {
         this.setState({ showModal: showModal });
      };

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
   }

   componentWillMount() {
      this.setState({ showModal: false });
   }

   close() {
      this.setState({ showModal: false });
   };

   open() {
      this.setState({ showModal: true });
   };

   render() {
      return (<Modal show={this.state.showModal} onHide={this.close}>
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

export default translate('common', { wait: true })(AutorModalComponent);
