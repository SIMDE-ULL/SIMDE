import * as React from 'react';
declare var window: any;

export class FunctionalUnitComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [1][1]
      }
      this.componentWillMount();
   }

   componentWillMount() {
      window.state.callback = (data) => {
         this.setState(data);
      }
   }
   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{this.state.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <thead>
                     <tr>
                        {this.state.content.map((element, i) => {
                           <td>{i}</td>
                        })}
                     </tr>
                  </thead>
                  <tbody>
                     {
                        this.state.content.map((row, i) => <tr key={i}>
                           <td key={i + 65}>{i}</td>
                           <td key={i + 131}>{row}</td>
                           <td>row.instruction</td>
                           <td>row.Qj</td>
                           <td>row.Vj</td>
                           <td>row.Qk</td>
                           <td>row.Vk</td>
                           <td>row.A</td>
                           <td>row.ROB</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
