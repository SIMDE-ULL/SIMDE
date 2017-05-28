import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './SuperescalarConfigModalComponent.scss';

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
            <form className='form form-horizontal'>
               <div className='form-group'>
                  <div className='col-sm-4 col-sm-offset-4'>
                     <label>Cantidad</label>
                  </div>
                  <div className='col-sm-4'>
                     <label>Latencia</label>
                  </div>
               </div>
               <div className='form-group'>
                  <fieldset>
                     <div className='col-sm-4'>
                        <legend className='control-label'>Suma Entera</legend>
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='integerSumQuantity'
                           type='number'
                           min='1'
                           max='10'
                           value={this.state.superConfig.integerSumQuantity}
                           onChange={this.handleChange}
                        />
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='integerSumLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.integerSumLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </fieldset>
               </div>
               <div className='form-group'>
                  <fieldset>
                     <div className='col-sm-4'>
                        <legend className='control-label'>Mult Entera</legend>
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='integerMultQuantity'
                           type='number'
                           min='1'
                           max='10'
                           value={this.state.superConfig.integerMultQuantity}
                           onChange={this.handleChange}
                        />
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='integerMultLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.integerMultLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </fieldset>
               </div>
               <div className='form-group'>
                  <fieldset>
                     <div className='col-sm-4'>
                        <legend className='control-label'>Suma Flotante</legend>
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='floatingSumQuantity'
                           type='number'
                           min='1'
                           max='10'
                           value={this.state.superConfig.floatingSumQuantity}
                           onChange={this.handleChange}
                        />
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='floatingSumLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.floatingSumLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </fieldset>
               </div>
               <div className='form-group'>
                  <fieldset>
                     <div className='col-sm-4'>
                        <legend className='control-label'>Mult. Flotante</legend>
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='floatingMultQuantity'
                           type='number'
                           min='1'
                           max='10'
                           value={this.state.superConfig.floatingMultQuantity}
                           onChange={this.handleChange}
                        />
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='floatingMultLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.floatingMultLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </fieldset>
               </div>
               <div className='form-group'>
                  <fieldset>
                     <div className='col-sm-4'>
                        <legend className='control-label'>Memoria</legend>
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='memoryQuantity'
                           type='number'
                           min='1'
                           max='10'
                           value={this.state.superConfig.memoryQuantity}
                           onChange={this.handleChange}
                        />
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='memoryLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.memoryLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </fieldset>
               </div>
               <div className='form-group'>
                  <fieldset>
                     <div className='col-sm-4'>
                        <legend className='control-label'>Salto</legend>
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='jumpQuantity'
                           type='number'
                           min='1'
                           max='10'
                           value={this.state.superConfig.jumpQuantity}
                           onChange={this.handleChange}
                        />
                     </div>
                     <div className='col-sm-4'>
                        <input
                           className='form-control'
                           name='jumpLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.jumpLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </fieldset>
               </div>

               <div className='extraParams'>
                  <div className='form-group'>
                     <div className='col-sm-4'>
                        <label htmlFor='cacheFailLatency' className='control-label'> Fallo de cache
                  </label>
                     </div>
                     <div className='col-sm-8'>
                        <input
                           className='form-control'
                           name='cacheFailLatency'
                           type='number'
                           min='1'
                           max='100'
                           value={this.state.superConfig.cacheFailLatency}
                           onChange={this.handleChange}
                        />
                     </div>
                  </div>
                  <div className='form-group'>
                     <div className='col-sm-4'>
                        <label htmlFor='issueGrade' className='control-label'> Emision
                  </label>
                     </div>
                     <div className='col-sm-8'>
                        <input
                           className='form-control'
                           name='issueGrade'
                           type='number'
                           min='2'
                           max='16'
                           value={this.state.superConfig.issueGrade}
                           onChange={this.handleChange}
                        />
                     </div>
                  </div>
               </div>
            </form>
         </Modal.Body>
         <Modal.Footer>
            <Button className='btn btn-primary' onClick={this.setDefault}>Valores por defecto</Button>
            <Button onClick={this.cancel}>Cancelar</Button>
            <Button className='btn btn-primary' onClick={this.saveSuperConfig}>Guardar</Button>
         </Modal.Footer>
      </Modal>);
   }
}
