import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { superscalarLoad } from "../../../actions";

import CodeComponent from "../CodeComponent";
import FunctionalUnitComponent from "../FunctionalUnitComponent";
import JumpPredictionComponent from "../JumpPredictionComponent";
import PrefetchDecoderComponent from "../PrefetchDecoderComponent";
import { ROBMapperComponent } from "../ROBMapperComponent";
import ReorderBufferComponent from "../ReorderBufferComponent";
import ReserveStationComponent from "../ReserveStationComponent";

/** Main simulation view tab showing all superscalar pipeline stages. */
export const GeneralTabComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const prefetchUnit = useAppSelector((state) => state.Machine.prefetchUnit);
  const decoder = useAppSelector((state) => state.Machine.decoder);
  const jumpPrediction = useAppSelector(
    (state) => state.Machine.jumpPrediction,
  );
  const functionalUnitIntAdd = useAppSelector(
    (state) => state.Machine.functionalUnitIntAdd,
  );
  const functionalUnitIntSub = useAppSelector(
    (state) => state.Machine.functionalUnitIntSub,
  );
  const functionalUnitFloAdd = useAppSelector(
    (state) => state.Machine.functionalUnitFloAdd,
  );
  const functionalUnitFloSub = useAppSelector(
    (state) => state.Machine.functionalUnitFloSub,
  );
  const functionalUnitMemory = useAppSelector(
    (state) => state.Machine.functionalUnitMemory,
  );
  const functionalUnitJump = useAppSelector(
    (state) => state.Machine.functionalUnitJump,
  );
  const functionalUnitAluMem = useAppSelector(
    (state) => state.Machine.functionalUnitAluMem,
  );
  const reserveStationIntAdd = useAppSelector(
    (state) => state.Machine.reserveStationIntAdd,
  );
  const reserveStationIntSub = useAppSelector(
    (state) => state.Machine.reserveStationIntSub,
  );
  const reserveStationFloAdd = useAppSelector(
    (state) => state.Machine.reserveStationFloAdd,
  );
  const reserveStationFloSub = useAppSelector(
    (state) => state.Machine.reserveStationFloSub,
  );
  const reserveStationMemory = useAppSelector(
    (state) => state.Machine.reserveStationMemory,
  );
  const reserveStationJump = useAppSelector(
    (state) => state.Machine.reserveStationJump,
  );
  const ROBGpr = useAppSelector((state) => state.Machine.ROBGpr);
  const ROBFpr = useAppSelector((state) => state.Machine.ROBFpr);
  const code = useAppSelector((state) => state.Machine.code);
  const colors = useAppSelector((state) => state.Colors);
  const colorBasicBlocks = useAppSelector(
    (state) => state.Machine.colorBasicBlocks,
  );

  return (
    <div className="smd-general_tab">
      <div className="smd-general_tab-code">
        <CodeComponent
          code={code}
          toggleBreakPoint={(instructions) =>
            dispatch(superscalarLoad(instructions))
          }
          colorBasicBlocks={colorBasicBlocks}
        />
      </div>
      <div className="smd-general_tab-simulation">
        <div className="smd-general_tab-simulation_left">
          <div className="smd-general_tab-simulation_prefetch_decoder">
            <div className="w-50">
              <PrefetchDecoderComponent
                data={prefetchUnit}
                colors={colors}
                title="Prefetch"
              />
            </div>
            <div className="w-50">
              <PrefetchDecoderComponent
                data={decoder}
                colors={colors}
                title="Decoder"
              />
            </div>
          </div>
          <div className="smd-general_tab-simulation_mappers">
            <div className="smd-general_tab-simulation_register_mapper">
              <ROBMapperComponent title="ROB<->GPR" data={ROBGpr.data} />
            </div>
            <div className="smd-general_tab-simulation_register_mapper">
              <ROBMapperComponent title="ROB<->FPR" data={ROBFpr.data} />
            </div>
            <div className="smd-general_tab-simulation_register_mapper">
              <JumpPredictionComponent
                title="Jump table"
                jumpPrediction={jumpPrediction}
              />
            </div>
          </div>
          <div className="smd-general_tab-simulation_reorder_buffer">
            <ReorderBufferComponent />
          </div>
        </div>
        <div className="smd-general_tab-simulation_center">
          <div className="panel panel-default inside-bar panel--stack">
            <div className="panel-heading">{t("Reserve Stations")}</div>
            <div className="panel-body">
              <ReserveStationComponent
                title="intAdd"
                data={reserveStationIntAdd}
                colors={colors}
              />
              <ReserveStationComponent
                title="intMult"
                data={reserveStationIntSub}
                colors={colors}
              />
              <ReserveStationComponent
                title="floatAdd"
                data={reserveStationFloAdd}
                colors={colors}
              />
              <ReserveStationComponent
                title="floatMult"
                data={reserveStationFloSub}
                colors={colors}
              />
              <ReserveStationComponent
                title="memory"
                data={reserveStationMemory}
                colors={colors}
              />
              <ReserveStationComponent
                title="jump"
                data={reserveStationJump}
                colors={colors}
              />
            </div>
          </div>
        </div>
        <div className="smd-general_tab-simulation_right">
          <div className="panel panel-default inside-bar panel--stack">
            <div className="panel-heading">{t("UF")}</div>
            <div className="panel-body">
              <FunctionalUnitComponent
                title="intAdd"
                header={functionalUnitIntAdd.header}
                content={functionalUnitIntAdd.content}
                colors={colors}
              />
              <FunctionalUnitComponent
                title="intMult"
                header={functionalUnitIntSub.header}
                content={functionalUnitIntSub.content}
                colors={colors}
              />
              <FunctionalUnitComponent
                title="floatAdd"
                header={functionalUnitFloAdd.header}
                content={functionalUnitFloAdd.content}
                colors={colors}
              />
              <FunctionalUnitComponent
                title="floatMult"
                header={functionalUnitFloSub.header}
                content={functionalUnitFloSub.content}
                colors={colors}
              />
              <FunctionalUnitComponent
                title="memory"
                header={functionalUnitMemory.header}
                content={functionalUnitMemory.content}
                colors={colors}
              />
              <FunctionalUnitComponent
                title="jump"
                header={functionalUnitJump.header}
                content={functionalUnitJump.content}
                colors={colors}
              />
              <FunctionalUnitComponent
                title="aluMem"
                header={functionalUnitAluMem.header}
                content={functionalUnitAluMem.content}
                colors={colors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTabComponent;
