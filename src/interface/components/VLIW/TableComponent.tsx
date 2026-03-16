import { useTranslation } from "react-i18next";

import VLIWOperationComponent from "./VLIWOperationComponent";

export function TableComponent(props: any) {
  const { t } = useTranslation();

  return (
    <div className="smd-table_component panel panel-default">
      <div className="panel-heading">{t(props.title)}</div>
      <div className="smd-table_component-body panel-body">
        <div className="smd-table">
          <div className="smd-table-header">
            <div className="smd-table_row">
              {props.header?.map((header: any, i: number) => (
                <div
                  className="smd-table_cell smd-table_cell--title"
                  key={`'VLIWHeader'${i}`}
                >
                  {`${t(header.translateKey)} ${header.extraValue}`}
                </div>
              ))}
            </div>
          </div>
          <div className="smd-table-body">
            {props.data?.map((row: any, i: number) => (
              <div
                className="smd-table_row"
                key={`${`VliwCode${i}`}`}
                style={{ background: i === props.pc ? "grey" : "" }}
              >
                <div className="smd-table_cell">{i}</div>
                {row.map((col: any, j: number) => (
                  <VLIWOperationComponent
                    op={col}
                    pos={[i, j]}
                    key={`${`VliwCode${i}-${j}`}`}
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
