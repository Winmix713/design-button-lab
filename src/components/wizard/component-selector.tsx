
import React from "react";
import { Card, CardBody, CardFooter, Button, Input, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useComponentSelection } from "@/contexts/component-selection-context";
import { useComponentState } from "@/contexts/component-state-context";
import { componentRegistry } from "@/registry/component-registry";

export const ComponentSelector: React.FC = () => {
  const { recentlyUsedComponents, addToRecentlyUsed, setIsSelectingComponent } = useComponentSelection();
  const { setComponentType } = useComponentState();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  
  // Get all available categories
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    
    Object.values(componentRegistry).forEach(component => {
      uniqueCategories.add(component.category);
    });
    
    return ["all", ...Array.from(uniqueCategories)];
  }, []);
  
  // Filter components based on search query and category
  const filteredComponents = React.useMemo(() => {
    return Object.entries(componentRegistry).filter(([id, component]) => {
      const matchesSearch = searchQuery === "" || 
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);
  
  // Handle component selection
  const handleSelectComponent = (type: string) => {
    setComponentType(type);
    addToRecentlyUsed(type);
    setIsSelectingComponent(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Select a Component</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            clearable
            onClear={() => setSearchQuery("")}
            className="flex-1"
          />
          
          <Tabs 
            selectedKey={selectedCategory} 
            onSelectionChange={setSelectedCategory as any}
            className="sm:w-auto"
            aria-label="Component Categories"
          >
            {categories.map(category => (
              <Tab 
                key={category} 
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            ))}
          </Tabs>
        </div>
      </div>
      
      {recentlyUsedComponents.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Recently Used</h3>
          <div className="flex flex-wrap gap-3">
            {recentlyUsedComponents.map((componentType) => {
              const component = componentRegistry[componentType];
              return (
                <Button
                  key={componentType}
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon={component.icon} />}
                  onPress={() => handleSelectComponent(componentType)}
                >
                  {component.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredComponents.map(([id, component]) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              isPressable 
              isHoverable 
              onPress={() => handleSelectComponent(id)}
              className="h-full"
            >
              <CardBody className="flex flex-col items-center justify-center gap-2 p-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary">
                  <Icon icon={component.icon} width={32} height={32} />
                </div>
                <h3 className="text-lg font-medium">{component.name}</h3>
                <p className="text-center text-default-500 text-sm">{component.description}</p>
              </CardBody>
              <CardFooter className="flex justify-between items-center px-6 py-3 bg-default-50 dark:bg-default-100/10">
                <span className="text-xs text-default-500 capitalize">{component.category}</span>
                <Button size="sm" color="primary" variant="flat">Select</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredComponents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Icon icon="lucide:search-x" className="text-5xl text-default-300 mb-4" />
          <h3 className="text-xl font-medium">No components found</h3>
          <p className="text-default-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};
