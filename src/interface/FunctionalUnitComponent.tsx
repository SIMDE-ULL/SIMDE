import * as React from 'react';
declare var window: any;

export class FunctionalUnitComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };
      window.state[this.props.title] = (data) => {
         let newState = {
            content: data,
            showableContent: null
         };
         // #0 | #1
         // L1   L1
         // L2   L2
         // L3   L3
         // -> Number of Funcional Units
         // | Latency

         newState.showableContent = this.buildShowableContent(data).slice();
         this.setState(data);
      };
   }

   buildShowableContent(data): any[] {
      let toReturn = new Array();
      if (data != null && data[0] != null) {
         for (let i = 0; i < data[0].flow.length; i++) {
            let aux = [];
            for (let j = 0; j < data.length; j++) {
               aux.push(data[j][i]);
            }
            toReturn.push(aux);
         }
      }
      return toReturn;
   }

   generateColSize(): number[] {
      console.log('Col size', this.state.content[0]);
      let toReturn = new Array();
      if (this.state.content[0]) {
         toReturn.length = this.state.content[0].latency;
         toReturn.fill(1);
      }
      return toReturn;
   }

   getCellContent(element) {
      return element ? element : '';
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {this.state.showableContent.map(element => {
                        <tr>
                           {
                              element.map(flow => {
                                 <td>{flow}</td>
                              })
                           }
                        </tr>
                     })
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
