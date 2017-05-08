import { FunctionalUnitComponent } from '../FunctionalUnitComponent';
import { PrefetchDecoderComponent } from '../PrefetchDecoderComponent';
import { CodeComponent } from '../CodeComponent';
import { ReserveStationComponent } from '../ReserveStationComponent';
import { RegisterMapperComponent } from '../RegisterMapperComponent';
import { ReorderBufferComponent } from '../ReorderBufferComponent';

import * as React from 'react';
declare var window: any;

export class GeneralTabComponent extends React.Component<any, any> {


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
                           <div className='row'>
                              <RegisterMapperComponent title='ROB<->GPR' />
                           </div>
                        </div>
                        <div className='col-sm-4'>
                           <div className='row'>
                              <RegisterMapperComponent title='ROB<->FPR' />
                           </div>
                        </div>
                        <div className='col-sm-4'>
                           <div className='row'>
                              <RegisterMapperComponent title='Jump' />
                           </div>
                        </div>
                     </div>
                     <div className='row'>
                        <ReorderBufferComponent />
                     </div>
                  </div>
                  <div className='col-sm-5'>
                     <div className='row'>
                        <div className='col-sm-12'>
                           <div className='row'>
                              <div className='panel panel-default inside-bar' id='reserve-station-zone'>
                                 <div className='panel-heading'>Reserve Stations</div>
                                 <div className='panel-body'>
                                    <div className='row'>
                                       <div className='panel panel-default'>
                                          <ReserveStationComponent title='Integer +' />
                                          <ReserveStationComponent title='Integer x' />
                                          <ReserveStationComponent title='Floating +' />
                                          <ReserveStationComponent title='Floating x' />
                                          <ReserveStationComponent title='Memoru' />
                                          <ReserveStationComponent title='Jump' />
                                       </div>
                                    </div>
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
                                 <div className='panel-heading'>U. F.</div>
                                 <div className='panel-body'>
                                    <div className='row'>
                                       <FunctionalUnitComponent title='+Entera' />
                                       <FunctionalUnitComponent title='xEntera' />
                                       <FunctionalUnitComponent title='+Flotante' />
                                       <FunctionalUnitComponent title='xFlotante' />
                                       <FunctionalUnitComponent title='Mem' />
                                       <FunctionalUnitComponent title='Jump' />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>)
   }
}