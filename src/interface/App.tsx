import * as React from 'react';
import { CodeComponent } from './CodeComponent';
import { RegisterComponent } from './RegisterComponent';
import { ReserveStationComponent } from './ReserveStationComponent';
import { FileBarComponent } from './FileBarComponent';
import { AccessBarComponent } from './AccessBarComponent';
import { Superescalar } from '../core/Superescalar';
import { FunctionalUnitComponent } from './FunctionalUnitComponent';

class App extends React.Component<any, any> {

   constructor(props: Superescalar) {
      super(props);
   }

   render() {
      return (
         <div className='App'>
            <div className='container-fluid'>
               <FileBarComponent />
               <AccessBarComponent />
               <div className='tab-content'>
                  <div id='home' className='tab-pane fade in active'>
                     <div className='row'>
                        <div className='col-sm-3' id='code-zone'>
                           <CodeComponent content={this.props.machine.code} />
                        </div>
                        <div className='col-sm-9' id='simulation-zone'>
                           <div className='row'>
                              <div className='col-sm-5'>
                                 <div className='row'>
                                    <div className='col-sm-6'>
                                       {/* prefetch */}
                                    </div>
                                    <div className='col-sm-6'>
                                       <div className='row'>
                                          <div className='col-sm-4'>
                                             <div className='row'>
                                                {/* register mapper*/}
                                             </div>
                                          </div>
                                          <div className='col-sm-4'>
                                             <div className='row'>
                                                {/* register mapper*/}
                                             </div>
                                          </div>
                                          <div className='col-sm-4'>
                                             <div className='row'>
                                                {/* register mapper*/}
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className='row'>
                                    <div className='col-sm-12'>
                                       {/* reorder buffer*/}
                                    </div>
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
                                                      {/* Reserve stations */}
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
                                                   { /* Functional Units */}
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
                  </div>
                  <div id='menu1' className='tab-pane fade'>
                     <div className='row'>
                        <div className='col-sm-4'>
                           <div className='panel panel-default register'>
                              <div className='panel-heading'>Memoria</div>
                              <div className='panel-body'>
                                 <table className='table table-bordered'>
                                    <tr>
                                       <td>0</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>1</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>2</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>3</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>4</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>5</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>6</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                 </table>
                              </div>
                              <div className='panel-footer'>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-plus' aria-hidden='true'></i>
                                 </button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-minus' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-check' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-times' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-repeat' aria-hidden='true'></i></button>
                              </div>
                           </div>
                        </div>
                        <div className='col-sm-4'>
                           <div className='panel panel-default register'>
                              <div className='panel-heading'>Registros Generales</div>
                              <div className='panel-body'>
                                 <table className='table table-bordered'>
                                    <tr>
                                       <td>R0</td>
                                       <td>0</td>
                                    </tr>
                                    <tr>
                                       <td>R1</td>
                                       <td>0</td>
                                    </tr>
                                    <tr>
                                       <td>R2</td>
                                       <td>0</td>
                                    </tr>
                                    <tr>
                                       <td>R3</td>
                                       <td>0</td>
                                    </tr>
                                    <tr>
                                       <td>R4</td>
                                       <td>0</td>
                                    </tr>
                                    <tr>
                                       <td>R5</td>
                                       <td>0</td>
                                    </tr>
                                    <tr>
                                       <td>R6</td>
                                       <td>0</td>
                                    </tr>

                                 </table>
                              </div>
                              <div className='panel-footer'>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-plus' aria-hidden='true'></i>
                                 </button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-minus' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-check' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-times' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-repeat' aria-hidden='true'></i></button>
                              </div>
                           </div>
                        </div>
                        <div className='col-sm-4'>
                           <div className='panel panel-default register'>
                              <div className='panel-heading'>Registros de punto flotante</div>
                              <div className='panel-body'>
                                 <table className='table table-bordered'>
                                    <tr>
                                       <td>F0</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>F1</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>F2</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>F3</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>F4</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>F5</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                    <tr>
                                       <td>F6</td>
                                       <td>0,00000000000</td>
                                    </tr>
                                 </table>
                              </div>
                              <div className='panel-footer'>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-plus' aria-hidden='true'></i>
                                 </button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-minus' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-check' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-times' aria-hidden='true'></i></button>
                                 <button type='button' className='btn btn-xs'><i className='fa fa-repeat' aria-hidden='true'></i></button>
                              </div>
                           </div >
                        </div >
                     </div >
                  </div >


               </div >


            </div >
         </div >
      );
   }
}

export default App;
