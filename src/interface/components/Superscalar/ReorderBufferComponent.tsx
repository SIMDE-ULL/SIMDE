import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PhotoshopPicker } from "react-color";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { colorCell } from "../../actions/reorder-buffer-actions";

/** Color picker state for ROB instruction highlighting. */
interface ColorPickerState {
  displayColorPicker: boolean;
  instructionUid: number | null;
  selectedColor: string;
}

/** Displays the reorder buffer entries with color-coded instruction tracking. */
export const ReorderBufferComponent: React.FC = () => {
  const [pickerState, setPickerState] = useState<ColorPickerState>({
    displayColorPicker: false,
    instructionUid: null,
    selectedColor: "",
  });
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.Machine.reorderBuffer);
  const colors = useAppSelector((state) => state.Colors);

  const handleClick = (instructionUid: number, instructionColor: string) => {
    setPickerState({
      displayColorPicker: true,
      instructionUid,
      selectedColor: instructionColor,
    });
  };

  const onColorAccept = () => {
    dispatch(colorCell(pickerState.instructionUid, (pickerState.selectedColor as any).hex));
    setPickerState({
      displayColorPicker: false,
      instructionUid: null,
      selectedColor: "",
    });
  };

  const onColorCancel = () => {
    setPickerState({
      displayColorPicker: false,
      instructionUid: null,
      selectedColor: "",
    });
  };

  const handleChangeComplete = (color: any) => {
    setPickerState({ ...pickerState, selectedColor: color });
  };

  const popover: React.CSSProperties = {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    left: "50%",
  };

  return (
    <div className="smd-reorder_buffer panel panel-default reorder-zone">
      <div className="panel-heading">{"ReorderBuffer"}</div>
      <div className="panel-body smd-reorder_buffer-body">
        {pickerState.displayColorPicker ? (
          <div style={popover}>
            <PhotoshopPicker
              color={pickerState.selectedColor}
              onAccept={onColorAccept}
              onChangeComplete={handleChangeComplete}
              onCancel={onColorCancel}
            />
          </div>
        ) : null}
        <div className="smd-table">
          <div className="smd-table-header">
            <div className="smd-table-header_title">#</div>
            <div className="smd-table-header_title">Inst</div>
            <div className="smd-table-header_title">
              {t("reorderBuffer.Destiny")}
            </div>
            <div className="smd-table-header_title">
              {t("reorderBuffer.Value")}
            </div>
            <div className="smd-table-header_title">
              {t("reorderBuffer.A")}
            </div>
            <div className="smd-table-header_title">
              {t("reorderBuffer.Stage")}
            </div>
          </div>
          <div className="smd-table-body">
            {content &&
              content
                .map((row: any, i: number) => ({ row, i }))
                .filter((e: any) => e.row.instruction.id !== "")
                .map((e: any) => (
                  <div
                    className="smd-table_row smd-reorder_buffer_entry"
                    style={{
                      background: colors.uidColors[e.row.instruction.uid],
                    }}
                    onClick={() =>
                      handleClick(
                        e.row.instruction.uid,
                        e.row.instruction.color
                      )
                    }
                    title={e.row.instruction.value}
                    key={`ReorderBuffer${e.i}`}
                  >
                    <div className="smd-table_cell">{`[${e.i}]`}</div>
                    <div className="smd-table_cell">{e.row.instruction.id}</div>
                    <div className="smd-table_cell">
                      {e.row.destinyRegister}
                    </div>
                    <div className="smd-table_cell">{e.row.value}</div>
                    <div className="smd-table_cell">{e.row.address}</div>
                    <div className="smd-table_cell">{e.row.superStage}</div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReorderBufferComponent;
