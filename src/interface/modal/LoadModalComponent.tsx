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
   }

   render() {
      return (<Modal show={this.state.showModal} onHide={this.close}>
         <Modal.Header closeButton>
            <Modal.Title>Carga de código</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <textarea id='codeInput' defaultValue={`5
        LF F1 (R2)
        ADDI R5 R0 #3
        LOOP:
        ADDF F2 F1 F0
        ADDI R2 R2 #1
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
