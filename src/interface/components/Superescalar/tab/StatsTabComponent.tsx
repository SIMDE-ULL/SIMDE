import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { EChart } from '@kbox-labs/react-echarts'

export class StatsTabComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <EChart
                            style={{
                                height: "25rem",
                                width: "100%",
                            }}
                            onClick={() => console.log('clicked!')}
                            xAxis={{
                                type: 'category'
                            }}
                            yAxis={{
                                type: 'value',
                                boundaryGap: [0, '30%']
                            }}
                            series={[
                                {
                                    type: 'line',
                                    data: [
                                        ['2022-10-17', 300],
                                        ['2022-10-18', 100]
                                    ]
                                }
                            ]}
                        />
                    </div>
                    <div className="col">
                        <EChart
                            style={{
                                height: "25rem",
                                width: "100%",
                            }}
                            onClick={() => console.log('clicked!')}
                            xAxis={{
                                type: 'category',
                                data: ['Prefetch', 'Decode', 'Issue', 'Execute', 'WriteBack']
                            }}
                            yAxis={{
                                type: 'category',
                                data: ['#1', '#2', '#3', '#4', '#5']
                            }}
                            visualMap={
                                {
                                    min: 0,
                                    max: 5,
                                    calculable: true,
                                    orient: 'horizontal',
                                    left: 'center',
                                    bottom: '15%'
                                }
                            }
                            series={[
                                {
                                    type: 'heatmap',
                                    data: [
                                        [0, 0, 3],
                                        [1, 0, 1]
                                    ]
                                }
                            ]}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <EChart
                            style={{
                                height: "10rem",
                                width: "100%",
                            }}
                            onClick={() => console.log('clicked!')}
                            series={[
                                {
                                    type: 'pie',
                                    radius: '80%',
                                    label: {
                                        formatter: '{b}: {c} ({d}%)'
                                    },
                                    data: [
                                        { value: 335, name: 'Commited' },
                                        { value: 50, name: 'Discarded' },
                                    ]
                                }
                            ]}
                        />
                    </div>
                    <div className="col">
                        2 of 3
                    </div>
                    <div className="col">
                        3 of 3
                    </div>
                </div>
            </div>

        );
    };
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({

        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsTabComponent);