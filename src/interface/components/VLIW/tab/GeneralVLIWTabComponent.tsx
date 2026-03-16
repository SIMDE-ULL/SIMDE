import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { superscalarLoad } from "../../../actions";
import {
  addNatFprInterval,
  removeNatFprInterval,
  addNatGprInterval,
  removeNatGprInterval,
  addMemoryInterval as addPredicateInterval,
  removeMemoryInterval as removePredicateInterval,
} from "../../../actions/predicate-nat-actions";

import FunctionalUnitComponent from "../FunctionalUnitComponent";
import CodeComponent from "../CodeComponent";
import { TableComponent } from "../TableComponent";
import RegisterComponent from "../../Superscalar/RegisterComponent";
import { PREDICATE_SIZE } from "../../../reducers/machine";
import VLIWIntegration from "../../../../integration/vliw-integration.client";

/** Main VLIW simulation view tab showing pipeline stages and functional units. */
export const GeneralVLIWTabComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const functionalUnitIntAdd = useAppSelector((state) => state.Machine.functionalUnitIntAdd);
  const functionalUnitIntSub = useAppSelector((state) => state.Machine.functionalUnitIntSub);
  const functionalUnitFloAdd = useAppSelector((state) => state.Machine.functionalUnitFloAdd);
  const functionalUnitFloSub = useAppSelector((state) => state.Machine.functionalUnitFloSub);
  const functionalUnitMemory = useAppSelector((state) => state.Machine.functionalUnitMemory);
  const functionalUnitJump = useAppSelector((state) => state.Machine.functionalUnitJump);
  const natFpr = useAppSelector((state) => state.Machine.natFpr);
  const natGpr = useAppSelector((state) => state.Machine.natGpr);
  const predicate = useAppSelector((state) => state.Machine.predicate);
  const code = useAppSelector((state) => state.Machine.code);
  const pc = useAppSelector((state) => state.Machine.pc);
  const colorBasicBlocks = useAppSelector((state) => state.Machine.colorBasicBlocks);
  const vliwExecutionTable = useAppSelector((state) => state.Machine.vliwExecutionTable);
  const vliwExecutionHeaderTable = useAppSelector((state) => state.Machine.vliwExecutionHeaderTable);

  return (
    <div className="smd-general_tab">
      <div className="smd-general_tab-code">
        <CodeComponent
          code={code}
          toggleBreakPoint={(instructions) => dispatch(superscalarLoad(instructions))}
          colorBasicBlocks={colorBasicBlocks}
        />
      </div>
      <div className="smd-general_tab-simulation">
        <div className="smd-general_tab-simulation_left--expanded">
          <div className="smd-general_tab-simulation_planificator">
            <TableComponent
              title="VLIWInstructions"
              header={vliwExecutionHeaderTable}
              data={vliwExecutionTable}
              pc={pc}
              onDropInstruction={VLIWIntegration.setOperation}
            />
          </div>
          <div className="smd-general_tab-simulation_nat_predicate">
            <RegisterComponent
              title="predicate"
              data={predicate.data}
              visibleRange={predicate.visibleRangeValues}
              addInterval={(v) => dispatch(addPredicateInterval(v))}
              removeInterval={(v) => dispatch(removePredicateInterval(v))}
              max={PREDICATE_SIZE}
            />
            <RegisterComponent
              title="NaTGPR"
              data={natGpr.data}
              visibleRange={natGpr.visibleRangeValues}
              addInterval={(v) => dispatch(addNatGprInterval(v))}
              removeInterval={(v) => dispatch(removeNatGprInterval(v))}
              max={PREDICATE_SIZE}
            />
            <RegisterComponent
              title="NaTFPR"
              data={natFpr.data}
              visibleRange={natFpr.visibleRangeValues}
              addInterval={(v) => dispatch(addNatFprInterval(v))}
              removeInterval={(v) => dispatch(removeNatFprInterval(v))}
              max={PREDICATE_SIZE}
            />
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
              />
              <FunctionalUnitComponent
                title="intMult"
                header={functionalUnitIntSub.header}
                content={functionalUnitIntSub.content}
              />
              <FunctionalUnitComponent
                title="floatAdd"
                header={functionalUnitFloAdd.header}
                content={functionalUnitFloAdd.content}
              />
              <FunctionalUnitComponent
                title="floatMult"
                header={functionalUnitFloSub.header}
                content={functionalUnitFloSub.content}
              />
              <FunctionalUnitComponent
                title="memory"
                header={functionalUnitMemory.header}
                content={functionalUnitMemory.content}
              />
              <FunctionalUnitComponent
                title="jump"
                header={functionalUnitJump.header}
                content={functionalUnitJump.content}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralVLIWTabComponent;
