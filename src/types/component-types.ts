export interface ComponentStyle {
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
  maxWidth?: string;
  textTransform?: string;
  letterSpacing?: string;
  textDecoration?: string;
  fontStyle?: string;
  overflow?: string;
  [key: string]: string | undefined;
}

export interface ComponentState {
  componentType: string;
  text?: string;
  iconLeft?: string;
  iconRight?: string;
  customCSS?: string;
  style: ComponentStyle;
  hoverStyle?: Partial<ComponentStyle>;
  activeStyle?: Partial<ComponentStyle>;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  showImage?: boolean;
  imagePosition?: string;
  imageHeight?: string;
  imageUrl?: string;
  imageAltText?: string;
  bodyContent?: string;
  showFooter?: boolean;
  footerContent?: string;
  backgroundType?: string;
  isHoverable?: boolean;
  isPressable?: boolean;
  isBlurred?: boolean;
  layoutType?: string;
  animationType?: string;
  animationDelay?: number;
  animationDirection?: string;
  animationIterationCount?: string;
  animationFillMode?: string;
  reduceMotion?: boolean;
  [key: string]: any;
}

export interface ComponentRegistryItem {
  name: string;
  description: string;
  category: string;
  icon: string;
  defaultState: ComponentState;
}

export interface ComponentRegistryType {
  [key: string]: ComponentRegistryItem;
}
