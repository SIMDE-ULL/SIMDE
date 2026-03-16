import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import IntervalModalComponent from "./Modal/IntervalModalComponent";

/** Props for the register display component. */
interface RegisterComponentProps {
  title: string;
  data: (number | boolean)[];
  visibleRange: number[];
  addInterval: (value: number[]) => void;
  removeInterval: (value: number[]) => void;
  max: number;
}

/** Displays a bank of CPU registers with add/remove interval controls. */
export const RegisterComponent: FC<RegisterComponentProps> = ({
  title,
  data,
  visibleRange,
  addInterval,
  removeInterval,
  max,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const { t } = useTranslation();

  const renderCondition = visibleRange && data && data.length > 0;

  return (
    <div className="smd-register">
      <IntervalModalComponent
        title={title}
        onAccept={addInterval}
        max={max}
        open={isAddModalOpen}
        close={() => setIsAddModalOpen(false)}
      />
      <IntervalModalComponent
        title={title}
        onAccept={removeInterval}
        max={max}
        open={isRemoveModalOpen}
        close={() => setIsRemoveModalOpen(false)}
      />
      <div className="panel panel-default">
        <div className="panel-heading">{t(title)}</div>
        <div className="panel-body">
          <div className="smd-table">
            {renderCondition &&
              visibleRange.map((index) => (
                <div className="smd-table_row" key={`${title}${index}`}>
                  <div className="smd-table_cell" key={`${title}${index}65`}>
                    {index}
                  </div>
                  <div className="smd-table_cell" key={`${title}${index}131`}>
                    {"" + data[index]}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="panel-footer">
          <button
            type="button"
            className="btn smd-register_button"
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="fa fa-plus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn smd-register_button"
            onClick={() => setIsRemoveModalOpen(true)}
          >
            <i className="fa fa-minus" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
