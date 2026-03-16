import { type CSSProperties, type FC, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import type { VisualReorderBufferEntry } from "../../../core/Superscalar/ReorderBuffer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { colorCell } from "../../actions/reorder-buffer-actions";

interface ColorPickerState {
  displayColorPicker: boolean;
  instructionUid: number | null;
  selectedColor: string;
}

/** Displays the reorder buffer entries with color-coded instruction tracking. */
export const ReorderBufferComponent: FC = () => {
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
      selectedColor: instructionColor || "#ffffff",
    });
  };

  const onColorAccept = () => {
    if (pickerState.instructionUid === null) {
      return;
    }
    dispatch(colorCell(pickerState.instructionUid, pickerState.selectedColor));
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

  const popover: CSSProperties = {
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
            <HexColorPicker
              color={pickerState.selectedColor}
              onChange={(hex) =>
                setPickerState((prev) => ({ ...prev, selectedColor: hex }))
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 4,
                marginTop: 4,
              }}
            >
              <button type="button" onClick={onColorCancel}>
                {t("common.cancel", "Cancel")}
              </button>
              <button type="button" onClick={onColorAccept}>
                OK
              </button>
            </div>
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
            <div className="smd-table-header_title">{t("reorderBuffer.A")}</div>
            <div className="smd-table-header_title">
              {t("reorderBuffer.Stage")}
            </div>
          </div>
          <div className="smd-table-body">
            {(content as VisualReorderBufferEntry[])
              ?.map((row, i) => ({ row, i }))
              .filter((e) => e.row.instruction.id !== "")
              .map((e) => (
                <div
                  className="smd-table_row smd-reorder_buffer_entry"
                  style={{
                    background: colors.uidColors[e.row.instruction.uid],
                  }}
                  onClick={() =>
                    handleClick(e.row.instruction.uid, e.row.instruction.color)
                  }
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      handleClick(
                        e.row.instruction.uid,
                        e.row.instruction.color,
                      );
                    }
                  }}
                  // biome-ignore lint/a11y/useSemanticElements: table row acts as a clickable element for instruction selection
                  role="button"
                  tabIndex={0}
                  title={e.row.instruction.value}
                  key={`ReorderBuffer${e.i}`}
                >
                  <div className="smd-table_cell">{`[${e.i}]`}</div>
                  <div className="smd-table_cell">{e.row.instruction.id}</div>
                  <div className="smd-table_cell">{e.row.destinyRegister}</div>
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
