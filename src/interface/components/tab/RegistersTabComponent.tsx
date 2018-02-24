import * as React from 'react';
import RegisterComponent from '../RegisterComponent';
import { connect } from 'react-redux';

export class RegisterTabComponent extends React.Component<any, any> {

   render() {
      return (<div id='menu1' className='tab-pane fade'>
         <div className='row'>
            <div className='col-sm-4'>
               <RegisterComponent title='Memoria' content={this.props.memory} />
            </div>
            <div className='col-sm-4'>
               <RegisterComponent title='Registros generales' content={this.props.generalRegisters} />
            </div>
            <div className='col-sm-4'>
               <RegisterComponent title='Registros de punto flotante' content={this.props.floatingRegisters} />
            </div>
         </div>
      </div>);
   };
}

const mapStateToProps = state => {
    return {
        memory: state.memory,
        generalRegisters: state.generalRegisters,
        floatingRegisters: state.floatingRegisters
    }
}
export default connect(mapStateToProps)(RegisterTabComponent);