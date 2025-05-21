import React from "react";
import { ComponentState } from "../types/component-types";
import { Icon } from "@iconify/react";

interface ThreeDButtonPreviewProps {
  buttonState: ComponentState;
}

export const ThreeDButtonPreview: React.FC<ThreeDButtonPreviewProps> = ({ buttonState }) => {
  const [rotation, setRotation] = React.useState({ x: 15, y: -15 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Apply button styles
  const buttonStyle = {
    ...buttonState.style,
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  };

  // Create depth effect
  const depthStyle = {
    position: 'absolute' as const,
    content: '""',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    backgroundColor: buttonState.style.backgroundColor || '#006FEE',
    transform: 'translateZ(-20px)',
    filter: 'brightness(0.7)',
    borderRadius: buttonState.style.borderRadius || '8px',
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <div className="perspective-1000">
        <div style={buttonStyle} className="relative">
          <div style={depthStyle} />
          {buttonState.iconLeft && (
            <span className="inline-flex items-center mr-2">
              <Icon icon={buttonState.iconLeft} />
            </span>
          )}
          {buttonState.text || "Button"}
          {buttonState.iconRight && (
            <span className="inline-flex items-center ml-2">
              <Icon icon={buttonState.iconRight} />
            </span>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 text-white/50 text-xs">
        Drag to rotate
      </div>
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};