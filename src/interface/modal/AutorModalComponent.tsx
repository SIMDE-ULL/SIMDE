import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

declare var window: any;

export class AutorModalComponent extends React.Component<any, any> {

   constructor() {
      super();
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
            <Modal.Title>Acerda de...</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div className='text-center'>
               <div className='row'>
                  <div className='col-sm-12'>
                     <label>Autor original</label>: Iván Castilla Rodríguez
            </div>
               </div>
               <div className='row'>
                  <div className='col-sm-12'>
                     <label>Versión adaptada por</label>: Adrián Abreu González
               </div>
               </div>
            </div>
         </Modal.Body>
         <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
         </Modal.Footer>
      </Modal>);
   }
}
