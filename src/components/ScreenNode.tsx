
import React, { useRef, useState } from 'react';
import { useFlow, Screen } from '@/contexts/FlowContext';
import { cn } from '@/lib/utils';
import { MoreHorizontal, XCircle, Plus, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ScreenNodeProps {
  screen: Screen;
  isSelected: boolean;
  onPositionChange: (position: { x: number; y: number }) => void;
  onConnectionStart: (x: number, y: number) => void;
  onConnectionEnd: () => void;
}

const ScreenNode: React.FC<ScreenNodeProps> = ({
  screen,
  isSelected,
  onPositionChange,
  onConnectionStart,
  onConnectionEnd,
}) => {
  const { selectScreen, removeScreen } = useFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Component drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    selectScreen(screen.id);
    
    setIsDragging(true);
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    onPositionChange({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Connection handlers
  const handleConnectionDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      onConnectionStart(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
    }
  };

  const handleConnectionDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConnectionEnd();
  };

  // Set up event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Determine screen type styling
  const screenTypeStyle = screen.type === 'MOBILE'
    ? 'aspect-[9/16] max-w-xs'
    : 'aspect-[16/9] max-w-xl';

  return (
    <div
      ref={nodeRef}
      className={cn(
        'screen-node absolute animate-fade-in',
        isSelected ? 'ring-2 ring-primary' : '',
        screenTypeStyle
      )}
      style={{
        left: `${screen.position.x}px`,
        top: `${screen.position.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectScreen(screen.id);
      }}
      onMouseDown={handleMouseDown}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleConnectionDrop}
    >
      {/* Header */}
      <div className="bg-gray-100 p-2 flex items-center justify-between border-b">
        <div className="font-medium text-sm truncate">{screen.name}</div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleConnectionDrag(e);
            }}
            draggable="true"
          >
            <Link size={14} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => {}}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Add Component</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => removeScreen(screen.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Screen Content */}
      <div className="p-3 h-[calc(100%-32px)] overflow-auto bg-gray-50">
        {screen.components.length > 0 ? (
          screen.components.map((component) => (
            <div key={component.id} className="mb-2 p-2 bg-white border rounded shadow-sm">
              <div className="text-xs font-medium">{component.name}</div>
              <div className="text-xs text-gray-500">{component.type}</div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="mb-2">
              <Plus size={24} />
            </div>
            <div className="text-sm">Drop components here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenNode;
