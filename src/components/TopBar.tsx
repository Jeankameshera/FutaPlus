
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Eye, Settings } from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { LibraryComponent, componentLibrary } from '@/data/componentLibrary';

const TopBar: React.FC = () => {
  const { addScreen } = useFlow();
  
  const handleAddMobileScreen = () => {
    const mobileScreenComponent = componentLibrary.find(
      c => c.type === 'UNIVERSITIES_SCREEN'
    ) as LibraryComponent;
    
    if (mobileScreenComponent) {
      addScreen({
        type: 'MOBILE',
        name: mobileScreenComponent.name,
        position: { x: 100, y: 100 },
        components: []
      });
    }
  };

  const handleAddWebScreen = () => {
    const webScreenComponent = componentLibrary.find(
      c => c.type === 'PROFILE_PAGE'
    ) as LibraryComponent;
    
    if (webScreenComponent) {
      addScreen({
        type: 'WEB',
        name: webScreenComponent.name,
        position: { x: 400, y: 100 },
        components: []
      });
    }
  };

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold mr-6 text-primary">Screen Flow Builder</h1>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAddMobileScreen}>
            <Plus size={14} className="mr-1" />
            Mobile Screen
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddWebScreen}>
            <Plus size={14} className="mr-1" />
            Web Page
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <Save size={14} className="mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline">
          <Eye size={14} className="mr-1" />
          Preview
        </Button>
        <Button size="sm" variant="outline">
          <Settings size={14} className="mr-1" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
