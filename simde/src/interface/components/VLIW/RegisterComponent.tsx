import * as React from 'react';
import IntervalModalComponent from './modal/IntervalModalComponent';

import { withTranslation } from 'react-i18next';

class RegisterComponent extends React.Component<any, any> {

      constructor(props: any) {
            super(props);
            this.state = {
                isAddModalOpen: false,
                isRemoveModalOpen: false
            }
            // Bind functions for not losing context
            this.openWithAddInterval = this.openWithAddInterval.bind(this);
            this.openWithRemoveInterval = this.openWithRemoveInterval.bind(this);
            this.closeAddInterval = this.closeAddInterval.bind(this);
            this.closeRemoveInterval = this.closeRemoveInterval.bind(this);
      }

      openWithAddInterval() {
            this.setState({ ...this.state, isAddModalOpen: true});
      }

      openWithRemoveInterval() {
            this.setState({ ...this.state, isRemoveModalOpen: true});
      }

      closeAddInterval() {
            this.setState({ ...this.state, isAddModalOpen: false });
      }

      closeRemoveInterval() {
            this.setState({ ...this.state, isRemoveModalOpen: false });
      }

      render() {
          const renderCondition = this.props.visibleRange && this.props.data &&
              this.props.data.length > 0;

            return (
                  <div className='smd-register'>
                        {
                              <IntervalModalComponent
                              title={this.props.title}
                              onAccept={this.props.addInterval}
                              max={this.props.max}
                              open={this.state.isAddModalOpen}
                              close={this.closeAddInterval}
                              />
                        }
                        {
                              <IntervalModalComponent 
                              title={this.props.title}
                              onAccept={this.props.removeInterval}
                              max={this.props.max}
                              open={this.state.isRemoveModalOpen}
                              close={this.closeRemoveInterval}
                              />
                        }
                        <div className='panel panel-default'>
                              <div className='panel-heading'>{this.props.t(this.props.title)}</div>
                              <div className='panel-body'>
                                    <div className='smd-table'>
                                    {
                                          renderCondition && this.props.visibleRange.map(index => 
                                          <div className='smd-table_row' key={`${this.props.title + index}`}>
                                                <div className='smd-table_cell' key={`${this.props.title + index + 65}`}>{index}</div>
                                                <div className='smd-table_cell' key={`${this.props.title + index + 131}`}>{this.props.data[index]}</div>
                                          </div>)
                                    }
                                    </div>
                              </div>
                              <div className='panel-footer'>
                              <button type='button' className='btn smd-register_button' onClick={this.openWithAddInterval}>
                                    <i className='fa fa-plus' aria-hidden='true'></i>
                              </button>
                              <button type='button' className='btn smd-register_button' onClick={this.openWithRemoveInterval}>
                                    <i className='fa fa-minus' aria-hidden='true'></i>
                              </button>
                              {
                                    /* 
                                    <button type='button' className='btn smd-register_button'><i className='fa fa-check' aria-hidden='true'></i></button>
                                    <button type='button' className='btn smd-register_button'><i className='fa fa-times' aria-hidden='true'></i></button>
                                    <button type='button' className='btn smd-register_button'><i className='fa fa-repeat' aria-hidden='true'></i></button>
                                    */
                              }
                              </div>
                        </div>
                  </div>);
      }
}

export default withTranslation()(RegisterComponent);
