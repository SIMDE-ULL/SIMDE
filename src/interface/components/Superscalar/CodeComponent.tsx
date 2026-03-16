import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { OpcodesNames } from "../../../core/Common/Opcodes";
import { Instruction } from "../../../core/Common/Instruction";
import SuperscalarIntegration from "../../../integration/superscalar-integration.client";

/** Props for the superscalar code display component. */
interface CodeComponentProps {
  code: Instruction[];
  toggleBreakPoint: (instructions: Instruction[]) => void;
  colorBasicBlocks: boolean;
}

const COLOR_PALETTE = ["blue", "green", "yellow", "pink"];

/** Displays the loaded program code with breakpoint toggling and basic block coloring. */
export const CodeComponent: FC<CodeComponentProps> = ({
  code,
  toggleBreakPoint,
  colorBasicBlocks,
}) => {
  const { t } = useTranslation();

  const setBreakpoint = (index: number) => {
    SuperscalarIntegration.superscalar.code.toggleBreakpoint(index);
    toggleBreakPoint(SuperscalarIntegration.superscalar.code.instructions);
  };

  const getBlockColor = (row: Instruction): string => {
    return colorBasicBlocks
      ? COLOR_PALETTE[row.basicBlock % COLOR_PALETTE.length]
      : "";
  };

  return (
    <div className="smd-code panel panel-default">
      <div className="panel-heading">{t("code")}</div>
      <div className="panel-body">
        <div className="smd-table">
          <div className="smd-table-header">
            <div className="smd-table-header_title">#</div>
            <div className="smd-table-header_title">OPCODE</div>
            <div className="smd-table-header_title">OP1</div>
            <div className="smd-table-header_title">OP2</div>
            <div className="smd-table-header_title">OP3</div>
          </div>
          <div className="smd-table-body">
            {code &&
              code.map((row: Instruction, i) => (
                <div
                  className="smd-table_row"
                  key={`Code${i}`}
                  onClick={() => setBreakpoint(i)}
                >
                  <div
                    className={`smd-table_cell ${row.breakPoint ? "smd-breakpoint" : ""}`}
                  >
                    {row.label} {i}
                  </div>
                  <div className={`smd-table_cell ${getBlockColor(row)}`}>
                    {OpcodesNames[row.opcode]}
                  </div>
                  <div className={`smd-table_cell ${getBlockColor(row)}`}>
                    {row.operandsString[0]}
                  </div>
                  <div className={`smd-table_cell ${getBlockColor(row)}`}>
                    {row.operandsString[1]}
                  </div>
                  <div className={`smd-table_cell ${getBlockColor(row)}`}>
                    {row.operandsString[2]}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeComponent;
