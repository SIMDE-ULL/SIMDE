import { type FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { MachineIntegration } from "../../../integration/machine-integration.client";
import { useAppSelector } from "../../../store/hooks";

interface AccessBarProps {
  integration: MachineIntegration;
}

/** Playback control bar with play/pause/stop/step and speed controls. */
export const AccessBarComponent: FC<AccessBarProps> = ({ integration }) => {
  const { t } = useTranslation();
  const cycle = useAppSelector((state) => state.Machine.cycle);
  const speedRef = useRef<HTMLInputElement>(null);

  const syncSpeed = () => {
    integration.speedValue = Number.parseInt(
      speedRef.current?.value || "0",
      10,
    );
  };

  return (
    <div className="smd-access_bar">
      <button
        type="button"
        onClick={() => {
          syncSpeed();
          integration.play();
        }}
      >
        <i className="fa fa-play" />
      </button>
      <button type="button" onClick={() => integration.pause()}>
        <i className="fa fa-pause" />
      </button>
      <button type="button" onClick={() => integration.stop()}>
        <i className="fa fa-stop" />
      </button>
      <button type="button" onClick={() => integration.stepBack()}>
        <i className="fa fa-step-backward" />
      </button>
      <button type="button" onClick={() => integration.stepForward()}>
        <i className="fa fa-step-forward" />
      </button>
      <div className="smd-cycle">
        <label htmlFor="cycle" className="smd-cycle_label">
          {t("accessBar.cycle")}
        </label>
        <span className="smd-cycle_value">{cycle}</span>
      </div>
      <span className="smd-speed">
        <label className="smd-speed_label" htmlFor="velocidad">
          {t("accessBar.speed")}
        </label>
        <input
          ref={speedRef}
          type="number"
          className="smd-speed_value"
          defaultValue={"5"}
          min="0"
          max="10"
        />
      </span>
    </div>
  );
};

export default AccessBarComponent;
