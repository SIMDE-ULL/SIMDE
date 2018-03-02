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
import { bindActionCreators } from 'redux';
import { superescalarLoad } from '../../actions';
import { addRobFprInterval } from '../../actions/intervals-actions';

class GeneralTabComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="smd-general_tab">
                <div className="smd-general_tab-code">
                    <CodeComponent code={this.props.code} toggleBreakPoint={this.props.actions.superescalarLoad} colorBasicBlocks={this.props.colorBasicBlocks} />
                </div>
                <div className="smd-general_tab-simulation">
                    <div className='smd-general_tab-simulation_left'>
                        <div className="smd-general_tab-simulation_prefetch_decoder">
                            <div className='w-50'>
                                <PrefetchDecoderComponent data={this.props.prefetchUnit} title='Prefetch' />
                            </div>
                            <div className='w-50'>
                                <PrefetchDecoderComponent data={this.props.decoder} title='Decoder' />
                            </div>
                        </div>
                        <div className="smd-general_tab-simulation_mappers">
                            <div className='smd-general_tab-simulation_register_mapper'>
                                <ROBMapperComponent title='ROB<->GPR' data={this.props.ROBGpr.showableData} />
                            </div>
                            <div className='smd-general_tab-simulation_register_mapper'>
                                <ROBMapperComponent 
                                    title='ROB<->FPR'
                                    data={this.props.ROBFpr.data}
                                    showableData={this.props.ROBFpr.showableData}
                                    visible={this.props.visibleRangeValues} 
                                    addInterval={this.props.actions.addRobFprInterval}
                                    removeInterval={this.props.actions.removeRobFprInterval}
                                />
                            </div>
                            <div className='smd-general_tab-simulation_register_mapper'>
                                <JumpPredictionComponent title='Jump table' jumpPrediction={this.props.jumpPrediction} />
                            </div>
                        </div>
                        <div className="smd-general_tab-simulation_reorder_buffer">
                            <ReorderBufferComponent title='ReorderBuffer' content={this.props.reorderBuffer} />
                        </div>
                    </div>
                    <div className='smd-general_tab-simulation_center'>
                        <div className='panel panel-default inside-bar panel--stack'>
                            <div className='panel-heading'>{t('Reserve Stations')}</div>
                            <div className='panel-body'>
                                <ReserveStationComponent title='Integer +' data={this.props.reserveStationIntAdd} />
                                <ReserveStationComponent title='Integer x' data={this.props.reserveStationIntSub} />
                                <ReserveStationComponent title='Floating +' data={this.props.reserveStationFloAdd} />
                                <ReserveStationComponent title='Floating x' data={this.props.reserveStationFloSub} />
                                <ReserveStationComponent title='Memory' data={this.props.reserveStationMemory} />
                                <ReserveStationComponent title='Jump' data={this.props.reserveStationJump} />
                            </div>
                        </div>
                    </div>
                    <div className='smd-general_tab-simulation_right'>
                        <div className='panel panel-default inside-bar panel--stack'>
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
        );
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
        code: state.code,
        colorBasicBlocks: state.colorBasicBlocks
    }
}

const mapDispatchToProps = dispatch => {
    return { actions: bindActionCreators({superescalarLoad, addRobFprInterval}, dispatch)};
}

export default translate('common')(connect(mapStateToProps, mapDispatchToProps)(GeneralTabComponent));
