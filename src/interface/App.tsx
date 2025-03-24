import { Suspense, lazy } from "react";
import { SimulatorLayout } from "./layouts";

const simulators = [
  {
    name: "superscalar",
    component: lazy(
      () => import("./components/Superscalar/SuperscalarComponent"),
    ),
  },
  {
    name: "vliw",
    component: lazy(() => import("./components/VLIW/VLIWComponent")),
  },
];

const App = () => {
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <SimulatorLayout simulators={simulators} />
    </Suspense>
  );
};

export default App;
