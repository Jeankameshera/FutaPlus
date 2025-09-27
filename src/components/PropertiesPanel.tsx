
import React from 'react';
import { useFlow } from '@/contexts/FlowContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const { 
    screens, 
    selectedScreenId, 
    selectedComponentId, 
    updateScreen, 
    updateComponent 
  } = useFlow();
  
  // Find selected screen and component
  const selectedScreen = screens.find(screen => screen.id === selectedScreenId);
  const selectedComponent = selectedScreen?.components.find(
    comp => comp.id === selectedComponentId
  );

  if (!selectedScreen && !selectedComponent) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Select a screen or component to view properties
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedScreen) {
      updateScreen(selectedScreen.id, { name: e.target.value });
    }
  };

  const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement>, propName: string) => {
    if (selectedScreen && selectedComponent) {
      const currentProps = selectedComponent.props || {};
      updateComponent(selectedScreen.id, selectedComponent.id, {
        props: { ...currentProps, [propName]: e.target.value }
      });
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-auto">
      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              {selectedComponent 
                ? `${selectedComponent.name} Properties` 
                : `${selectedScreen?.name} Properties`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedScreen && !selectedComponent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="screen-name">Screen Name</Label>
                  <Input 
                    id="screen-name" 
                    value={selectedScreen.name}
                    onChange={handleNameChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="screen-type">Type</Label>
                  <div className="flex items-center h-10 px-3 rounded-md border">
                    <span className="text-sm">{selectedScreen.type}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="pos-x" className="text-xs">X</Label>
                      <Input 
                        id="pos-x" 
                        value={selectedScreen.position.x}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pos-y" className="text-xs">Y</Label>
                      <Input 
                        id="pos-y" 
                        value={selectedScreen.position.y}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Components</Label>
                  {selectedScreen.components.length > 0 ? (
                    <div className="space-y-1">
                      {selectedScreen.components.map(component => (
                        <div 
                          key={component.id}
                          className="flex items-center justify-between p-2 text-sm bg-gray-50 rounded border hover:bg-gray-100"
                        >
                          <span>{component.name}</span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded border">
                      No components added yet
                    </div>
                  )}
                  
                  <Button size="sm" className="w-full">Add Component</Button>
                </div>
              </div>
            )}
            
            {selectedComponent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comp-name">Name</Label>
                  <Input 
                    id="comp-name" 
                    value={selectedComponent.name}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comp-type">Type</Label>
                  <Input 
                    id="comp-type" 
                    value={selectedComponent.type}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Properties</Label>
                  
                  {selectedComponent.props ? (
                    Object.entries(selectedComponent.props).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={`prop-${key}`} className="text-xs capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Input 
                          id={`prop-${key}`} 
                          value={value as string}
                          onChange={(e) => handleComponentChange(e, key)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No editable properties
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertiesPanel;
