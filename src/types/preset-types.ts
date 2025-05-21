import { ComponentState } from "./component-types";

export interface Preset {
  name: string;
  category: string;
  componentType: string;
  state: Partial<ComponentState>;
}
