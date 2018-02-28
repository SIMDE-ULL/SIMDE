import * as React from "react";
import { translate } from "react-i18next";
import { t } from "i18next";
import { connect } from "react-redux";

declare var window: any;

class AccessBarComponent extends React.Component<any, any> {
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

    // window.state['cycle'] = (data) => {
    //     if (data.step) {
    //         if (data.step === -1) {
    //             this.setState({ content: 0, showableContent: 0 });
    //         } else {
    //             this.setState({ showableContent: this.state.content - data.step });
    //         }
    //     } else {
    //         this.setState({ content: data.content, showableContent: data.content });
    //     }
    // };
  }

  stepForward() {
    window.superStep();
  }

  stepBack() {
    window.stepBack();
  }

  play() {
    window.play();
  }

  pause() {
    window.pause();
  }

  stop() {
    window.stop();
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
            <a>
              <label htmlFor="cycle">{t("accessBar.cycle")}</label>
              <span className="cycle">{this.props.cycle}</span>
            </a>
            <a>
              <label htmlFor="velocidad">{t("accessBar.speed")}</label>
              <input
                type="number"
                id="velocidad"
                className="speed"
                defaultValue={"5"}
                min="0"
                max="10"
              />
            </a>
        {/* <ul className='nav nav-tabs'>
                    <li className='active'><a data-toggle='tab' href='#home'>{t('accessBar.superescalar')}</a></li>
                    <li><a data-toggle='tab' href='#menu1'>{t('accessBar.memReg')}</a></li>
                </ul> */}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    cycle: state.cycle
  };
};
export default translate("common", { wait: true })(
  connect(mapStateToProps)(AccessBarComponent)
);
