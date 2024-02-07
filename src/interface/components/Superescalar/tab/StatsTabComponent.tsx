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
                            title={{
                                text: 'Instructions statuses per cycle',
                                left: 'center'
                            }}
                            style={{
                                height: "25rem",
                                width: "100%",
                            }}
                            toolbox={{
                                feature: {
                                    saveAsImage: {},
                                    dataView: { readOnly: true, lang: ['Data View', 'Close', 'Refresh'] },
                                }
                            }}
                            tooltip={
                                {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross'
                                    }
                                }

                            }
                            xAxis={{
                                type: 'category'
                            }}
                            yAxis={{
                                type: 'value'
                            }}
                            series={[
                                {
                                    name: 'Prefetch',
                                    type: 'bar',
                                    stack: 'statuses',
                                    data: [5, 20, 36, 10, 10, 20]
                                },
                                {
                                    name: 'Decode',
                                    type: 'bar',
                                    stack: 'statuses',
                                    data: [15, 20, 26, 20, 20, 20]
                                },
                                {
                                    name: 'Issue',
                                    type: 'bar',
                                    stack: 'statuses',
                                    data: [25, 20, 16, 30, 30, 20]
                                },
                                {
                                    name: 'Execute',
                                    type: 'bar',
                                    stack: 'statuses',
                                    data: [35, 20, 6, 40, 40, 20]
                                },
                                {
                                    name: 'WriteBack',
                                    type: 'bar',
                                    stack: 'statuses',
                                    data: [45, 20, 6, 50, 50, 20]
                                },
                                {
                                    name: 'Commit',
                                    type: 'bar',
                                    stack: 'statuses',
                                    data: [45, 20, 6, 50, 50, 20]
                                },
                            ]}
                        />
                    </div>
                    <div className="col">
                        <EChart
                            title={{
                                text: 'Units ocupation per cycle',
                                left: 'center'
                            }}
                            style={{
                                height: "25rem",
                                width: "100%",
                            }}
                            toolbox={{
                                feature: {
                                    saveAsImage: {},
                                    dataView: { readOnly: true, lang: ['Data View', 'Close', 'Refresh'] },
                                }
                            }}
                            tooltip={
                                {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross'
                                    }
                                }

                            }
                            xAxis={{
                                type: 'category'
                            }}
                            yAxis={{
                                type: 'value',
                                max: 100,
                                axisLabel: {
                                    formatter: '{value}%'
                                }
                            }}
                            series={[
                                {
                                    name: 'Prefetch unit',
                                    type: 'line',
                                    data: [5, 20, 36, 10, 10, 20]
                                },
                                {
                                    name: 'Decoder',
                                    type: 'line',
                                    data: [15, 20, 26, 20, 20, 20]
                                },
                                {
                                    name: 'ROB',
                                    type: 'line',
                                    data: [25, 20, 16, 30, 30, 20]
                                }
                            ]}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <EChart
                            title={{
                                text: 'Commited vs Discarded instructions',
                                left: 'center'
                            }}
                            style={{
                                height: "13rem",
                                width: "100%",
                            }}
                            toolbox={{
                                feature: {
                                    saveAsImage: {},
                                }
                            }}
                            series={[
                                {
                                    type: 'pie',
                                    radius: '65%',
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
                    <div className="col-8 overflow-auto" style={{ maxHeight: '25rem' }}>
                        <p className='h4'>Per instruction status average cycles</p>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Inst</th>
                                    <th scope="col">Prefetch</th>
                                    <th scope="col">Decode</th>
                                    <th scope="col">Issue</th>
                                    <th scope="col">Execute</th>
                                    <th scope="col">WriteBack</th>
                                    <th scope="col">Commit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>ADDI R0 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>ADDI R1 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>ADDI R2 #40</td>
                                    <td>2</td>
                                    <td>1.5</td>
                                    <td>1.2</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>90%</td>
                                </tr>
                            </tbody>
                        </table>
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