import { useCallback } from "react";
import { useDrag } from "react-dnd";

import { OpcodesNames } from "../../../core/Common/Opcodes";

function InstructionComponent(props: any) {
  const loc = props.loc;

  const [, drag] = useDrag(() => ({
    type: "INSTRUCTION",
    item: { loc },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const dragRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag],
  );

  return (
    <div className="smd-table_row" key={`${`Code${props.loc}`}`}>
      <div ref={dragRef} className={"smd-table_cell"}>
        {props.instruction.label} {props.loc}
      </div>
      <div className={`smd-table_cell ${props.color}`}>
        {OpcodesNames[props.instruction.opcode]}
      </div>
      <div className={`smd-table_cell ${props.color}`}>
        {props.instruction.operandsString[0]}
      </div>
      <div className={`smd-table_cell ${props.color}`}>
        {props.instruction.operandsString[1]}
      </div>
      <div className={`smd-table_cell ${props.color}`}>
        {props.instruction.operandsString[2]}
      </div>
    </div>
  );
}

export default InstructionComponent;
