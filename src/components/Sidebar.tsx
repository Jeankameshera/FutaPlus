
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LibraryComponent, componentLibrary } from '@/data/componentLibrary';
import { useFlow } from '@/contexts/FlowContext';
import { ChevronRight, ChevronLeft, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ComponentItem: React.FC<{ component: LibraryComponent }> = ({ component }) => {
  const { addScreen } = useFlow();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddScreen = () => {
    if (component.category === 'SCREEN' || component.category === 'PAGE') {
      // Convert 'BOTH' platform to 'MOBILE' when adding to ensure type safety
      const platformType = component.platform === 'BOTH' ? 'MOBILE' : component.platform;
      
      addScreen({
        type: platformType,
        name: component.name,
        position: { x: 100, y: 100 },
        components: []
      });
    }
  };

  return (
    <div 
      className="component-item group mb-2"
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{component.name}</span>
        {(component.category === 'SCREEN' || component.category === 'PAGE') && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
            onClick={handleAddScreen}
          >
            <Plus size={14} />
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 truncate">{component.description}</p>
      <div className="text-xs mt-1">
        <span className={cn(
          "inline-block px-1.5 py-0.5 rounded text-xs font-medium mr-1",
          component.platform === 'MOBILE' ? "bg-blue-100 text-blue-800" : 
          component.platform === 'WEB' ? "bg-purple-100 text-purple-800" : 
          "bg-green-100 text-green-800"
        )}>
          {component.platform}
        </span>
        <span className={cn(
          "inline-block px-1.5 py-0.5 rounded text-xs font-medium",
          component.category === 'UI' ? "bg-gray-100 text-gray-800" :
          component.category === 'SCREEN' ? "bg-orange-100 text-orange-800" :
          "bg-pink-100 text-pink-800"
        )}>
          {component.category}
        </span>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = componentLibrary.filter(component => 
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    component.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uiComponents = filteredComponents.filter(comp => comp.category === 'UI');
  const screenComponents = filteredComponents.filter(comp => comp.category === 'SCREEN' || comp.category === 'PAGE');

  return (
    <div 
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-20 flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-12" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h2 className="text-sidebar-foreground font-semibold">Component Library</h2>}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {!collapsed && (
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search components..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Tabs defaultValue="ui">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ui">UI Components</TabsTrigger>
              <TabsTrigger value="screens">Screens</TabsTrigger>
            </TabsList>
            <TabsContent value="ui" className="mt-3">
              {uiComponents.map((component) => (
                <ComponentItem key={component.type} component={component} />
              ))}
            </TabsContent>
            <TabsContent value="screens" className="mt-3">
              {screenComponents.map((component) => (
                <ComponentItem key={component.type} component={component} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
