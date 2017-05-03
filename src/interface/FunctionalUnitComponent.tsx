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
         console.log('Set data', data);
         this.setState(data);
      };
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
                     {this.generateColSize().map((element, i) => {
                        <p key={i}>{element}</p>
                        {/*<tr>
                           {this.state.content.flow.map((functionalUnit) => {
                              <td>{this.getCellContent(functionalUnit.flow[i])}</td>;
                           })
                           }
                        </tr>;*/}
                     })
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
