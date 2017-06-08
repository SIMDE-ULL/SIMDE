import * as React from 'react';
import * as _ from 'lodash';
import './ROBMapperComponent.scss';

declare var window: any;

export class ROBMapperComponent extends React.Component<any, any> {

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
      this.addInterval = this.addInterval.bind(this);
      this.removeInterval = this.removeInterval.bind(this);

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

   addInterval() {
      let newInterval = prompt('Seleccione un nuevo intervalo');
   }

   removeInterval() {
      console.log('Do something');
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
               <button type='button' className='btn btn-xs' onClick={this.addInterval}><i className='fa fa-plus' aria-hidden='true'></i>
               </button>
               <button type='button' className='btn btn-xs' onClick={this.removeInterval}><i className='fa fa-minus' aria-hidden='true'></i></button>
            </div>
         </div>);
   }
}
