import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hooks";
import ReactECharts from "echarts-for-react";

/** VLIW statistics visualization tab with unit usage and cycle charts. */
export const StatsTabComponent: FC = () => {
  const { t } = useTranslation();

  const unitsUsage = useAppSelector((state) => state.Machine.stats.unitsUsage);
  const cyclesPerReplication = useAppSelector((state) => state.Ui.batchResults);

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <ReactECharts
            style={{ height: "25rem", width: "100%" }}
            option={{
              title: { text: t("stats.unitsUsage"), left: "center" },
              legend: { top: "bottom" },
              toolbox: {
                feature: {
                  saveAsImage: {},
                  dataView: {
                    readOnly: true,
                    lang: [
                      t("stats.toolbox.dataView"),
                      t("stats.toolbox.close"),
                      t("stats.toolbox.refresh"),
                    ],
                  },
                },
              },
              tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
              xAxis: { type: "category" },
              yAxis: {
                type: "value",
                max: 100,
                axisLabel: { formatter: "{value}%" },
              },
              series:
                unitsUsage &&
                Object.keys(unitsUsage).map((unitName) => ({
                  name: t("stats.units." + unitName),
                  type: "line",
                  data: unitsUsage[unitName].map((value: number) => value * 100),
                })),
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          {cyclesPerReplication.length > 0 && (
            <ReactECharts
              style={{ height: "13rem", width: "100%" }}
              option={{
                title: { text: t("stats.cycles"), left: "center" },
                toolbox: {
                  feature: {
                    saveAsImage: {},
                    dataView: {
                      readOnly: true,
                      lang: [
                        t("stats.toolbox.dataView"),
                        t("stats.toolbox.close"),
                        t("stats.toolbox.refresh"),
                      ],
                    },
                  },
                },
                tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
                xAxis: { type: "category" },
                yAxis: { type: "value" },
                series: {
                  name: t("stats.cycles"),
                  type: "line",
                  data: cyclesPerReplication,
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsTabComponent;
