import { useTranslation } from "react-i18next";

import VLIWOperationComponent from "./VLIWOperationComponent";

interface TableHeader {
  translateKey: string;
  extraValue: string;
}

interface TableComponentProps {
  title: string;
  header?: TableHeader[];
  data?: string[][];
  pc: number;
  onDropInstruction: (item: { loc: number }, pos: [number, number]) => void;
}

export function TableComponent(props: TableComponentProps) {
  const { t } = useTranslation();

  return (
    <div className="smd-table_component panel panel-default">
      <div className="panel-heading">{t(props.title)}</div>
      <div className="smd-table_component-body panel-body">
        <div className="smd-table">
          <div className="smd-table-header">
            <div className="smd-table_row">
              {props.header?.map((header: TableHeader, i: number) => (
                <div
                  className="smd-table_cell smd-table_cell--title"
                  // biome-ignore lint/suspicious/noArrayIndexKey: VLIW table headers are positional without stable unique IDs
                  key={`VLIWHeader${i}`}
                >
                  {`${t(header.translateKey)} ${header.extraValue}`}
                </div>
              ))}
            </div>
          </div>
          <div className="smd-table-body">
            {props.data?.map((row: string[], i: number) => (
              <div
                className="smd-table_row"
                // biome-ignore lint/suspicious/noArrayIndexKey: VLIW instruction rows are identified by position
                key={`VliwCode${i}`}
                style={{ background: i === props.pc ? "grey" : "" }}
              >
                <div className="smd-table_cell">{i}</div>
                {row.map((col: string, j: number) => (
                  <VLIWOperationComponent
                    op={col}
                    pos={[i, j]}
                    // biome-ignore lint/suspicious/noArrayIndexKey: VLIW operation slots are identified by grid position
                    key={`VliwCode${i}-${j}`}
                    onDropInstruction={props.onDropInstruction}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
