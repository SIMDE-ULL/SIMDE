import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import SuperscalarIntegration from '../../../../integration/superscalar-integration';

class AccessBarComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.stepForward = this.stepForward.bind(this);
        this.stepBack = this.stepBack.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
        this.playSequential = this.playSequential.bind(this);
    }

    stepForward() {
        SuperscalarIntegration.stepForward();
    }

    stepBack() {
        SuperscalarIntegration.stepBack();
    }

    play() {
        SuperscalarIntegration.play();
    }

    playSequential() {
        SuperscalarIntegration.playSequential();
    }

    pause() {
        SuperscalarIntegration.pause();
    }

    stop() {
        SuperscalarIntegration.stop();
    }

    render() {
        return (
            <div className="smd-access_bar">
                <a onClick={this.play}>
                    <i className="fa fa-play" aria-hidden="true" />
                </a>
                <a onClick={this.playSequential}>
                    <i className="fa fa-list" aria-hidden="true" color=''  />
                </a>
                <a onClick={this.pause}>
                    <i className="fa fa-pause" aria-hidden="true" />
                </a>
                <a onClick={this.stop}>
                    <i className="fa fa-stop" aria-hidden="true" />
                </a>
                <a onClick={this.stepBack}>
                    <i className="fa fa-step-backward" aria-hidden="true" />
                </a>
                <a onClick={this.stepForward}>
                    <i className="fa fa-step-forward" aria-hidden="true" />
                </a>
                <div className="smd-cycle">
                    <label htmlFor="cycle" className="smd-cycle_label">
                        {this.props.t('accessBar.cycle')}
                    </label>
                    <span className="smd-cycle_value">{this.props.cycle}</span>
                    <label htmlFor="cycles sequential" className="smd-cycle_label_sequential">
                        {this.props.t('sequential')}
                    </label>
                    <span className="smd-cycle_value_seq">{this.props.sequentialCycles}</span>
                </div>
                <span className="smd-speed">
                    <label className="smd-speed_label" htmlFor="velocidad">
                        {this.props.t('accessBar.speed')}
                    </label>
                    <input
                        type="number"
                        id="velocidad"
                        className="smd-speed_value"
                        defaultValue={'5'}
                        min="0"
                        max="10"
                    />
                </span>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        cycle: state.Machine.cycle,
        sequentialCycles: SuperscalarIntegration.sequential.status.cycle,
    };
};
export default connect(mapStateToProps)(withTranslation()(AccessBarComponent));
