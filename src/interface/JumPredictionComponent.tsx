import * as React from 'react';
import { BaseComponent } from './BaseComponent';
declare var window: any;

export class JumpPredictionComponent extends BaseComponent {

   history: any[];
   historyLength: 10;

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: new Array(16).fill(0),
         contentShowable: []
      };
      this.history = [];

      window.state[this.props.title] = (data) => {
         let newState = {
            content: data.content.slice(),
            contentShowable: []
         };
         for (let i = 0; i < newState.content.length; i++) {
            newState.contentShowable.push(data.content[i] ? data.content[i] : ' ');
         }
         // Set a limit for history
         if (!(this.history.length < this.historyLength)) {
            this.history.shift();
         }
         this.history.push(newState.contentShowable);

         this.setState(newState);
      };
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.state.contentShowable.map((row, i) => <tr key={`${this.state.title + i}`}>
                           <td width='40%' key={`${this.state.title + i + 65}`}>{i}</td>
                           <td width='60%' key={`${this.state.title + i + 131}`}>{row}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
