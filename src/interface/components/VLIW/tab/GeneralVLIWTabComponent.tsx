import * as React from 'react';

import FunctionalUnitComponent from '../FunctionalUnitComponent';
import CodeComponent from '../CodeComponent';

import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { superescalarLoad } from '../../../actions';

import { TableComponent } from '../TableComponent';
import RegisterComponent from '../../Superescalar/RegisterComponent';
import {PREDICATE_SIZE} from '../../../reducers/machine';

import VLIWIntegration from '../../../../integration/vliw-integration';


class GeneralVLIWTabComponent extends React.Component<any, any> {
    constructor(props: any, state: any) {
        super(props);
    }

    render() {
        return (
            <div className="smd-general_tab">
                <div className="smd-general_tab-code">
                    <CodeComponent
                        code={this.props.code}
                        toggleBreakPoint={this.props.actions.superescalarLoad}
                        colorBasicBlocks={this.props.colorBasicBlocks}
                    />
                </div>
                <div className="smd-general_tab-simulation">
                    <div className="smd-general_tab-simulation_left--expanded">
                        <div className="smd-general_tab-simulation_planificator">
                            <TableComponent
                                title="Instrucciones VLIW"
                                header={this.props.vliwExecutionHeaderTable}
                                data={this.props.vliwExecutionTable}
                                onDropInstruction={VLIWIntegration.setOperation}
                            />
                        </div>  
                        <div className="smd-general_tab-simulation_nat_predicate">
                                {/* TODO: i18n this */}
                                <RegisterComponent 
                                    title='Predicado'
                                    data={this.props.predicate.data}
                                    visibleRange={this.props.predicate.visibleRangeValues} 
                                    addInterval={this.props.actions.addPredicateInterval}
                                    removeInterval={this.props.actions.removePredicateInterval}
                                    max={PREDICATE_SIZE}
                                />
                                <RegisterComponent 
                                    title='NaTGPR'
                                    data={this.props.natGpr.data}
                                    visibleRange={this.props.natGpr.visibleRangeValues} 
                                    addInterval={this.props.actions.addNatGprInterval}
                                    removeInterval={this.props.actions.removeNatGprInterval}
                                    max={PREDICATE_SIZE}
                                />
                                <RegisterComponent 
                                    title='NaTFPR'
                                    data={this.props.natFpr.data}
                                    visibleRange={this.props.natFpr.visibleRangeValues} 
                                    addInterval={this.props.actions.addNatFprInterval}
                                    removeInterval={this.props.actions.removeNatFprInterval}
                                    max={PREDICATE_SIZE}
                                />
                            </div>
                    </div>
                    <div className="smd-general_tab-simulation_right">
                        <div className="panel panel-default inside-bar panel--stack">
                            <div className="panel-heading">{this.props.t('UF')}</div>
                            <div className="panel-body">
                                <FunctionalUnitComponent
                                    title="+Entera"
                                    header={
                                        this.props.functionalUnitIntAdd.header
                                    }
                                    content={
                                        this.props.functionalUnitIntAdd.content
                                    }
                                />
                                <FunctionalUnitComponent
                                    title="xEntera"
                                    header={
                                        this.props.functionalUnitIntSub.header
                                    }
                                    content={
                                        this.props.functionalUnitIntSub.content
                                    }
                                />
                                <FunctionalUnitComponent
                                    title="+Flotante"
                                    header={
                                        this.props.functionalUnitFloAdd.header
                                    }
                                    content={
                                        this.props.functionalUnitFloAdd.content
                                    }
                                />
                                <FunctionalUnitComponent
                                    title="xFlotante"
                                    header={
                                        this.props.functionalUnitFloSub.header
                                    }
                                    content={
                                        this.props.functionalUnitFloSub.content
                                    }
                                />
                                <FunctionalUnitComponent
                                    title="Mem"
                                    header={
                                        this.props.functionalUnitMemory.header
                                    }
                                    content={
                                        this.props.functionalUnitMemory.content
                                    }
                                />
                                <FunctionalUnitComponent
                                    title="JumpUF"
                                    header={
                                        this.props.functionalUnitJump.header
                                    }
                                    content={
                                        this.props.functionalUnitJump.content
                                    }
                                />
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
        prefetchUnit: state.Machine.prefetchUnit,
        functionalUnitIntAdd: state.Machine.functionalUnitIntAdd,
        functionalUnitIntSub: state.Machine.functionalUnitIntSub,
        functionalUnitFloAdd: state.Machine.functionalUnitFloAdd,
        functionalUnitFloSub: state.Machine.functionalUnitFloSub,
        functionalUnitMemory: state.Machine.functionalUnitMemory,
        functionalUnitJump: state.Machine.functionalUnitJump,
        natFpr: state.Machine.natFpr,
        natGpr: state.Machine.natGpr, 
        predicate: state.Machine.predicate,
        code: state.Machine.code,
        colorBasicBlocks: state.Machine.colorBasicBlocks,
        vliwExecutionTable: state.Machine.vliwExecutionTable,
        vliwExecutionHeaderTable: state.Machine.vliwExecutionHeaderTable
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                superescalarLoad,
            },
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(GeneralVLIWTabComponent));
