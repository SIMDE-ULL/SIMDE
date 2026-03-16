import { useTranslation } from "react-i18next";

interface JumpPredictionComponentProps {
  title: string;
  jumpPrediction: number[];
}

export function JumpPredictionComponent(props: JumpPredictionComponentProps) {
  const { t } = useTranslation();

  return (
    <div className="smd-jump_prediction panel panel-default">
      <div className="panel-heading">{t(props.title)}</div>
      <div className="smd-jump_prediction-body panel-body">
        <div className="smd-table">
          {props.jumpPrediction.map((row: number, i: number) => (
            <div className="smd-table_row" key={`${props.title + i}`}>
              <div className="smd-table_cell" key={`${props.title + i + 65}`}>
                {i}
              </div>
              <div className="smd-table_cell" key={`${props.title + i + 131}`}>
                {row}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JumpPredictionComponent;
