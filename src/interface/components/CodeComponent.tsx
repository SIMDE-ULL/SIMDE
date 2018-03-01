import * as React from 'react';
import { OpcodesNames } from '../../core/Common/Opcodes';

import { Instruction } from '../../core/Common/Instruction';

import { translate } from 'react-i18next';

declare var window: any;

class CodeComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
               content: [],
               code: [],
               color: false,
               colorPalette: [
                  'blue',
                  'green',
                  'yellow',
                  'pink'
               ]
            };
      this.setBreakpoint = this.setBreakpoint.bind(this);
   }

   setBreakpoint(e, i) {
      window.setBreakpoint(i);
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
                                                      <div className='smd-table_row' key={`${'Code' + i}`} onClick={(e) => { this.setBreakpoint(e, i); }}>
                                                            <div className={`smd-table_cell ${row.breakPoint ? 'smd-breakPoint' : ''}`}>{row.label} {i}</div>
                                                            <div className={`smd-table_cell ${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{OpcodesNames[row.opcode]}</div>
                                                            <div className={`smd-table_cell ${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{row.operandsString[0]}</div>
                                                            <div className={`smd-table_cell ${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{row.operandsString[1]}</div>
                                                            <div className={`smd-table_cell ${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{row.operandsString[2]}</div>
                                                      </div>)
                                          }
                                    </div>
                              </div>
                        </div>
                  </div>);
   }
}

export default translate('common', { wait: true })(CodeComponent);
