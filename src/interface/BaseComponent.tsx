import * as React from 'react';
import { Queue } from '../core/collections/Queue';

declare var window: any;

export class BaseComponent extends React.Component<any, any> {

   history: any[];

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };
      this.history = new Array();
      window.state[this.props.title] = (data: { content: Queue<any>, step: number }) => {
         let newState = {
            content: data.content,
            showableContent: []
         };
         if (data.step) {
            newState.showableContent = this.history[data.step].content;
         } else {
            newState.showableContent = this.buildShowableContent(data.content);
            if (this.history.length < 10) {
               this.history.push(Object.assign({}, { content: newState.showableContent }));
            } else {
               this.history.shift();
               this.history.push(Object.assign({}, newState.showableContent));
            }
         }
         this.setState(newState);
      };
   }

   buildShowableContent(data: Queue<any>): any { }
}
