import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { EChart } from '@kbox-labs/react-echarts'

export class StatsTabComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    formatTableNumber(value: number) {
        return Math.round(value * 100) / 100 || '-';
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
                            legend={{
                                top: 'bottom'
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
                            series={
                                this.props.statusesCount && Array.from(this.props.statusesCount.keys()).map((status) => {
                                    return {
                                        name: status,
                                        type: 'bar',
                                        stack: 'statuses',
                                        data: this.props.statusesCount.get(status)
                                    }
                                })
                            }
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
                            legend={{
                                top: 'bottom',
                                selected: {
                                    'rs0': false,
                                    'rs1': false,
                                    'rs2': false,
                                    'rs3': false,
                                    'rs4': false,
                                    'rs5': false,
                                    'fu0': false,
                                    'fu1': false,
                                    'fu2': false,
                                    'fu3': false,
                                    'fu4': false,
                                    'fu5': false,
                                }
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
                            series={
                                this.props.unitsOcupation && Array.from(this.props.unitsOcupation.keys()).map((unitName) => {
                                    return {
                                        name: unitName,
                                        type: 'line',
                                        data: this.props.unitsOcupation.get(unitName).map((value) => value * 100)
                                    }
                                })
                            }
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
                                        { value: this.props.commited, name: 'Commited' },
                                        { value: this.props.discarded, name: 'Discarded' },
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
                                {
                                    this.props.instrCommitPercentage && this.props.instrCommitPercentage.map((d) =>
                                        <tr key={d.name}>
                                            <th scope="row">{d.name}</th>
                                            <td>{this.props.code[d.name].toString()}</td>
                                            <td>{this.formatTableNumber(this.props.instrStatuses.get(d.name).prefetchCycles)}</td>
                                            <td>{this.formatTableNumber(this.props.instrStatuses.get(d.name).decodeCycles)}</td>
                                            <td>{this.formatTableNumber(this.props.instrStatuses.get(d.name).issueCycles)}</td>
                                            <td>{this.formatTableNumber(this.props.instrStatuses.get(d.name).executeCycles)}</td>
                                            <td>{this.formatTableNumber(this.props.instrStatuses.get(d.name).writeBackCycles)}</td>
                                            <td>{this.formatTableNumber(d.value * 100)}%</td>
                                        </tr>
                                    )
                                }
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
        commited: state.Machine.stats.commited,
        discarded: state.Machine.stats.discarded,
        instrCommitPercentage: state.Machine.stats.commitedPerInstr,
        unitsOcupation: state.Machine.stats.unitsOcupation,
        statusesCount: state.Machine.stats.statusesCount,
        instrStatuses: state.Machine.stats.instructionsStatusesAverageCycles,
        code: state.Machine.code
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({

        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsTabComponent);