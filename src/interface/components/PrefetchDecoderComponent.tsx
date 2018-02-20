import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { Queue } from '../../core/Collections/Queue';
import { connect } from 'react-redux'
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
                        this.props.prefetchUnit.map((element, i) =>
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

const mapStateToProps = state => {
      console.log(state);
      return {
        prefetchUnit: state.prefetchUnit
      }
}

export default translate('common', { wait: true })(connect(mapStateToProps)(PrefetchDecoderComponent));