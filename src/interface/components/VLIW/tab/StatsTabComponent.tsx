import type * as React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { type AnyAction, type Dispatch, bindActionCreators } from "redux";

import ReactECharts from "echarts-for-react";

type StatsTabComponentProps = WithTranslation &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const StatsTabComponent: React.FC = (
  props: StatsTabComponentProps,
): React.ReactNode => {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <ReactECharts
            style={{
              height: "25rem",
              width: "100%",
            }}
            option={{
              title: {
                text: props.t("stats.unitsUsage"),
                left: "center",
              },

              legend: {
                top: "bottom",
              },

              toolbox: {
                feature: {
                  saveAsImage: {},
                  dataView: {
                    readOnly: true,
                    lang: [
                      props.t("stats.toolbox.dataView"),
                      props.t("stats.toolbox.close"),
                      props.t("stats.toolbox.refresh"),
                    ],
                  },
                },
              },

              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },

              xAxis: {
                type: "category",
              },

              yAxis: {
                type: "value",
                max: 100,
                axisLabel: {
                  formatter: "{value}%",
                },
              },

              series:
                props.unitsUsage &&
                Array.from(props.unitsUsage.keys()).map((unitName) => {
                  return {
                    name: props.t(`stats.units.${unitName}`),
                    type: "line",
                    data: props.unitsUsage
                      .get(unitName)
                      .map((value: number) => value * 100),
                  };
                }),
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          {props.cyclesPerReplication.length > 0 && (
            <ReactECharts
              style={{
                height: "13rem",
                width: "100%",
              }}
              option={{
                title: {
                  text: props.t("stats.cycles"),
                  left: "center",
                },

                toolbox: {
                  feature: {
                    saveAsImage: {},
                    dataView: {
                      readOnly: true,
                      lang: [
                        props.t("stats.toolbox.dataView"),
                        props.t("stats.toolbox.close"),
                        props.t("stats.toolbox.refresh"),
                      ],
                    },
                  },
                },

                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "cross",
                  },
                },

                xAxis: {
                  type: "category",
                },

                yAxis: {
                  type: "value",
                },

                series: {
                  name: props.t("stats.cycles"),
                  type: "line",
                  data: props.cyclesPerReplication,
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    commited: state.Machine.stats.commited,
    discarded: state.Machine.stats.discarded,
    instrCommitPercentage: state.Machine.stats.commitedPerInstr,
    unitsUsage: state.Machine.stats.unitsUsage,
    statusesCount: state.Machine.stats.statusesCount,
    instrStatuses: state.Machine.stats.instructionsStatusesAverageCycles,
    cyclesPerReplication: state.Ui.batchResults,
    code: state.Machine.code,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    actions: bindActionCreators({}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(StatsTabComponent));
