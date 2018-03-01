import * as React from 'react';
import { BaseRegisterComponent } from './BaseRegisterComponent';
import IntervalModalComponent from './modal/IntervalModalComponent';

declare var window: any;

export class ROBMapperComponent extends React.Component<any, any> {

    history: any[];
    historyLength = 10;
    maxElem = 64;
   show = new Set();
   open = false;

   constructor(props: any) {
      super(props);
        // this.state = {
        //     content: new Array(64).fill(0),
        //     showableContent: [],
        //     show: this.show,
        //     open: false,
        //     renderModal: false
        // };
        // Bind functions for not losing context
        // this.openWithAddInterval = this.openWithAddInterval.bind(this);
        // this.openWithRemoveInterval = this.openWithRemoveInterval.bind(this);
        // this.addInterval = this.addInterval.bind(this);
        // this.parseInterval = this.parseInterval.bind(this);
        // this.removeInterval = this.removeInterval.bind(this);
   }

    // openWithAddInterval() {
    //     this.setState({ open: true, onAccept: this.addInterval });
    // }

    // openWithRemoveInterval() {
    //     this.setState({ open: true, onAccept: this.removeInterval });
    // }

   render() {
      return (
            <div className='smd-rob_mapper panel panel-default'>
                {
                    // <IntervalModalComponent title={this.props.title} onAccept={this.state.onAccept} open={this.state.open} />
                }
                <div className='panel-heading'>{this.props.title}</div>
                <div className='smd-rob_mapper-body panel-body'>
                    <div className='smd-table'>
                            {
                                this.props.data && this.props.data.map((element, i) => <div className='smd-table_row' key={`${this.props.title + i}`}>
                                    <div className='smd-table_cell' key={`${this.props.title + i + 65}`}>{i}</div>
                                    <div className='smd-table_cell' key={`${this.props.title + i + 131}`}>{element}</div>
                                </div>)
                            }
                    </div>
                </div>
                <div className='panel-footer'>
                    {/* <button type='button' className='btn btn-xs' onClick={this.openWithAddInterval}><i className='fa fa-plus' aria-hidden='true'></i>
                    </button>
                    <button type='button' className='btn btn-xs' onClick={this.openWithRemoveInterval}><i className='fa fa-minus' aria-hidden='true'></i></button> */}
                </div>

            </div>
        );
   }
}
