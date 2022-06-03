import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import VliwIntegration from '../../../../integration/vliw-integration';

class VLIWAccessBarComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.stepForward = this.stepForward.bind(this);
        this.stepBack = this.stepBack.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
        this.state = {
            content: null,
            showableContent: null
        };
    }

    stepForward() {
        VliwIntegration.stepForward();
    }

    stepBack() {
        VliwIntegration.stepBack();
    }

    play() {
        VliwIntegration.play();
    }

    pause() {
        VliwIntegration.pause();
    }

    stop() {
        VliwIntegration.stop();
    }

    render() {
        return (
            <div className="smd-access_bar">
                <a onClick={this.play}>
                    <i className="fa fa-play" aria-hidden="true" />
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
        cycle: state.Machine.cycle
    };
};
export default connect(mapStateToProps)(withTranslation()(VLIWAccessBarComponent));
