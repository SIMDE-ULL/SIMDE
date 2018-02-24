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

import { connect } from 'react-redux'

class GeneralTabComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (<div id='home' className='tab-pane fade in active'>
            <div className='row'>
                <div className='col-sm-3' id='code-zone'>
                    <div className='row'>
                        <CodeComponent code={this.props.code}/>
                    </div>
                </div>
                <div className='col-sm-9' id='simulation-zone'>
                    <div className='row'>
                        <div className='col-sm-5'>
                            <div className='row'>
                                <div className='col-sm-6'>
                                    <div className='row'>
                                        <PrefetchDecoderComponent data={this.props.prefetchUnit} title='Prefetch' />
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='row'>
                                        <PrefetchDecoderComponent data={this.props.decoder} title='Decoder' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <div className='row register-mapper'>
                                        <ROBMapperComponent title='ROB<->GPR' data={this.props.ROBGpr.content} />
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='row register-mapper'>
                                        <ROBMapperComponent title='ROB<->FPR' data={this.props.ROBFpr.content} />
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='row register-mapper'>
                                        <JumpPredictionComponent jumpPrediction={this.props.jumpPrediction} title='Jump table' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <ReorderBufferComponent title='ReorderBuffer' content={this.props.reorderBuffer} />
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <div className='row'>
                                        <div className='panel panel-default inside-bar' id='reserve-station-zone'>
                                            <div className='panel-heading'>{t('Reserve Stations')}</div>
                                            <div className='panel-body'>
                                                <ReserveStationComponent title='Integer +' data={this.props.reserveStationIntAdd}/>
                                                <ReserveStationComponent title='Integer x' data={this.props.reserveStationIntSub}/>
                                                <ReserveStationComponent title='Floating +' data={this.props.reserveStationFloAdd}/>
                                                <ReserveStationComponent title='Floating x' data={this.props.reserveStationFloSub}/>
                                                <ReserveStationComponent title='Memory' data={this.props.reserveStationMemory}/>
                                                <ReserveStationComponent title='Jump' data={this.props.reserveStationJump}/>
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
                                                <FunctionalUnitComponent title='+Entera' header={this.props.functionalUnitIntAdd.header} content={this.props.functionalUnitIntAdd.content} />
                                                <FunctionalUnitComponent title='xEntera' header={this.props.functionalUnitIntSub.header} content={this.props.functionalUnitIntSub.content} />
                                                <FunctionalUnitComponent title='+Flotante' header={this.props.functionalUnitFloAdd.header} content={this.props.functionalUnitFloAdd.content} />
                                                <FunctionalUnitComponent title='xFlotante' header={this.props.functionalUnitFloSub.header} content={this.props.functionalUnitFloSub.content} />
                                                <FunctionalUnitComponent title='Mem' header={this.props.functionalUnitMemory.header} content={this.props.functionalUnitMemory.content} />
                                                <FunctionalUnitComponent title='JumpUF' header={this.props.functionalUnitJump.header} content={this.props.functionalUnitJump.content} />
                                                <FunctionalUnitComponent title='AluMem' header={this.props.functionalUnitAluMem.header} content={this.props.functionalUnitAluMem.content} />
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

const mapStateToProps = state => {
    return {
        prefetchUnit: state.prefetchUnit,
        decoder: state.decoder,
        jumpPrediction: state.jumpPrediction,
        functionalUnitIntAdd: state.functionalUnitIntAdd,
        functionalUnitIntSub: state.functionalUnitIntSub,
        functionalUnitFloAdd: state.functionalUnitFloAdd,
        functionalUnitFloSub: state.functionalUnitFloSub,
        functionalUnitMemory: state.functionalUnitMemory,
        functionalUnitJump: state.functionalUnitJump,
        functionalUnitAluMem: state.functionalUnitAluMem,
        reserveStationIntAdd: state.reserveStationIntAdd,
        reserveStationIntSub: state.reserveStationIntSub,
        reserveStationFloAdd: state.reserveStationFloAdd,
        reserveStationFloSub: state.reserveStationFloSub,
        reserveStationMemory: state.reserveStationMemory,
        reserveStationJump: state.reserveStationJump,
        ROBGpr: state.ROBGpr,
        ROBFpr: state.ROBFpr,
        reorderBuffer: state.reorderBuffer,
        code: state.code
    }
}

export default translate('common')(connect(mapStateToProps)(GeneralTabComponent));
