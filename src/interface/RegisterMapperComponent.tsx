import * as React from 'react';
declare var window: any;

export class RegisterMapperComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         show: [1, 8]
      }
      window.state[this.props.title] = (data) => {
         this.setState(data);
      };
   }

   render() {
      return (
         <div className='panel panel-default register-mapper'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.state.content.map((row, i) => <tr key={`${this.state.title + i}`}>
                           <td key={`${this.state.title + i + 65}`}>{i}</td>
                           <td key={`${this.state.title + i + 131}`}>{row}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
            <div className='panel-footer'>
               <button type='button' className='btn btn-xs'><i className='fa fa-plus' aria-hidden='true'></i>
               </button>
               <button type='button' className='btn btn-xs'><i className='fa fa-minus' aria-hidden='true'></i></button>
               <button type='button' className='btn btn-xs'><i className='fa fa-check' aria-hidden='true'></i></button>
               <button type='button' className='btn btn-xs'><i className='fa fa-times' aria-hidden='true'></i></button>
               <button type='button' className='btn btn-xs'><i className='fa fa-repeat' aria-hidden='true'></i></button>
            </div>
         </div>);
   }
}
