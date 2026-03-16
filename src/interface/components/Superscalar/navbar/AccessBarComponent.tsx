import { useRef, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hooks";
import SuperscalarIntegration from "../../../../integration/superscalar-integration.client";

/** Superscalar playback control bar with play/pause/stop/step and speed controls. */
export const AccessBarComponent: FC = () => {
  const { t } = useTranslation();
  const cycle = useAppSelector((state) => state.Machine.cycle);
  const speedRef = useRef<HTMLInputElement>(null);

  const syncSpeed = () => {
    SuperscalarIntegration.speedValue = parseInt(speedRef.current?.value || "0", 10);
  };

  return (
    <div className="smd-access_bar">
      <a onClick={() => { syncSpeed(); SuperscalarIntegration.play(); }}>
        <i className="fa fa-play" aria-hidden="true" />
      </a>
      <a onClick={() => SuperscalarIntegration.pause()}>
        <i className="fa fa-pause" aria-hidden="true" />
      </a>
      <a onClick={() => SuperscalarIntegration.stop()}>
        <i className="fa fa-stop" aria-hidden="true" />
      </a>
      <a onClick={() => SuperscalarIntegration.stepBack()}>
        <i className="fa fa-step-backward" aria-hidden="true" />
      </a>
      <a onClick={() => SuperscalarIntegration.stepForward()}>
        <i className="fa fa-step-forward" aria-hidden="true" />
      </a>
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
