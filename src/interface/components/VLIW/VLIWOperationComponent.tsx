import { useCallback } from "react";
import { useDrop } from "react-dnd";

function VLIWOperationComponent(props: any) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "INSTRUCTION",
    drop: (item) => {
      try {
        props.onDropInstruction(item, props.pos);
      } catch (e) {
        console.log((e as Error).message);
      }
    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop],
  );

  return (
    <div
      ref={dropRef}
      className={
        isOver ? "smd-table_cell smd-table_cell_isover" : "smd-table_cell"
      }
      key={`${`VliwCode${props.pos[0]}${props.pos[1]}`}`}
    >
      {props.op}
    </div>
  );
}

export default VLIWOperationComponent;
