import * as React from "react";
import RegisterComponent from "../RegisterComponent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addFloatingRegistersInterval,
  removeFloatingRegistersInterval,
  addGeneralRegistersInterval,
  removeGeneralRegistersInterval,
  addMemoryInterval,
  removeMemoryInterval,
} from "../../../actions/intervals-actions";
//TODO: dont import from core, expose this data with integrators instead
import { Machine } from "../../../../core/Common/Machine";

export class RegisterVLIWTabComponent extends React.Component<any, any> {
  render() {
    return (
      <div className="smd-register-tab">
        <div className="smd-register-tab_register">
          <RegisterComponent
            title="memory"
            data={this.props.memory.data}
            visibleRange={this.props.memory.visibleRangeValues}
            addInterval={this.props.actions.addMemoryInterval}
            removeInterval={this.props.actions.removeMemoryInterval}
            max={Machine.MEMORY_SIZE}
          />
        </div>
        <div className="smd-register-tab_register">
          <RegisterComponent
            title="generalRegisters"
            data={this.props.generalRegisters.data}
            visibleRange={this.props.generalRegisters.visibleRangeValues}
            addInterval={this.props.actions.addGeneralRegistersInterval}
            removeInterval={this.props.actions.removeGeneralRegistersInterval}
            max={Machine.NGP}
          />
        </div>
        <div className="smd-register-tab_register">
          <RegisterComponent
            title="floatRegisters"
            data={this.props.floatingRegisters.data}
            visibleRange={this.props.floatingRegisters.visibleRangeValues}
            addInterval={this.props.actions.addFloatingRegistersInterval}
            removeInterval={this.props.actions.removeFloatingRegistersInterval}
            max={Machine.NFP}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    memory: state.Machine.memory,
    generalRegisters: state.Machine.generalRegisters,
    floatingRegisters: state.Machine.floatingRegisters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        addFloatingRegistersInterval,
        removeFloatingRegistersInterval,
        addGeneralRegistersInterval,
        removeGeneralRegistersInterval,
        addMemoryInterval,
        removeMemoryInterval,
      },
      dispatch,
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterVLIWTabComponent);
