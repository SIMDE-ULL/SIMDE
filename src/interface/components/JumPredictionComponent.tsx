import * as React from 'react';
import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

export class JumpPredictionComponent extends React.Component<any, any> {

   history: any[];
   historyLength: 10;

   constructor(public props: any) {
      super(props);
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{t(this.props.title)}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.props.jumpPrediction.map((row, i) => <tr key={`${this.props.title + i}`}>
                           <td key={`${this.props.title + i + 65}`}>{i}</td>
                           <td key={`${this.props.title + i + 131}`}>{row}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}

export default translate('common', { wait: true })(JumpPredictionComponent);