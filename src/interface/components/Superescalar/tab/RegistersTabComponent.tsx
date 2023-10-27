import * as React from 'react';
import RegisterComponent from '../RegisterComponent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {         
    addFloatingRegistersInterval,
    removeFloatingRegistersInterval,
    addGeneralRegistersInterval,
    removeGeneralRegistersInterval,
    addMemoryInterval,
    removeMemoryInterval
} from '../../../actions/intervals-actions';
import { MEMORY_SIZE, MACHINE_REGISTER_SIZE } from '../../../../core/Constants';

export class RegisterTabComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

   render() {
      return (
            <div className='smd-register-tab'>
                <div className='smd-register-tab_register'>
                    <RegisterComponent 
                        title='Memoria'
                        data={this.props.memory.data}
                        visibleRange={this.props.memory.visibleRangeValues} 
                        addInterval={this.props.actions.addMemoryInterval}
                        removeInterval={this.props.actions.removeMemoryInterval}
                        max={MEMORY_SIZE}
                    />
                </div>
                <div className='smd-register-tab_register'>
                    <RegisterComponent
                        title='Registros generales'
                        data={this.props.generalRegisters.data}
                        visibleRange={this.props.generalRegisters.visibleRangeValues} 
                        addInterval={this.props.actions.addGeneralRegistersInterval}
                        removeInterval={this.props.actions.removeGeneralRegistersInterval}
                        max={MACHINE_REGISTER_SIZE}
                    />
               </div>
               <div className='smd-register-tab_register'>
                   <RegisterComponent 
                        title='Registros de punto flotante'
                        data={this.props.floatingRegisters.data}
                        visibleRange={this.props.floatingRegisters.visibleRangeValues} 
                        addInterval={this.props.actions.addFloatingRegistersInterval}
                        removeInterval={this.props.actions.removeFloatingRegistersInterval}
                        max={MACHINE_REGISTER_SIZE}
                    />
                </div>
            </div>
            );
   };
}

const mapStateToProps = state => {
    return {
        memory: state.Machine.memory,
        generalRegisters: state.Machine.generalRegisters,
        floatingRegisters: state.Machine.floatingRegisters
    }
}

const mapDispatchToProps = dispatch => {
    return { actions: bindActionCreators({
        addFloatingRegistersInterval,
        removeFloatingRegistersInterval,
        addGeneralRegistersInterval,
        removeGeneralRegistersInterval,
        addMemoryInterval,
        removeMemoryInterval
    }, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTabComponent);
