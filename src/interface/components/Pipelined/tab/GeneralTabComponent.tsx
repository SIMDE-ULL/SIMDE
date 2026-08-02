import * as React from 'react';

import FunctionalUnitComponent from '../FunctionalUnitComponent';
import PrefetchDecoderComponent from '../PrefetchDecoderComponent';
import CodeComponent from '../CodeComponent';
import ReserveStationComponent from '../ReserveStationComponent';
import { ROBMapperComponent } from '../ROBMapperComponent';
import ReorderBufferComponent from '../ReorderBufferComponent';
import JumpPredictionComponent from '../JumpPredictionComponent';

import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { superscalarLoad } from '../../../actions';

class GeneralTabComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="smd-general_tab">
                <div className="smd-general_tab-code">
                    <CodeComponent
                        code={this.props.code}
                        toggleBreakPoint={this.props.actions.superscalarLoad}
                        colorBasicBlocks={this.props.colorBasicBlocks}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        prefetchUnit: state.Machine.prefetchUnit,
        decoder: state.Machine.decoder,
        jumpPrediction: state.Machine.jumpPrediction,
        functionalUnitIntAdd: state.Machine.functionalUnitIntAdd,
        functionalUnitIntSub: state.Machine.functionalUnitIntSub,
        functionalUnitFloAdd: state.Machine.functionalUnitFloAdd,
        functionalUnitFloSub: state.Machine.functionalUnitFloSub,
        functionalUnitMemory: state.Machine.functionalUnitMemory,
        functionalUnitJump: state.Machine.functionalUnitJump,
        functionalUnitAluMem: state.Machine.functionalUnitAluMem,
        reserveStationIntAdd: state.Machine.reserveStationIntAdd,
        reserveStationIntSub: state.Machine.reserveStationIntSub,
        reserveStationFloAdd: state.Machine.reserveStationFloAdd,
        reserveStationFloSub: state.Machine.reserveStationFloSub,
        reserveStationMemory: state.Machine.reserveStationMemory,
        reserveStationJump: state.Machine.reserveStationJump,
        ROBGpr: state.Machine.ROBGpr,
        ROBFpr: state.Machine.ROBFpr,
        reorderBuffer: state.Machine.reorderBuffer,
        code: state.Machine.code,
        colors: state.Colors,
        colorBasicBlocks: state.Machine.colorBasicBlocks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                superscalarLoad: superscalarLoad,
            },
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(GeneralTabComponent));
