import * as React from "react";
import RegisterComponent from "../RegisterComponent";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  addFloatingRegistersInterval,
  removeFloatingRegistersInterval,
  addGeneralRegistersInterval,
  removeGeneralRegistersInterval,
  addMemoryInterval,
  removeMemoryInterval,
} from "../../../actions/intervals-actions";
import { Machine } from "../../../../core/Common/Machine";

/** Tab displaying memory, general purpose, and floating point register banks. */
export const RegisterTabComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const memory = useAppSelector((state) => state.Machine.memory);
  const generalRegisters = useAppSelector((state) => state.Machine.generalRegisters);
  const floatingRegisters = useAppSelector((state) => state.Machine.floatingRegisters);

  return (
    <div className="smd-register-tab">
      <div className="smd-register-tab_register">
        <RegisterComponent
          title="memory"
          data={memory.data}
          visibleRange={memory.visibleRangeValues}
          addInterval={(v) => dispatch(addMemoryInterval(v))}
          removeInterval={(v) => dispatch(removeMemoryInterval(v))}
          max={Machine.MEMORY_SIZE}
        />
      </div>
      <div className="smd-register-tab_register">
        <RegisterComponent
          title="generalRegisters"
          data={generalRegisters.data}
          visibleRange={generalRegisters.visibleRangeValues}
          addInterval={(v) => dispatch(addGeneralRegistersInterval(v))}
          removeInterval={(v) => dispatch(removeGeneralRegistersInterval(v))}
          max={Machine.NGP}
        />
      </div>
      <div className="smd-register-tab_register">
        <RegisterComponent
          title="floatRegisters"
          data={floatingRegisters.data}
          visibleRange={floatingRegisters.visibleRangeValues}
          addInterval={(v) => dispatch(addFloatingRegistersInterval(v))}
          removeInterval={(v) => dispatch(removeFloatingRegistersInterval(v))}
          max={Machine.NFP}
        />
      </div>
    </div>
  );
};

export default RegisterTabComponent;
