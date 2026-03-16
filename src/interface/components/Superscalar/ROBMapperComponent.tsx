import { type FC } from "react";

/** Props for the ROB mapper display component. */
interface ROBMapperComponentProps {
  title: string;
  data: Record<string, number>;
}

/** Displays the reorder buffer to register mapping table. */
export const ROBMapperComponent: FC<ROBMapperComponentProps> = ({
  title,
  data,
}) => {
  return (
    <div className="smd-rob_mapper panel panel-default">
      <div className="panel-heading">{title}</div>
      <div className="smd-rob_mapper-body panel-body">
        <div className="smd-table">
          {Object.keys(data).map((index) => (
            <div className="smd-table_row" key={`${title}${index}`}>
              <div className="smd-table_cell" key={`${title}${index}65`}>
                {index}
              </div>
              <div className="smd-table_cell" key={`${title}${index}131`}>
                {data[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
