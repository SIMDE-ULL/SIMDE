import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
declare var window: any;

export class SuperescalarConfigModalComponent extends React.Component<any, any> {

   constructor() {
      super();
      window['superConfigModal'] = (showModal) => {
         this.setState({
            showModal: showModal
         });
      };

      this.cancel = this.cancel.bind(this);
      this.open = this.open.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.setDefault = this.setDefault.bind(this);
      this.saveSuperConfig = this.saveSuperConfig.bind(this);
   }

   componentWillMount() {
      this.setState({
         superConfig: {
            integerSumQuantity: 2,
            integerSumLatency: 1,
            integerMultQuantity: 2,
            integerMultLatency: 2,
            floatingSumQuantity: 2,
            floatingSumLatency: 4,
            floatingMultQuantity: 2,
            floatingMultLatency: 6,
            memoryQuantity: 2,
            memoryLatency: 4,
            jumpQuantity: 1,
            jumpLatency: 2,
            cacheFailLatency: 9,
            issueGrade: 4
         },
         showModal: false
      });
   }

   saveSuperConfig() {
      window.saveSuperConfig(this.state.superConfig);
      this.close();
   }

   handleChange(event) {
      let newState = Object.assign({}, this.state);
      newState.superConfig[event.target.name] = event.target.value;
      this.setState(newState);
   }

   cancel() {
      this.setDefault();
      this.close();
   }

   setDefault() {
      this.setState({
         superConfig: {
            integerSumQuantity: 2,
            integerSumLatency: 1,
            integerMultQuantity: 2,
            integerMultLatency: 2,
            floatingSumQuantity: 2,
            floatingSumLatency: 4,
            floatingMultQuantity: 2,
            floatingMultLatency: 6,
            memoryQuantity: 2,
            memoryLatency: 4,
            jumpQuantity: 1,
            jumpLatency: 2,
            cacheFailLatency: 9,
            issueGrade: 4
         }
      });
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
            <Modal.Title>Configuración Superescalar</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <form>
               <fieldset>
                  <legend>Suma Entera</legend>
                  <input
                     name='integerSumQuantity'
                     type='number'
                     min='1'
                     max='10'
                     value={this.state.superConfig.integerSumQuantity}
                     onChange={this.handleChange}
                  />
                  <input
                     name='integerSumLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.integerSumLatency}
                     onChange={this.handleChange}
                  />
               </fieldset>
               <fieldset>
                  <legend>Mult Entera</legend>
                  <input
                     name='integerMultQuantity'
                     type='number'
                     min='1'
                     max='10'
                     value={this.state.superConfig.integerMultQuantity}
                     onChange={this.handleChange}
                  />
                  <input
                     name='integerMultLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.integerMultLatency}
                     onChange={this.handleChange}
                  />
               </fieldset>
               <fieldset>
                  <legend>Suma Flotante</legend>
                  <input
                     name='floatingSumQuantity'
                     type='number'
                     min='1'
                     max='10'
                     value={this.state.superConfig.floatingSumQuantity}
                     onChange={this.handleChange}
                  />
                  <input
                     name='floatingSumLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.floatingSumLatency}
                     onChange={this.handleChange}
                  />
               </fieldset>
               <fieldset>
                  <legend>Mult. Flotante</legend>
                  <input
                     name='floatingMultQuantity'
                     type='number'
                     min='1'
                     max='10'
                     value={this.state.superConfig.floatingMultQuantity}
                     onChange={this.handleChange}
                  />
                  <input
                     name='floatingMultLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.floatingMultLatency}
                     onChange={this.handleChange}
                  />
               </fieldset>
               <fieldset>
                  <legend>Memoria</legend>
                  <input
                     name='memoryQuantity'
                     type='number'
                     min='1'
                     max='10'
                     value={this.state.superConfig.memoryQuantity}
                     onChange={this.handleChange}
                  />
                  <input
                     name='memoryLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.memoryLatency}
                     onChange={this.handleChange}
                  />
               </fieldset>
               <fieldset>
                  <legend>Salto</legend>
                  <input
                     name='jumpQuantity'
                     type='number'
                     min='1'
                     max='10'
                     value={this.state.superConfig.jumpQuantity}
                     onChange={this.handleChange}
                  />
                  <input
                     name='jumpLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.jumpLatency}
                     onChange={this.handleChange}
                  />
               </fieldset>
               <label> Fallo de cache
                  <input
                     name='cacheFailLatency'
                     type='number'
                     min='1'
                     max='100'
                     value={this.state.superConfig.cacheFailLatency}
                     onChange={this.handleChange}
                  />
               </label>
               <label> Emision
                  <input
                     name='issueGrade'
                     type='number'
                     min='2'
                     max='16'
                     value={this.state.superConfig.issueGrade}
                     onChange={this.handleChange}
                  />
               </label>
            </form>
         </Modal.Body>
         <Modal.Footer>
            <Button className='btn btn-primary' onClick={this.setDefault}>Default</Button>
            <Button onClick={this.cancel}>Close</Button>
            <Button className='btn btn-primary' onClick={this.saveSuperConfig}>Save</Button>
         </Modal.Footer>
      </Modal>);
   }
}
