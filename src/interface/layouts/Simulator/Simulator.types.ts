import type { LazyExoticComponent } from "react";

export interface SimulatorLayoutProps {
  simulators: {
    name: string;
    component: LazyExoticComponent<() => JSX.Element>;
  }[];
}
