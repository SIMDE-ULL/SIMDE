import * as React from 'react';
import { Queue } from '../core/collections/Queue';

declare var window: any;

export abstract class BaseComponent extends React.Component<any, any> {

   history: any[];

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         showableContent: []
      };
      this.history = new Array();
      window.state[this.props.title] = (data: { content: any, step: number }) => {
         let newState = {
            showableContent: []
         };
         if (data.step) {
            console.log('Time for...', this.history.length - data.step);
            newState.showableContent = this.history[this.history.length - data.step].content;
         } else {
            newState.showableContent = this.buildShowableContent(data.content);
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

   abstract buildShowableContent(data: any, size?: any): any;
}
