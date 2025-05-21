export interface ButtonStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  fontWeight?: string;
  fontSize?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  textAlign?: string;
  cursor?: string;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  transitionProperty?: string;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  textTransform?: string;
  letterSpacing?: string;
  textDecoration?: string;
  fontStyle?: string;
  [key: string]: string | undefined;
}

export interface ButtonState {
  text: string;
  iconLeft: string;
  iconRight: string;
  customCSS: string;
  style: ButtonStyle;
  hoverStyle: Partial<ButtonStyle>;
  activeStyle: Partial<ButtonStyle>;
}
