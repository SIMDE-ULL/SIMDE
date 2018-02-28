import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { Queue } from '../../core/Collections/Queue';
import { translate } from 'react-i18next';
import { t } from 'i18next';

class PrefetchDecoderComponent extends React.Component<any, any> {

   history: any[];

   constructor(props: any) {
      super(props);
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
                        
                        this.props.data && this.props.data.map((element, i) =>
                           <tr key={this.props.title + 'row' + i}>
                              <td key={this.props.title + i}>{element != null ? element : `&nbsp;`}</td>
                           </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}


export default translate('common', { wait: true })(PrefetchDecoderComponent);