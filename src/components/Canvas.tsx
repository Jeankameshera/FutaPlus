
import React, { useRef, useState, useCallback } from 'react';
import { useFlow, Screen } from '@/contexts/FlowContext';
import ScreenNode from './ScreenNode';
import { cn } from '@/lib/utils';

interface CanvasProps {
  zoom?: number;
}

const Canvas: React.FC<CanvasProps> = ({ zoom = 1 }) => {
  const { 
    screens, 
    connections, 
    updateScreenPosition, 
    selectScreen, 
    addConnection, 
    selectedScreenId 
  } = useFlow();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<{ id: string, x: number, y: number } | null>(null);

  // Handle dropping a component from the library
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    try {
      const component = JSON.parse(e.dataTransfer.getData('application/json'));
      if (component && (component.category === 'SCREEN' || component.category === 'PAGE')) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasOffset.x) / zoom;
        const y = (e.clientY - rect.top - canvasOffset.y) / zoom;
        
        // Add the new screen at the drop position
        // This is handled by the FlowContext
      }
    } catch (err) {
      console.error('Error parsing dragged data', err);
    }
  }, [canvasOffset.x, canvasOffset.y, zoom]);

  // Handle canvas drag to pan
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only middle button (wheel) or right click with Alt key
    if (e.button === 1 || (e.button === 2 && e.altKey)) {
      e.preventDefault();
      setIsDraggingCanvas(true);
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;
      
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  // Connection handling functions
  const handleConnectionStart = (screenId: string, x: number, y: number) => {
    setConnectionStart({ id: screenId, x, y });
  };

  const handleConnectionEnd = (targetId: string) => {
    if (connectionStart && connectionStart.id !== targetId) {
      addConnection({
        source: connectionStart.id,
        target: targetId,
      });
      setConnectionStart(null);
    }
  };

  // Canvas background click, deselect everything
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      selectScreen(null);
      setConnectionStart(null);
    }
  };

  // Draw connections between screens
  const renderConnections = () => {
    return connections.map((connection) => {
      const sourceScreen = screens.find((s) => s.id === connection.source);
      const targetScreen = screens.find((s) => s.id === connection.target);
      
      if (!sourceScreen || !targetScreen) return null;
      
      // Simple straight line for now
      // In a real app, you'd want to calculate this better with bezier curves
      const sourceX = sourceScreen.position.x + 120; // Half of min-width
      const sourceY = sourceScreen.position.y + 210; // Half of min-height
      const targetX = targetScreen.position.x + 120;
      const targetY = targetScreen.position.y + 210;
      
      // Calculate the angle for the arrow
      const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
      const arrowLength = 10;
      
      return (
        <g key={connection.id}>
          <line
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
            className="flow-connection"
          />
          <polygon 
            points="0,-5 10,0 0,5" 
            className="flow-connection-arrow"
            transform={`translate(${targetX}, ${targetY}) rotate(${angle})`}
          />
          {connection.label && (
            <text
              x={(sourceX + targetX) / 2}
              y={(sourceY + targetY) / 2 - 10}
              className="text-xs fill-gray-700 bg-white"
              textAnchor="middle"
            >
              {connection.label}
            </text>
          )}
        </g>
      );
    });
  };

  // Render temp line when creating a connection
  const renderTempConnection = () => {
    if (!connectionStart) return null;

    // Get client mouse position
    const mouseX = (window.mouseX - canvasOffset.x) / zoom;
    const mouseY = (window.mouseY - canvasOffset.y) / zoom;
    
    return (
      <line
        x1={connectionStart.x}
        y1={connectionStart.y}
        x2={mouseX}
        y2={mouseY}
        stroke="#9b87f5"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
  };

  // Update global mouse position
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className={cn(
        "h-full w-full overflow-hidden bg-canvas canvas-grid relative",
        isDraggingCanvas ? "cursor-grabbing" : "cursor-default"
      )}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onClick={handleCanvasClick}
    >
      <div
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {renderConnections()}
          {renderTempConnection()}
        </svg>
        
        {screens.map((screen) => (
          <ScreenNode
            key={screen.id}
            screen={screen}
            isSelected={screen.id === selectedScreenId}
            onPositionChange={(position) => updateScreenPosition(screen.id, position)}
            onConnectionStart={(x, y) => handleConnectionStart(screen.id, x, y)}
            onConnectionEnd={() => handleConnectionEnd(screen.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
