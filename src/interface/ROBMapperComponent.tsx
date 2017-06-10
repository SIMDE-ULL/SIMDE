import * as React from 'react';
import * as _ from 'lodash';
import './ROBMapperComponent.scss';

declare var window: any;

export class ROBMapperComponent extends React.Component<any, any> {

   history: any[];
   historyLength = 10;
   maxElem = 64;
   show: Set<number>;

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: new Array(64).fill(0),
         contentShowable: [],
         show: this.show
      };
      this.history = [];
      this.show = new Set();
      for (let i = 0; i < 8; i++) {
         this.show.add(i);
      }
      this.addInterval = this.addInterval.bind(this);
      this.removeInterval = this.removeInterval.bind(this);

      window.state[this.props.title] = (data) => {
         let newState = {
            content: data.content.slice(),
            contentShowable: []
         };
         this.show.forEach(e => {
            newState.contentShowable.push({ index: e, value: data.content[e] });
         });
         // Set a limit for history
         if (!(this.history.length < this.historyLength)) {
            this.history.shift();
         }
         this.history.push(newState.contentShowable);

         this.setState(newState);
      };
   }

   addInterval() {
      // let setToAdd = this.parseInterval();
      console.log('Show before remove', this.show);
      let setToAdd = new Set();
      setToAdd.add(10);
      setToAdd.add(15);
      setToAdd.forEach(e => this.show.add(e));
      console.log('Show after remove', this.show);
      let newState = { contentShowable: [], show: this.show };
      this.show.forEach(e => {
         newState.contentShowable.push({ index: e, value: this.state.content[e] });
      });
      this.setState(newState);
   }

   parseInterval(): Set<number> {
      let newInterval = new Set<number>();
      let cadena = prompt('Seleccione un nuevo intervalo');
      while (cadena.length !== 0) {
         let posComa = cadena.indexOf(',');
         posComa = (posComa === -1) ? cadena.length : 1;
         let posGuion = cadena.substr(0, posComa).indexOf('-');
         if (posGuion === -1) {
            let num = +cadena.substr(0, posComa);
            if (num < this.maxElem) {
               this.show.add(num);
            }
         } else {
            let num1 = +cadena.substr(0, posGuion - 1);
            let num2 = +cadena.substr(posGuion + 1, posComa - posGuion - 1);
            if (num1 >= this.maxElem) {
               num1 = this.maxElem - 1;
            }
            if (num2 >= this.maxElem) {
               num2 = this.maxElem - 1;
            }
            if (num1 < num2) {
               for (; num1 <= num2; num1++) {
                  this.show.add(num1);
               }
            } else {
               for (; num2 <= num1; num2++) {
                  this.show.add(num2);
               }
            }
         }
         cadena = cadena.substr(posComa + 1, cadena.length - posComa);
      }
      return newInterval;
   }

   removeInterval() {
      // let setToRemove = Object.assign(new Set(), this.parseInterval());
      let setToRemove = new Set();
      setToRemove.add(10);
      setToRemove.add(15);
      console.log('Show before remove', this.show);
      setToRemove.forEach(e => {
         if (this.show.has(e)) {
            this.show.delete(e);
         }
      });
      console.log('Show after remove', this.show);
      let newState = { contentShowable: [], show: this.show };
      this.show.forEach(e => {
         newState.contentShowable.push({ index: e, value: this.state.content[e] });
      });
      this.setState(newState);
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
                           <td width='40%' key={`${this.state.title + i + 65}`}>{row.index}</td>
                           <td width='60%' key={`${this.state.title + i + 131}`}>{row.value}</td>
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
