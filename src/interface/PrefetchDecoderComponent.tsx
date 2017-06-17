import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { Queue } from '../core/collections/Queue';

import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class PrefetchDecoderComponent extends BaseComponent {

   history: any[];

   constructor(props: any) {
      super(props);
   }

   buildShowableContent(data: Queue<any>) {
      let toReturnObject = {
         showableContent: []
      };
      let toReturn = new Array(data.elements.length - 1);
      toReturn.fill(' ');
      for (let i = data.first, j = 0; i !== data.last; i = data.nextIterator(i), j++) {
         toReturn[j] = ((data.getElement(i) != null) ? data.getElement(i).instruction.id : '0');
      }
      toReturnObject.showableContent = toReturn;
      return toReturnObject;
   }


   render() {
      return (
         <div className='panel panel-default prefetch-decoder-zone'>
            <div className='panel-heading'>
               {t(this.props.title)}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.state.showableContent.map((element, i) =>
                           <tr key={this.props.title + 'row' + i}>
                              <td key={this.props.title + i}>{element}</td>
                           </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}

export default translate('common', { wait: true })(PrefetchDecoderComponent);