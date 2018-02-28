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
         <div className='smd-jump_prediction panel panel-default'>
            <div className='panel-heading'>{t(this.props.title)}</div>
                  <div className='smd-jump_prediction-body panel-body'>
                        <div className='smd-table'>
                        {
                              this.props.jumpPrediction.map((row, i) => 
                              <div className="smd-table_row" key={`${this.props.title + i}`}>
                                    <div className="smd-table_cell" key={`${this.props.title + i + 65}`}>{i}</div>
                                    <div className="smd-table_cell" key={`${this.props.title + i + 131}`}>{row}</div>
                              </div>)
                        }
                        </div>
                  </div>
         </div>);
   }
}

export default translate('common', { wait: true })(JumpPredictionComponent);