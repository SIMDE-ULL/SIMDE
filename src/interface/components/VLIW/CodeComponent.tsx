import type { FC } from "react";
import { useTranslation } from "react-i18next";

import type { Instruction } from "../../../core/Common/Instruction";
import InstructionComponent from "./InstructionComponent";

const COLOR_PALETTE = ["blue", "green", "yellow", "pink"];

interface CodeComponentProps {
  code: Instruction[];
  colorBasicBlocks: boolean;
  toggleBreakPoint?: (instructions: Instruction[]) => void;
}

/** VLIW code listing with optional basic block coloring. */
export const CodeComponent: FC<CodeComponentProps> = ({
  code,
  colorBasicBlocks,
}) => {
  const { t } = useTranslation();

  const setColor = (row: Instruction): string => {
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
            {code?.map((row: Instruction, i) => (
              <InstructionComponent
                instruction={row}
                // biome-ignore lint/suspicious/noArrayIndexKey: instructions are identified by their position in the program
                key={i}
                loc={i}
                color={setColor(row)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeComponent;
