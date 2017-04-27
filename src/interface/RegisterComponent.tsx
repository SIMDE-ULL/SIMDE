import * as React from 'react';

export class Register extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {this.props.content.map((row, i) => <tr key={row}>
                        <td key={row + 64}>{i}</td>
                        <td key={row + 128}>{row}</td>
                     </tr>)}
                  </tbody>
               </table>
            </div>
            <div className='panel-footer'>
               <button type='button' className='btn'><i className='fa fa-plus' aria-hidden='true'></i>
               </button>
               <button type='button' className='btn'><i className='fa fa-minus' aria-hidden='true'></i></button>
               <button type='button' className='btn'><i className='fa fa-check' aria-hidden='true'></i></button>
               <button type='button' className='btn'><i className='fa fa-times' aria-hidden='true'></i></button>
               <button type='button' className='btn'><i className='fa fa-repeat' aria-hidden='true'></i></button>
            </div>
         </div>);
   }
}
