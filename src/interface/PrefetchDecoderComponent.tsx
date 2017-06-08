import * as React from 'react';
import { Queue } from '../core/collections/Queue';

declare var window: any;

export class PrefetchDecoderComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };

      // TODO mandar la cola entera y utilizar el elemento final y tal
      window.state[this.props.title] = (data: { content: Queue<any> }) => {
         let newState = {
            content: data.content,
            showableContent: []
         };
         newState.showableContent = this.buildShowableContent(data.content);
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
