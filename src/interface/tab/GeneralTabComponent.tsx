import * as React from 'react';

import FunctionalUnitComponent from '../FunctionalUnitComponent';
import PrefetchDecoderComponent from '../PrefetchDecoderComponent';
import CodeComponent from '../CodeComponent';
import ReserveStationComponent from '../ReserveStationComponent';
import { ROBMapperComponent } from '../ROBMapperComponent';
import ReorderBufferComponent from '../ReorderBufferComponent';
import JumpPredictionComponent from '../JumPredictionComponent';

import { translate } from 'react-i18next';
import { t } from 'i18next';

import './GeneralTabComponent.scss';
declare var window: any;

class GeneralTabComponent extends React.Component<any, any> {

   render() {
      return (<div id='home' className='tab-pane fade in active'>
         <div className='row'>
            <div className='col-sm-3' id='code-zone'>
               <div className='row'>
                  <CodeComponent />
               </div>
            </div>
            <div className='col-sm-9' id='simulation-zone'>
               <div className='row'>
                  <div className='col-sm-5'>
                     <div className='row'>
                        <div className='col-sm-6'>
                           <div className='row'>
                              <PrefetchDecoderComponent title='Prefetch' />
                           </div>
                        </div>
                        <div className='col-sm-6'>
                           <div className='row'>
                              <PrefetchDecoderComponent title='Decoder' />
                           </div>
                        </div>
                     </div>
                     <div className='row'>
                        <div className='col-sm-4'>
                           <div className='row register-mapper'>
                              <ROBMapperComponent title='ROB<->GPR' />
                           </div>
                        </div>
                        <div className='col-sm-4'>
                           <div className='row register-mapper'>
                              <ROBMapperComponent title='ROB<->FPR' />
                           </div>
                        </div>
                        <div className='col-sm-4'>
                           <div className='row register-mapper'>
                              <JumpPredictionComponent title='Jump table' />
                           </div>
                        </div>
                     </div>
                     <div className='row'>
                        <ReorderBufferComponent title='ReorderBuffer' />
                     </div>
                  </div>
                  <div className='col-sm-5'>
                     <div className='row'>
                        <div className='col-sm-12'>
                           <div className='row'>
                              <div className='panel panel-default inside-bar' id='reserve-station-zone'>
                                 <div className='panel-heading'>{t('Reserve Stations')}</div>
                                 <div className='panel-body'>
                                    <ReserveStationComponent title='Integer +' />
                                    <ReserveStationComponent title='Integer x' />
                                    <ReserveStationComponent title='Floating +' />
                                    <ReserveStationComponent title='Floating x' />
                                    <ReserveStationComponent title='Memory' />
                                    <ReserveStationComponent title='Jump' />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className='col-sm-2'>
                     <div className='row'>
                        <div className='col-sm-12'>
                           <div className='row'>
                              <div className='panel panel-default inside-bar' id='functional-unit-zone'>
                                 <div className='panel-heading'>{t('UF')}</div>
                                 <div className='panel-body'>
                                    <FunctionalUnitComponent title='+Entera' />
                                    <FunctionalUnitComponent title='xEntera' />
                                    <FunctionalUnitComponent title='+Flotante' />
                                    <FunctionalUnitComponent title='xFlotante' />
                                    <FunctionalUnitComponent title='Mem' />
                                    <FunctionalUnitComponent title='JumpUF' />
                                    <FunctionalUnitComponent title='AluMem' />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>);
   }
}

export default translate('common')(GeneralTabComponent);
