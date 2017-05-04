import * as React from 'react';
declare var window: any;

export class PrefetchDecoderComponent extends React.Component<any, any> {

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


   render() {
      return (
         <div className='panel panel-default prefetch-decoder-zone'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.state.content.map((row) => <tr>
                           <td>{row.instruction.id}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
