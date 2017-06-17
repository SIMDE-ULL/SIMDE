import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { translate } from 'react-i18next';
import { t } from 'i18next';

import './FunctionalUnitComponent.scss';
declare var window: any;

export class FunctionalUnitComponent extends BaseComponent {

   constructor(props: any) {
      super(props);
   }

   buildShowableContent(data): any {
      let toReturnObject = {
         showableContent: [],
         showableHeader: []
      };
      let showableContent = new Array();
      if (data != null && data[0] != null) {
         for (let i = 0; i < data[0].flow.length; i++) {
            let aux = [];
            for (let j = 0; j < data.length; j++) {
               if (((data[j]).flow[i]) != null) {
                  aux.push((data[j]).flow[i].id);
               } else {
                  aux.push(' ');
               }
            }
            showableContent.push(aux);
         }
      }
      toReturnObject.showableContent = showableContent;
      toReturnObject.showableHeader = this.buildShowableHeader(data);
      return toReturnObject;
   }

   buildShowableHeader(data): string[] {
      let toReturn = [];
      if (data != null) {
         for (let i = 0; i < data.length; i++) {
            toReturn.push(`#${i}`);
         }
      }
      return toReturn;
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{t(this.props.title)}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  {<thead>
                     <tr>
                        {this.state.showableHeader.map((element, i) =>
                           <th key={this.props.title + 'FUTitle' + i}>{element}</th>)}
                     </tr>
                  </thead>}
                  <tbody>
                     {
                        this.state.showableContent.map((element, i) =>
                           <tr key={this.props.title + 'FU' + i}>
                              {element.map((content, j) =>
                                 <td key={this.props.title + 'FU' + i + j}>{content}</td>
                              )}
                           </tr>
                        )
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}

export default translate('common', { wait: true })(FunctionalUnitComponent);