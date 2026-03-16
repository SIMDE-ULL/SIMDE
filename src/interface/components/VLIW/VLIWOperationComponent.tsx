import { useCallback } from "react";
import { useDrop } from "react-dnd";

interface VLIWOperationComponentProps {
  op: string;
  pos: [number, number];
  onDropInstruction: (item: { loc: number }, pos: [number, number]) => void;
}

function VLIWOperationComponent(props: VLIWOperationComponentProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "INSTRUCTION",
    drop: (item) => {
      try {
        props.onDropInstruction(item as { loc: number }, props.pos);
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
