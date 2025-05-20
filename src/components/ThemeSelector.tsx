
import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Theme, availableThemes } from "@/lib/themes";

interface ThemeSelectorProps {
  onSelectTheme: (theme: Theme, variant: keyof Theme) => void;
  onClose: () => void;
  currentThemeName?: string;
}

export function ThemeSelector({ onSelectTheme, onClose, currentThemeName }: ThemeSelectorProps) {
  const themeVariants: Array<keyof Theme> = [
    'primary',
    'secondary',
    'danger', 
    'success',
    'warning',
    'info',
    'neutral'
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-950 shadow-lg rounded-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              Theme Selector
            </h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <ScrollArea className="h-[60vh]">
            <div className="space-y-8">
              {availableThemes.map((theme) => (
                <div key={theme.name} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-medium">{theme.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {theme.description}
                      </p>
                    </div>
                    {currentThemeName === theme.name && (
                      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-sm px-3 py-1 rounded-full">
                        Current
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themeVariants.map((variant) => {
                      const variantStyle = theme[variant];
                      if (!variantStyle || typeof variantStyle !== 'object') return null;
                      
                      return (
                        <div key={`${theme.name}-${String(variant)}`} className="space-y-2">
                          <div 
                            className="h-20 rounded-md cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"
                            style={{ 
                              background: variantStyle.base,
                              borderRadius: theme.borderRadius.medium
                            }}
                            onClick={() => onSelectTheme(theme, variant)}
                          />
                          <div className="flex justify-between items-center px-1">
                            <span className="text-sm capitalize">{String(variant)}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs"
                              onClick={() => onSelectTheme(theme, variant)}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Border Radius</div>
                        <div className="flex space-x-2">
                          {['small', 'medium', 'large', 'pill'].map((size) => (
                            <div 
                              key={size} 
                              className="h-8 w-8 bg-gray-200 dark:bg-gray-700"
                              style={{ 
                                borderRadius: theme.borderRadius[size as keyof typeof theme.borderRadius]
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Font Family</div>
                        <div className="text-sm" style={{ fontFamily: theme.fontFamily }}>
                          {theme.fontFamily.split(',')[0]}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Shadows</div>
                        <div className="flex space-x-4">
                          {['small', 'medium', 'large'].map((size) => (
                            <div 
                              key={size} 
                              className="h-8 w-8 bg-white dark:bg-gray-700"
                              style={{ 
                                boxShadow: theme.shadows[size as keyof typeof theme.shadows]
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
