import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './LoadModelComponent.css';

declare var window: any;

export class LoadModalComponent extends React.Component<any, any> {

   constructor() {
      super();
      window['loadModal'] = (showModal) => {
         this.setState({ showModal: showModal });
      };

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.loadSuper = this.loadSuper.bind(this);
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


   loadSuper() {
      window.loadSuper();
      this.close();
   }

   render() {
      return (<Modal show={this.state.showModal} onHide={this.close}>
         <Modal.Header closeButton>
            <Modal.Title>Carga de código</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <textarea id='codeInput' defaultValue={`11
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
         </Modal.Body>
         <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button className='btn btn-primary' onClick={this.loadSuper}>Load</Button>
         </Modal.Footer>
      </Modal>);
   }
}
