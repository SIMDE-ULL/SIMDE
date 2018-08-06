import * as React from 'react';

import FunctionalUnitComponent from '../FunctionalUnitComponent';
import CodeComponent from '../CodeComponent';

import { translate } from 'react-i18next';
import { t } from 'i18next';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { superescalarLoad } from '../../../actions';
import {
    addRobFprInterval,
    removeRobFprInterval,
    addRobGprInterval,
    removeRobGprInterval
} from '../../../actions/intervals-actions';
import { TableComponent } from '../TableComponent';
import RegisterComponent from '../../Superescalar/RegisterComponent';
import { PREDICATE_SIZE } from '../../../reducers';

class GeneralVLIWTabComponent extends React.Component<any, any> {
    constructor(props: any) {
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
                            />
                        </div>  
                        <div className="smd-general_tab-simulation_nat_predicate">
                                <RegisterComponent 
                                    title='Predicado'
                                    data={this.props.predicate.content}
                                    visibleRange={this.props.predicate.visibleRangeValues} 
                                    addInterval={this.props.actions.addPredicateInterval}
                                    removeInterval={this.props.actions.removePredicateInterval}
                                    max={PREDICATE_SIZE}
                                />
                                <RegisterComponent 
                                    title='NaTGPR'
                                    data={this.props.natGpr.content}
                                    visibleRange={this.props.natGpr.visibleRangeValues} 
                                    addInterval={this.props.actions.addNatGprInterval}
                                    removeInterval={this.props.actions.removeNatGprInterval}
                                    max={PREDICATE_SIZE}
                                />
                                <RegisterComponent 
                                    title='NaTFPR'
                                    data={this.props.natFpr.content}
                                    visibleRange={this.props.natFpr.visibleRangeValues} 
                                    addInterval={this.props.actions.addNatFprInterval}
                                    removeInterval={this.props.actions.removeNatFprInterval}
                                    max={PREDICATE_SIZE}
                                />
                            </div>
                    </div>
                    <div className="smd-general_tab-simulation_right">
                        <div className="panel panel-default inside-bar panel--stack">
                            <div className="panel-heading">{t('UF')}</div>
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
        prefetchUnit: state.prefetchUnit,
        functionalUnitIntAdd: state.functionalUnitIntAdd,
        functionalUnitIntSub: state.functionalUnitIntSub,
        functionalUnitFloAdd: state.functionalUnitFloAdd,
        functionalUnitFloSub: state.functionalUnitFloSub,
        functionalUnitMemory: state.functionalUnitMemory,
        functionalUnitJump: state.functionalUnitJump,
        natFpr: state.natFpr,
        natGpr: state.natGpr, 
        predicate: state.predicate,
        code: state.code,
        colorBasicBlocks: state.colorBasicBlocks
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

export default translate('common')(
    connect(mapStateToProps, mapDispatchToProps)(GeneralVLIWTabComponent)
);
