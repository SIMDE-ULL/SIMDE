import * as React from "react";
import IntervalModalComponent from "./modal/IntervalModalComponent";
import { MACHINE_REGISTER_SIZE } from '../../../core/Constants';

export class ROBMapperComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
        isAddModalOpen: false,
        isRemoveModalOpen: false
    };
    // Bind functions for not losing context
    this.openWithAddInterval = this.openWithAddInterval.bind(this);
    this.openWithRemoveInterval = this.openWithRemoveInterval.bind(this);
    this.closeAddInterval = this.closeAddInterval.bind(this);
    this.closeRemoveInterval = this.closeRemoveInterval.bind(this);
  }

    openWithAddInterval() {
        this.setState({ ...this.state, isAddModalOpen: true });
    }

    openWithRemoveInterval() {
        this.setState({ ...this.state, isRemoveModalOpen: true });
    }

    closeAddInterval() {
        this.setState({ ...this.state, isAddModalOpen: false });
    }

    closeRemoveInterval() {
        this.setState({ ...this.state, isRemoveModalOpen: false });
    }

  render() {
    const renderCondition =
      this.props.visibleRange && this.props.data && this.props.data.length > 0;
    return (
      <div className="smd-rob_mapper panel panel-default">
        {
          <IntervalModalComponent
            title={this.props.title}
            onAccept={this.props.addInterval}
            max={MACHINE_REGISTER_SIZE}
            open={this.state.isAddModalOpen}
            close={this.closeAddInterval}
          />
        }
        {
          <IntervalModalComponent
            title={this.props.title}
            onAccept={this.props.removeInterval}
            max={MACHINE_REGISTER_SIZE}
            open={this.state.isRemoveModalOpen}
            close={this.closeRemoveInterval}
          />
        }
        <div className="panel-heading">{this.props.title}</div>
        <div className="smd-rob_mapper-body panel-body">
          <div className="smd-table">
            {renderCondition &&
              this.props.visibleRange.map(index => (
                <div
                  className="smd-table_row"
                  key={`${this.props.title + index}`}
                >
                  <div
                    className="smd-table_cell"
                    key={`${this.props.title + index + 65}`}
                  >
                    {index}
                  </div>
                  <div
                    className="smd-table_cell"
                    key={`${this.props.title + index + 131}`}
                  >
                    {this.props.data[index]}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="panel-footer">
          <button
            type="button"
            className="btn smd-register_button"
            onClick={this.openWithAddInterval}
          >
            <i className="fa fa-plus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn smd-register_button"
            onClick={this.openWithRemoveInterval}
          >
            <i className="fa fa-minus" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
}
