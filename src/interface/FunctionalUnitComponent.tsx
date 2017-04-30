import * as React from 'react';
declare var window: any;

export class FunctionalUnitComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: []
      };
      window.state[this.props.title] = (data) => {
         this.setState(data);
      };
   }

   generateColSize() {
      return this.state.content[0] ? new Array(this.state.content[0].latency) : new Array();
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
                     {this.generateColSize().map((element, i) => {
                        <tr>
                           {this.state.content.map((functionalUnit) => {
                              <td>{this.getCellContent(functionalUnit.flow[i])}</td>
                           })
                           }
                        </tr>;
                     })
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
