import * as React from 'react';

import { useDrop } from 'react-dnd';


function VLIWOperationComponent(props) {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'INSTRUCTION',
        drop: (item, monitor) => {
            try {
                props.onDropInstruction(item, props.pos);
            } catch(e) {
                console.log(e.message);
            }
        },

        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    return (
        <div ref={drop}
            className={ isOver ? "smd-table_cell smd-table_cell_isover" : "smd-table_cell" }
            key={`${'VliwCode' + props.pos[0] + '' + props.pos[1]}`}>
            { props.op }
        </div>
    )
}

export default VLIWOperationComponent;
