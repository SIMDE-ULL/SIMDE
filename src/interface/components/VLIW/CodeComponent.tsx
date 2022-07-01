import * as React from 'react';

import { Instruction } from '../../../core/Common/Instruction';
import InstructionComponent from './InstructionComponent';

import SuperescalarIntegration from '../../../integration/superescalar-integration';


class CodeComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            colorPalette: [
                'blue',
                'green',
                'yellow',
                'pink'
            ]
        };
    }

    setColor(row) {
        return this.props.colorBasicBlocks ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''
    }

   render() {
       return (
            <div className='smd-code panel panel-default'>
                <div className='panel-heading'>
                    Code
            </div>
                <div className='panel-body'>
                    <div className='smd-table'>
                        <div className='smd-table-header'>
                            <div className='smd-table-header_title'>#</div>
                            <div className='smd-table-header_title'>OPCODE</div>
                            <div className='smd-table-header_title'>OP1</div>
                            <div className='smd-table-header_title'>OP2</div>
                            <div className='smd-table-header_title'>OP3</div>
                        </div>
                        <div className='smd-table-body'>
                            {
                                this.props.code && this.props.code.map((row: Instruction, i) =>
                                    <InstructionComponent instruction={row} key={i} loc={i}
                                        color={this.setColor(row)}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>);
    }
}



export default CodeComponent;
