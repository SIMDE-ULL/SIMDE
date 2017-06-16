import * as React from 'react';
import { Queue } from '../core/collections/Queue';

declare var window: any;

export abstract class BaseRegisterComponent extends React.Component<any, any> {

   history: any[];
   show = new Set();
   maxElem = 64;

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };
      if (this.props.title === 'Memoria') {
         this.maxElem = 1024;
      }
      this.history = new Array();
      window.state[this.props.title] = (data: { content: any, step: number }) => {
         let newState = {
            content: data.content,
            showableContent: []
         };
         for (let i = 0; i < 8; i++) {
            this.show.add(i);
         }
         if (data.step) {
            newState.showableContent = this.history[data.step].content;
         } else {
            newState = this.buildShowableContent(data.content);
            if (this.history.length < 10) {
               this.history.push(Object.assign({}, { content: newState.showableContent }));
            } else {
               this.history.shift();
               this.history.push(Object.assign({}, { content: newState.showableContent }));
            }
         }
         this.setState(newState);
      };
   }

   buildShowableContent(data): any {
      let newState = { showableContent: [], show: this.show, open: false };
      this.show.forEach(e => {
         newState.showableContent.push({ index: e, value: data[e] });
      });
      return newState;
   }

   addInterval(toAdd: string) {
      if (toAdd) {
         let setToAdd = this.parseInterval(toAdd);
         setToAdd.forEach(e => this.show.add(e));
         this.show = new Set(Array.from(this.show).sort((a, b) => a - b));
         let newState = this.buildShowableContent(this.state.content);
         this.setState(newState);
      } else {
         this.setState({ open: false });
      }
   }

   parseInterval(toAdd: string): Set<number> {
      let newInterval = new Set<number>();
      let cadena = toAdd;
      cadena.split(',').map(e => {
         if (e.indexOf('-') !== -1) {
            let range = e.split('-');
            let num1 = +range[0];
            let num2 = +range[1];
            if (num1 >= this.maxElem) {
               num1 = this.maxElem - 1;
            }
            if (num2 >= this.maxElem) {
               num2 = this.maxElem - 1;
            }
            if (num1 < num2) {
               for (; num1 <= num2; num1++) {
                  newInterval.add(num1);
               }
            } else {
               for (; num2 <= num1; num2++) {
                  newInterval.add(num2);
               }
            }
         } else {
            let num = +e;
            if (num < this.maxElem) {
               newInterval.add(+e);
            }
         }
      });
      return newInterval;
   }

   removeInterval(toRemove: string) {
      if (toRemove) {
         let setToRemove = this.parseInterval(toRemove);
         setToRemove.forEach(e => {
            if (this.show.has(e)) {
               this.show.delete(e);
            }
         });
         this.show = new Set(Array.from(this.show).sort((a, b) => a - b));
         let newState = this.buildShowableContent(this.state.content);
         this.setState(newState);
      } else {
         this.setState({ open: false });
      }
   }
}
