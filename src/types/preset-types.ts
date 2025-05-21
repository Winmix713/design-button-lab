
import { ComponentState } from "./component-types";
import { Theme } from "../lib/themes";

export interface Preset {
  name: string;
  category: string;
  componentType: string;
  state: Partial<ComponentState>;
  theme?: Theme; // Adding theme support to presets
}
