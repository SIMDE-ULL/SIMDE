import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { Queue } from '../core/collections/Queue';

declare var window: any;

export class PrefetchDecoderComponent extends BaseComponent {

   history: any[];

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };
      this.history = new Array();
      window.state[this.props.title] = (data: { content: Queue<any>, step: number }) => {
         let newState = {
            content: data.content,
            showableContent: []
         };
         if (data.step) {
            newState.showableContent = this.history[data.step].content;
         } else {
            newState.showableContent = this.buildShowableContent(data.content);
            if (this.history.length < 10) {
               this.history.push(Object.assign({}, { content: newState.showableContent }));
            } else {
               this.history.shift();
               this.history.push(Object.assign({}, newState.showableContent));
            }
         }
         this.setState(newState);
      };
   }

   buildShowableContent(data: Queue<any>) {
      let toReturn = new Array(data.elements.length - 1);
      toReturn.fill(' ');
      for (let i = data.first, j = 0; i !== data.last; i = data.nextIterator(i), j++) {
         toReturn[j] = ((data.getElement(i) != null) ? data.getElement(i).instruction.id : '0');
      }
      return toReturn;
   }


   render() {
      return (
         <div className='panel panel-default prefetch-decoder-zone'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.state.showableContent.map((element, i) =>
                           <tr key={this.props.title + 'row' + i}>
                              <td key={this.props.title + i}>{element}</td>
                           </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
