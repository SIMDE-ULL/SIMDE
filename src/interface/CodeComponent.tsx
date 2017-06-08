import * as React from 'react';
import { Code } from '../core/Code';
import { Instruction } from '../core/Instruction';

import './CodeComponent.scss';
declare var window: any;

export class CodeComponent extends React.Component<any, any> {

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
      window.state['Code'] = (data) => {
         console.log('Setting code data', data);
         this.setState(data);
      };
      this.setBreakpoint = this.setBreakpoint.bind(this);
   }

   setBreakpoint(e, i) {
      window.setBreakpoint(i);
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{'Code'}</div>
            <div className='panel-body'>
               <table className='table'>
                  <thead>
                     <th>#</th>
                     <th>OPCODE</th>
                     <th>OP1</th>
                     <th>OP2</th>
                     <th>OP3</th>
                  </thead>
                  <tbody>
                     {
                        this.state.code.map((row: Instruction, i) =>
                           <tr key={`${'Code' + i}`} onClick={(e) => { this.setBreakpoint(e, i); }}>
                              <td className={`${row.breakPoint ? 'breakPoint' : ''}`}>{row.label} {i}</td>
                              <td className={`${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{Code.OpcodesNames[row.opcode]}</td>
                              <td className={`${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{row.operandsString[0]}</td>
                              <td className={`${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{row.operandsString[1]}</td>
                              <td className={`${this.state.color ? this.state.colorPalette[row.basicBlock % this.state.colorPalette.length] : ''}`}>{row.operandsString[2]}</td>
                           </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
