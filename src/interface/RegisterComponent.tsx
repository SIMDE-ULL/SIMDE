import * as React from 'react';
import './RegisterComponent.scss';

declare var window: any;

export class RegisterComponent extends React.Component<any, any> {

   history: any[];
   historyLength: 10;

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: new Array(64).fill(0),
         contentShowable: [],
         show: [1, 8]
      };
      this.history = [];

      window.state[this.props.title] = (data) => {
         let newState = {
            content: data.content.slice(),
            contentShowable: []
         };
         newState.contentShowable = data.content.slice(this.state.show[0], this.state.show[1]);
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
