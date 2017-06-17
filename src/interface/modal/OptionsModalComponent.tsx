import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';

import './OptionsModalComponent.scss';

declare var window: any;

class OptionsModalComponent extends React.Component<any, any> {

   constructor() {
      super();
      window['options'] = (showModal) => {
         this.setState({ showModal: showModal });
      };

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.setOptions = this.setOptions.bind(this);
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

   setOptions() {
      window.loadSuper();
      this.close();
   }

   render() {
      return (<Modal show={this.state.showModal} onHide={this.close}>
         <Modal.Header closeButton>
            <Modal.Title>{t('optionsModal.title')}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <textarea id='codeInput' defaultValue={`18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
// Código de inicialización
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
// Código de finalización
	SF	F2 (R3)
	ADDF	F2 F1 F0
	SF	F2 1(R3)`}>
            </textarea>
         </Modal.Body>
         <Modal.Footer>
            <Button onClick={this.close}>{t('commonButtons.close')}</Button>
            <Button className='btn btn-primary' onClick={this.setOptions}>{t('commonButtons.save')}</Button>
         </Modal.Footer>
      </Modal>);
   }
}

export default translate('common', { wait: true })(OptionsModalComponent);