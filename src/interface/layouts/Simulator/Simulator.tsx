import { Suspense, useCallback, useState } from "react";
import type { SimulatorLayoutProps } from "./Simulator.types";
import { t } from "i18next";

export default function SimulatorLayout({ simulators }: SimulatorLayoutProps) {
  const [simulator, setSimulator] = useState(null);

  const setSimulatorFromIndex = useCallback(
    (index: number) => setSimulator(simulators[index]),
    [simulators],
  );

  return (
    <main>
      {simulator ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <simulator.component />
        </Suspense>
      ) : (
        <fieldset>
          <legend>Choose a simulator:</legend>
          {simulators.map((simulator, index) => (
            <>
              <input
                type="radio"
                name="simulator"
                id={simulator.name}
                key={simulator.name}
                style={{visibility: "hidden"}}
                onClick={() => setSimulatorFromIndex(index)}
              />
              <label htmlFor={simulator.name} key={simulator.name}>
                {t(`landingPage.${simulator.name}`)}
              </label>
            </>
          ))}
        </fieldset>
      )}
    </main>
  );
}
