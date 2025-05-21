import React from "react";
import { Tabs, Tab, Button, Tooltip, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ButtonState } from "../types/button-types";

interface CodePanelProps {
  componentType: "button" | "card";
  componentState: any;
}

export const CodePanel: React.FC<CodePanelProps> = ({ componentType, componentState }) => {
  const [codeFormat, setCodeFormat] = React.useState<string>("css");
  const [copied, setCopied] = React.useState(false);
  const [framework, setFramework] = React.useState<string>("vanilla");

  const generateCSSCode = () => {
    // Add null check to prevent destructuring undefined
    if (!componentState || !componentState.style) {
      return "// Loading component state...";
    }
    
    const { style, hoverStyle, activeStyle } = componentState;
    
    let cssCode = `.custom-${componentType} {\n`;
    
    // Add base styles
    Object.entries(style).forEach(([key, value]) => {
      if (value) {
        // Convert camelCase to kebab-case
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        cssCode += `  ${cssKey}: ${value};\n`;
      }
    });
    
    // Add transition if specified
    if (style.transitionDuration) {
      cssCode += `  transition: all ${style.transitionDuration};\n`;
    }
    
    cssCode += `}\n\n`;
    
    // Add hover styles
    if (hoverStyle && Object.keys(hoverStyle).length > 0) {
      cssCode += `.custom-${componentType}:hover {\n`;
      Object.entries(hoverStyle).forEach(([key, value]) => {
        if (value) {
          const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
          cssCode += `  ${cssKey}: ${value};\n`;
        }
      });
      cssCode += `}\n\n`;
    }
    
    // Add active styles
    if (activeStyle && Object.keys(activeStyle).length > 0) {
      cssCode += `.custom-${componentType}:active {\n`;
      Object.entries(activeStyle).forEach(([key, value]) => {
        if (value) {
          const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
          cssCode += `  ${cssKey}: ${value};\n`;
        }
      });
      cssCode += `}\n`;
    }
    
    return cssCode;
  };
  
  const generateHTMLCode = () => {
    // Add null check to prevent accessing properties of undefined
    if (!componentState) {
      return "<!-- Loading component state... -->";
    }
    
    const { text, iconLeft, iconRight } = componentState;
    const elementType = componentType === "button" ? "button" : "div";
    
    let htmlCode = `<${elementType} class="custom-${componentType}">`;
    
    if (iconLeft) {
      htmlCode += `\n  <span class="icon-left">\n    <!-- ${iconLeft} icon -->\n  </span>`;
    }
    
    if (componentType === "button") {
      htmlCode += `\n  ${text || "Button"}`;
    } else {
      // For card, generate appropriate HTML structure
      htmlCode += `\n  <!-- Card content here -->`;
      if (componentState.showHeader) {
        htmlCode += `\n  <div class="card-header">\n    <h3>${componentState.headerTitle || "Card Title"}</h3>\n  </div>`;
      }
      htmlCode += `\n  <div class="card-body">\n    ${componentState.bodyContent || "Card content"}\n  </div>`;
    }
    
    if (iconRight) {
      htmlCode += `\n  <span class="icon-right">\n    <!-- ${iconRight} icon -->\n  </span>`;
    }
    
    htmlCode += `\n</${elementType}>`;
    
    return htmlCode;
  };
  
  const generateReactComponentCode = () => {
    // Add null check to prevent destructuring undefined
    if (!componentState || !componentState.style) {
      return "// Loading component state...";
    }
    
    const { text, iconLeft, iconRight, style, hoverStyle } = componentState;
    const componentName = componentType === "button" ? "CustomButton" : "CustomCard";
    
    let reactCode = `import React from "react";\n`;
    
    if (iconLeft || iconRight) {
      reactCode += `import { Icon } from "@iconify/react";\n`;
    }
    
    reactCode += `\n`;
    reactCode += `export const ${componentName} = ({ children, ...props }) => {\n`;
    reactCode += `  const [isHovered, setIsHovered] = React.useState(false);\n\n`;
    
    reactCode += `  const baseStyle = {\n`;
    
    // Add styles
    Object.entries(style).forEach(([key, value]) => {
      if (value) {
        reactCode += `    ${key}: "${value}",\n`;
      }
    });
    
    reactCode += `  };\n\n`;
    
    if (hoverStyle && Object.keys(hoverStyle).length > 0) {
      reactCode += `  const hoverStyle = {\n`;
      Object.entries(hoverStyle).forEach(([key, value]) => {
        if (value) {
          reactCode += `    ${key}: "${value}",\n`;
        }
      });
      reactCode += `  };\n\n`;
      
      reactCode += `  const ${componentType}Style = isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle;\n\n`;
    } else {
      reactCode += `  const ${componentType}Style = baseStyle;\n\n`;
    }
    
    reactCode += `  return (\n`;
    
    if (componentType === "button") {
      reactCode += `    <button\n`;
      reactCode += `      style={${componentType}Style}\n`;
      reactCode += `      className="custom-${componentType}"\n`;
      reactCode += `      onMouseEnter={() => setIsHovered(true)}\n`;
      reactCode += `      onMouseLeave={() => setIsHovered(false)}\n`;
      reactCode += `      {...props}\n`;
      reactCode += `    >\n`;
      
      if (iconLeft) {
        reactCode += `      <span className="icon-left">\n`;
        reactCode += `        <Icon icon="${iconLeft}" />\n`;
        reactCode += `      </span>\n`;
      }
      
      reactCode += `      {children || "${text || "Button"}"}\n`;
      
      if (iconRight) {
        reactCode += `      <span className="icon-right">\n`;
        reactCode += `        <Icon icon="${iconRight}" />\n`;
        reactCode += `      </span>\n`;
      }
      
      reactCode += `    </button>\n`;
    } else {
      // Generate card component
      reactCode += `    <div\n`;
      reactCode += `      style={${componentType}Style}\n`;
      reactCode += `      className="custom-${componentType}"\n`;
      reactCode += `      onMouseEnter={() => setIsHovered(true)}\n`;
      reactCode += `      onMouseLeave={() => setIsHovered(false)}\n`;
      reactCode += `      {...props}\n`;
      reactCode += `    >\n`;
      reactCode += `      {children || (\n`;
      reactCode += `        <>\n`;
      
      if (componentState.showHeader) {
        reactCode += `          <div className="card-header">\n`;
        reactCode += `            <h3>${componentState.headerTitle || "Card Title"}</h3>\n`;
        reactCode += `          </div>\n`;
      }
      
      reactCode += `          <div className="card-body">\n`;
      reactCode += `            ${componentState.bodyContent || "Card content"}\n`;
      reactCode += `          </div>\n`;
      reactCode += `        </>\n`;
      reactCode += `      )}\n`;
      reactCode += `    </div>\n`;
    }
    
    reactCode += `  );\n`;
    reactCode += `};\n`;
    
    return reactCode;
  };
  
  const generateReactCode = () => {
    // Add null check to prevent destructuring undefined
    if (!componentState || !componentState.style) {
      return "// Loading component state...";
    }
    
    const { text, iconLeft, iconRight, style } = componentState;
    const elementType = componentType === "button" ? "button" : "div";
    const componentName = componentType === "button" ? "CustomButton" : "CustomCard";
    
    let reactCode = `import React from "react";\n\n`;
    
    if (iconLeft || iconRight) {
      reactCode += `// Import your icon library\n`;
      reactCode += `import { Icon } from "@iconify/react";\n\n`;
    }
    
    reactCode += `export const ${componentName} = () => {\n`;
    reactCode += `  const ${componentType}Style = {\n`;
    
    // Add styles
    Object.entries(style).forEach(([key, value]) => {
      if (value) {
        reactCode += `    ${key}: "${value}",\n`;
      }
    });
    
    reactCode += `  };\n\n`;
    
    reactCode += `  return (\n`;
    
    if (componentType === "button") {
      reactCode += `    <${elementType} style={${componentType}Style} className="custom-${componentType}">\n`;
      
      if (iconLeft) {
        reactCode += `      <span className="icon-left">\n`;
        reactCode += `        <Icon icon="${iconLeft}" />\n`;
        reactCode += `      </span>\n`;
      }
      
      reactCode += `      ${text || "Button"}\n`;
      
      if (iconRight) {
        reactCode += `      <span className="icon-right">\n`;
        reactCode += `        <Icon icon="${iconRight}" />\n`;
        reactCode += `      </span>\n`;
      }
    } else {
      // Generate card component
      reactCode += `    <${elementType} style={${componentType}Style} className="custom-${componentType}">\n`;
      
      if (componentState.showHeader) {
        reactCode += `      <div className="card-header">\n`;
        reactCode += `        <h3>${componentState.headerTitle || "Card Title"}</h3>\n`;
        reactCode += `      </div>\n`;
      }
      
      reactCode += `      <div className="card-body">\n`;
      reactCode += `        ${componentState.bodyContent || "Card content"}\n`;
      reactCode += `      </div>\n`;
    }
    
    reactCode += `    </${elementType}>\n`;
    reactCode += `  );\n`;
    reactCode += `};\n`;
    
    return reactCode;
  };
  
  const generateVueComponentCode = () => {
    const { text, iconLeft, iconRight, style, hoverStyle } = componentState;
    
    let vueCode = `<template>\n`;
    vueCode += `  <button\n`;
    vueCode += `    class="custom-button"\n`;
    vueCode += `    :style="buttonStyle"\n`;
    vueCode += `    @mouseenter="isHovered = true"\n`;
    vueCode += `    @mouseleave="isHovered = false"\n`;
    vueCode += `  >\n`;
    
    if (iconLeft) {
      vueCode += `    <span class="icon-left">\n`;
      vueCode += `      <i-icon :icon="'${iconLeft}'" />\n`;
      vueCode += `    </span>\n`;
    }
    
    vueCode += `    <slot>${text || "Button"}</slot>\n`;
    
    if (iconRight) {
      vueCode += `    <span class="icon-right">\n`;
      vueCode += `      <i-icon :icon="'${iconRight}'" />\n`;
      vueCode += `    </span>\n`;
    }
    
    vueCode += `  </button>\n`;
    vueCode += `</template>\n\n`;
    
    vueCode += `<script>\n`;
    vueCode += `export default {\n`;
    vueCode += `  name: 'CustomButton',\n`;
    vueCode += `  data() {\n`;
    vueCode += `    return {\n`;
    vueCode += `      isHovered: false\n`;
    vueCode += `    };\n`;
    vueCode += `  },\n`;
    vueCode += `  computed: {\n`;
    vueCode += `    baseStyle() {\n`;
    vueCode += `      return {\n`;
    
    // Add styles
    Object.entries(style).forEach(([key, value]) => {
      if (value) {
        vueCode += `        ${key}: '${value}',\n`;
      }
    });
    
    vueCode += `      };\n`;
    vueCode += `    },\n`;
    
    if (hoverStyle && Object.keys(hoverStyle).length > 0) {
      vueCode += `    hoverStyle() {\n`;
      vueCode += `      return {\n`;
      Object.entries(hoverStyle).forEach(([key, value]) => {
        if (value) {
          vueCode += `        ${key}: '${value}',\n`;
        }
      });
      vueCode += `      };\n`;
      vueCode += `    },\n`;
      
      vueCode += `    buttonStyle() {\n`;
      vueCode += `      return this.isHovered\n`;
      vueCode += `        ? { ...this.baseStyle, ...this.hoverStyle }\n`;
      vueCode += `        : this.baseStyle;\n`;
      vueCode += `    }\n`;
    } else {
      vueCode += `    buttonStyle() {\n`;
      vueCode += `      return this.baseStyle;\n`;
      vueCode += `    }\n`;
    }
    
    vueCode += `  }\n`;
    vueCode += `};\n`;
    vueCode += `</script>\n`;
    
    return vueCode;
  };
  
  const generateTailwindCode = () => {
    // Add null check to prevent destructuring undefined
    if (!componentState || !componentState.style) {
      return "// Loading component state...";
    }
    
    const { text, iconLeft, iconRight, style } = componentState;
    const elementType = componentType === "button" ? "button" : "div";
    
    // Map CSS properties to Tailwind classes (simplified)
    const tailwindClasses = [];
    
    // Font weight
    if (style.fontWeight) {
      const weightMap: Record<string, string> = {
        "normal": "font-normal",
        "500": "font-medium",
        "600": "font-semibold",
        "bold": "font-bold"
      };
      tailwindClasses.push(weightMap[style.fontWeight] || "");
    }
    
    // Text color
    if (style.color) {
      tailwindClasses.push("text-[" + style.color + "]");
    }
    
    // Background color
    if (style.backgroundColor) {
      tailwindClasses.push("bg-[" + style.backgroundColor + "]");
    }
    
    // Border
    if (style.borderWidth && style.borderColor) {
      tailwindClasses.push(`border-[${style.borderWidth}] border-[${style.borderColor}]`);
    }
    
    // Border radius
    if (style.borderRadius) {
      const radiusValue = parseInt(style.borderRadius);
      if (radiusValue === 9999) {
        tailwindClasses.push("rounded-full");
      } else {
        tailwindClasses.push(`rounded-[${style.borderRadius}]`);
      }
    }
    
    // Padding
    if (style.paddingLeft && style.paddingTop) {
      tailwindClasses.push(`px-[${style.paddingLeft}] py-[${style.paddingTop}]`);
    }
    
    // Shadow
    if (style.boxShadow && style.boxShadow !== "none") {
      tailwindClasses.push("shadow");
    }
    
    // Transition
    if (style.transitionDuration) {
      tailwindClasses.push("transition-all duration-" + (parseInt(style.transitionDuration) / 100));
    }
    
    let tailwindCode = `<${elementType} className="${tailwindClasses.join(" ")}">\n`;
    
    if (componentType === "button") {
      if (iconLeft) {
        tailwindCode += `  <span className="mr-2">\n`;
        tailwindCode += `    {/* ${iconLeft} icon */}\n`;
        tailwindCode += `  </span>\n`;
      }
      
      tailwindCode += `  ${text || "Button"}\n`;
      
      if (iconRight) {
        tailwindCode += `  <span className="ml-2">\n`;
        tailwindCode += `    {/* ${iconRight} icon */}\n`;
        tailwindCode += `  </span>\n`;
      }
    } else {
      // Generate card component
      if (componentState.showHeader) {
        tailwindCode += `  <div className="border-b border-default-200 p-4">\n`;
        tailwindCode += `    <h3 className="text-lg font-semibold">${componentState.headerTitle || "Card Title"}</h3>\n`;
        tailwindCode += `  </div>\n`;
      }
      
      tailwindCode += `  <div className="p-4">\n`;
      tailwindCode += `    ${componentState.bodyContent || "Card content"}\n`;
      tailwindCode += `  </div>\n`;
    }
    
    tailwindCode += `</${elementType}>`;
    
    return tailwindCode;
  };
  
  const getCode = () => {
    switch (codeFormat) {
      case "css":
        return generateCSSCode();
      case "html":
        return generateHTMLCode();
      case "react":
        return framework === "react" ? generateReactComponentCode() : generateReactCode();
      case "vue":
        // Add null check for Vue code generation
        if (!componentState || !componentState.style) {
          return "// Loading component state...";
        }
        return generateVueComponentCode();
      case "tailwind":
        return generateTailwindCode();
      default:
        return generateCSSCode();
    }
  };
  
  const getLanguage = () => {
    switch (codeFormat) {
      case "css":
        return "css";
      case "html":
        return "html";
      case "react":
        return "jsx";
      case "vue":
        return "html";
      case "tailwind":
        return "jsx";
      default:
        return "css";
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Generated Code</h2>
        <div className="flex gap-2">
          <Select
            size="sm"
            selectedKeys={[codeFormat]}
            onChange={(e) => setCodeFormat(e.target.value)}
            aria-label="Select code format"
          >
            <SelectItem key="css" value="css">CSS</SelectItem>
            <SelectItem key="html" value="html">HTML</SelectItem>
            <SelectItem key="react" value="react">React</SelectItem>
            <SelectItem key="vue" value="vue">Vue</SelectItem>
            <SelectItem key="tailwind" value="tailwind">Tailwind CSS</SelectItem>
          </Select>
          
          {codeFormat === "react" && (
            <Select
              size="sm"
              selectedKeys={[framework]}
              onChange={(e) => setFramework(e.target.value)}
              aria-label="Select framework option"
            >
              <SelectItem key="vanilla" value="vanilla">Basic</SelectItem>
              <SelectItem key="react" value="react">Component</SelectItem>
            </Select>
          )}
          
          <Tooltip content={copied ? "Copied!" : "Copy code"}>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={copyToClipboard}
            >
              <Icon icon={copied ? "lucide:check" : "lucide:clipboard"} />
            </Button>
          </Tooltip>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden rounded-lg border border-divider">
        <SyntaxHighlighter
          language={getLanguage()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            height: "100%",
            fontSize: "0.9rem"
          }}
        >
          {getCode()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};