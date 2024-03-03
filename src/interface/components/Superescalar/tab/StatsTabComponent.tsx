import * as React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { EChart } from "@kbox-labs/react-echarts";

export class StatsTabComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  formatTableNumber(value: number) {
    return Math.round(value * 100) / 100 || "-";
  }

  render() {
    return (
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <EChart
              title={{
                text: this.props.t("stats.instrStatuses"),
                left: "center",
              }}
              style={{
                height: "25rem",
                width: "100%",
              }}
              legend={{
                top: "bottom",
                selected: {
                  [this.props.t("stats.statuses.commitNumber")]: false,
                },
              }}
              toolbox={{
                feature: {
                  saveAsImage: {},
                  dataView: {
                    readOnly: true,
                    lang: [
                      this.props.t("stats.toolbox.dataView"),
                      this.props.t("stats.toolbox.close"),
                      this.props.t("stats.toolbox.refresh"),
                    ],
                  },
                },
              }}
              tooltip={{
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              }}
              xAxis={{
                type: "category",
              }}
              yAxis={{
                type: "value",
              }}
              series={
                this.props.statusesCount &&
                Array.from(this.props.statusesCount.keys()).map((status) => {
                  return {
                    name: this.props.t("stats.statuses." + status),
                    type: "bar",
                    stack: "statuses",
                    data: this.props.statusesCount.get(status),
                  };
                })
              }
            />
          </div>
          <div className="col">
            <EChart
              title={{
                text: this.props.t("stats.unitsOcupation"),
                left: "center",
              }}
              style={{
                height: "25rem",
                width: "100%",
              }}
              legend={{
                top: "bottom",
                selected: {
                  [this.props.t("stats.units.rs0")]: false,
                  [this.props.t("stats.units.rs1")]: false,
                  [this.props.t("stats.units.rs2")]: false,
                  [this.props.t("stats.units.rs3")]: false,
                  [this.props.t("stats.units.rs4")]: false,
                  [this.props.t("stats.units.rs5")]: false,
                  [this.props.t("stats.units.fu0")]: false,
                  [this.props.t("stats.units.fu1")]: false,
                  [this.props.t("stats.units.fu2")]: false,
                  [this.props.t("stats.units.fu3")]: false,
                  [this.props.t("stats.units.fu4")]: false,
                  [this.props.t("stats.units.fu5")]: false,
                },
              }}
              toolbox={{
                feature: {
                  saveAsImage: {},
                  dataView: {
                    readOnly: true,
                    lang: [
                      this.props.t("stats.toolbox.dataView"),
                      this.props.t("stats.toolbox.close"),
                      this.props.t("stats.toolbox.refresh"),
                    ],
                  },
                },
              }}
              tooltip={{
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              }}
              xAxis={{
                type: "category",
              }}
              yAxis={{
                type: "value",
                max: 100,
                axisLabel: {
                  formatter: "{value}%",
                },
              }}
              series={
                this.props.unitsOcupation &&
                Array.from(this.props.unitsOcupation.keys()).map((unitName) => {
                  return {
                    name: this.props.t("stats.units." + unitName),
                    type: "line",
                    data: this.props.unitsOcupation
                      .get(unitName)
                      .map((value) => value * 100),
                  };
                })
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <EChart
              title={{
                text: this.props.t("stats.commitDiscard"),
                left: "center",
              }}
              style={{
                height: "13rem",
                width: "100%",
              }}
              toolbox={{
                feature: {
                  saveAsImage: {},
                },
              }}
              series={[
                {
                  type: "pie",
                  radius: "65%",
                  label: {
                    formatter: "{b}: {c} ({d}%)",
                  },
                  data: [
                    {
                      value: this.props.commited,
                      name: this.props.t("stats.commited"),
                    },
                    {
                      value: this.props.discarded,
                      name: this.props.t("stats.discarded"),
                    },
                  ],
                },
              ]}
            />
            {this.props.cyclesPerReplication.length > 0 && (
              <EChart
                title={{
                  text: this.props.t("stats.cycles"),
                  left: "center",
                }}
                style={{
                  height: "13rem",
                  width: "100%",
                }}
                toolbox={{
                  feature: {
                    saveAsImage: {},
                    dataView: {
                      readOnly: true,
                      lang: [
                        this.props.t("stats.toolbox.dataView"),
                        this.props.t("stats.toolbox.close"),
                        this.props.t("stats.toolbox.refresh"),
                      ],
                    },
                  },
                }}
                tooltip={{
                  trigger: "axis",
                  axisPointer: {
                    type: "cross",
                  },
                }}
                xAxis={{
                  type: "category",
                }}
                yAxis={{
                  type: "value",
                }}
                series={{
                  name: this.props.t("stats.cycles"),
                  type: "line",
                  data: this.props.cyclesPerReplication,
                }}
              />
            )}
          </div>
          <div className="col-8 overflow-auto" style={{ maxHeight: "25rem" }}>
            <p className="h4">{this.props.t("stats.statusAverage")}</p>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{this.props.t("Code")}</th>
                  <th scope="col">
                    {this.props.t("stats.statuses.prefetchNumber")}
                  </th>
                  <th scope="col">
                    {this.props.t("stats.statuses.decodeNumber")}
                  </th>
                  <th scope="col">
                    {this.props.t("stats.statuses.issueNumber")}
                  </th>
                  <th scope="col">
                    {this.props.t("stats.statuses.executeNumber")}
                  </th>
                  <th scope="col">
                    {this.props.t("stats.statuses.writeBackNumber")}
                  </th>
                  <th scope="col">
                    {this.props.t("stats.statuses.commitNumber")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.instrCommitPercentage &&
                  this.props.instrCommitPercentage.map((d) => (
                    <tr key={d.name}>
                      <th scope="row">{d.name}</th>
                      <td>{this.props.code[d.name].toString()}</td>
                      <td>
                        {this.formatTableNumber(
                          this.props.instrStatuses.get(d.name).prefetchCycles
                        )}
                      </td>
                      <td>
                        {this.formatTableNumber(
                          this.props.instrStatuses.get(d.name).decodeCycles
                        )}
                      </td>
                      <td>
                        {this.formatTableNumber(
                          this.props.instrStatuses.get(d.name).issueCycles
                        )}
                      </td>
                      <td>
                        {this.formatTableNumber(
                          this.props.instrStatuses.get(d.name).executeCycles
                        )}
                      </td>
                      <td>
                        {this.formatTableNumber(
                          this.props.instrStatuses.get(d.name).writeBackCycles
                        )}
                      </td>
                      <td>{this.formatTableNumber(d.value * 100)}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commited: state.Machine.stats.commited,
    discarded: state.Machine.stats.discarded,
    instrCommitPercentage: state.Machine.stats.commitedPerInstr,
    unitsOcupation: state.Machine.stats.unitsOcupation,
    statusesCount: state.Machine.stats.statusesCount,
    instrStatuses: state.Machine.stats.instructionsStatusesAverageCycles,
    cyclesPerReplication: state.Ui.batchResults,
    code: state.Machine.code,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StatsTabComponent));
