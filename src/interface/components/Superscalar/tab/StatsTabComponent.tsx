import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hooks";
import ReactECharts from "echarts-for-react";

/** Statistics visualization tab with charts for instruction statuses, unit usage, and commit/discard ratios. */
export const StatsTabComponent: FC = () => {
  const { t } = useTranslation();

  const commited = useAppSelector((state) => state.Machine.stats.commited);
  const discarded = useAppSelector((state) => state.Machine.stats.discarded);
  const instrCommitPercentage = useAppSelector((state) => state.Machine.stats.commitedPerInstr);
  const unitsUsage = useAppSelector((state) => state.Machine.stats.unitsUsage);
  const statusesCount = useAppSelector((state) => state.Machine.stats.statusesCount);
  const instrStatuses = useAppSelector((state) => state.Machine.stats.instructionsStatusesAverageCycles);
  const cyclesPerReplication = useAppSelector((state) => state.Ui.batchResults);
  const code = useAppSelector((state) => state.Machine.code);

  const formatTableNumber = (value: number): string => {
    const formattedNumber = Math.round(value * 100) / 100 || "-";
    return String(formattedNumber);
  };

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <ReactECharts
            style={{ height: "25rem", width: "100%" }}
            option={{
              title: { text: t("stats.instrStatuses"), left: "center" },
              legend: {
                top: "bottom",
                selected: { [t("stats.statuses.commitNumber")]: false },
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                  dataView: {
                    readOnly: true,
                    lang: [t("stats.toolbox.dataView"), t("stats.toolbox.close"), t("stats.toolbox.refresh")],
                  },
                },
              },
              tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
              xAxis: { type: "category" },
              yAxis: { type: "value" },
              series:
                statusesCount &&
                (Array.from(statusesCount.keys()) as string[]).map((statusName) => ({
                  name: t("stats.statuses." + statusName),
                  type: "bar",
                  stack: "statuses",
                  data: statusesCount.get(statusName),
                })),
            }}
          />
        </div>
        <div className="col">
          <ReactECharts
            style={{ height: "25rem", width: "100%" }}
            option={{
              title: { text: t("stats.unitsUsage"), left: "center" },
              legend: {
                top: "bottom",
                selected: {
                  [t("stats.units.rs0")]: false, [t("stats.units.rs1")]: false,
                  [t("stats.units.rs2")]: false, [t("stats.units.rs3")]: false,
                  [t("stats.units.rs4")]: false, [t("stats.units.rs5")]: false,
                  [t("stats.units.fu0")]: false, [t("stats.units.fu1")]: false,
                  [t("stats.units.fu2")]: false, [t("stats.units.fu3")]: false,
                  [t("stats.units.fu4")]: false, [t("stats.units.fu5")]: false,
                },
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                  dataView: {
                    readOnly: true,
                    lang: [t("stats.toolbox.dataView"), t("stats.toolbox.close"), t("stats.toolbox.refresh")],
                  },
                },
              },
              tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
              xAxis: { type: "category" },
              yAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
              series:
                unitsUsage &&
                (Array.from(unitsUsage.keys()) as string[]).map((unitName) => ({
                  name: t("stats.units." + unitName),
                  type: "line",
                  data: unitsUsage.get(unitName).map((value: number) => value * 100),
                })),
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ReactECharts
            style={{ height: "13rem", width: "100%" }}
            option={{
              title: { text: t("stats.commitDiscard"), left: "center" },
              toolbox: { feature: { saveAsImage: {} } },
              series: [
                {
                  type: "pie",
                  radius: "65%",
                  label: { formatter: "{b}: {c} ({d}%)" },
                  data: [
                    { value: commited, name: t("stats.commited") },
                    { value: discarded, name: t("stats.discarded") },
                  ],
                },
              ],
            }}
          />
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
                      lang: [t("stats.toolbox.dataView"), t("stats.toolbox.close"), t("stats.toolbox.refresh")],
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
        <div className="col-8 overflow-auto" style={{ maxHeight: "25rem" }}>
          <p className="h4">{t("stats.statusAverage")}</p>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t("code")}</th>
                <th scope="col">{t("stats.statuses.prefetchNumber")}</th>
                <th scope="col">{t("stats.statuses.decodeNumber")}</th>
                <th scope="col">{t("stats.statuses.issueNumber")}</th>
                <th scope="col">{t("stats.statuses.executeNumber")}</th>
                <th scope="col">{t("stats.statuses.writeBackNumber")}</th>
                <th scope="col">{t("stats.statuses.commitNumber")}</th>
              </tr>
            </thead>
            <tbody>
              {instrCommitPercentage &&
                instrCommitPercentage.map((d: { name: string; value: number }) => {
                  const stats = instrStatuses.get(Number(d.name));
                  return (
                  <tr key={d.name}>
                    <th scope="row">{d.name}</th>
                    <td>{code[Number(d.name)]?.toString()}</td>
                    <td>{formatTableNumber(stats?.prefetchCycles ?? 0)}</td>
                    <td>{formatTableNumber(stats?.decodeCycles ?? 0)}</td>
                    <td>{formatTableNumber(stats?.issueCycles ?? 0)}</td>
                    <td>{formatTableNumber(stats?.executeCycles ?? 0)}</td>
                    <td>{formatTableNumber(stats?.writeBackCycles ?? 0)}</td>
                    <td>{formatTableNumber(d.value * 100)}%</td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsTabComponent;
