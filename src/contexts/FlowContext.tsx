
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Component {
  id: string;
  type: string;
  name: string;
  description?: string;
  props?: Record<string, any>;
}

export interface Screen {
  id: string;
  type: 'MOBILE' | 'WEB';
  name: string;
  position: { x: number; y: number };
  components: Component[];
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface FlowContextType {
  screens: Screen[];
  connections: Connection[];
  selectedScreenId: string | null;
  selectedComponentId: string | null;
  addScreen: (screen: Omit<Screen, 'id'>) => void;
  updateScreen: (id: string, updates: Partial<Omit<Screen, 'id'>>) => void;
  removeScreen: (id: string) => void;
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (id: string) => void;
  selectScreen: (id: string | null) => void;
  selectComponent: (id: string | null) => void;
  updateScreenPosition: (id: string, position: { x: number, y: number }) => void;
  addComponentToScreen: (screenId: string, component: Omit<Component, 'id'>) => void;
  removeComponentFromScreen: (screenId: string, componentId: string) => void;
  updateComponent: (screenId: string, componentId: string, updates: Partial<Omit<Component, 'id'>>) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const addScreen = useCallback((screen: Omit<Screen, 'id'>) => {
    const newScreen: Screen = {
      ...screen,
      id: `screen_${Date.now()}`,
    };
    setScreens((prev) => [...prev, newScreen]);
  }, []);

  const updateScreen = useCallback((id: string, updates: Partial<Omit<Screen, 'id'>>) => {
    setScreens((prev) =>
      prev.map((screen) => (screen.id === id ? { ...screen, ...updates } : screen))
    );
  }, []);

  const removeScreen = useCallback((id: string) => {
    setScreens((prev) => prev.filter((screen) => screen.id !== id));
    setConnections((prev) => 
      prev.filter((conn) => conn.source !== id && conn.target !== id)
    );
    if (selectedScreenId === id) {
      setSelectedScreenId(null);
    }
  }, [selectedScreenId]);

  const addConnection = useCallback((connection: Omit<Connection, 'id'>) => {
    const newConnection: Connection = {
      ...connection,
      id: `connection_${Date.now()}`,
    };
    setConnections((prev) => [...prev, newConnection]);
  }, []);

  const removeConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  }, []);

  const selectScreen = useCallback((id: string | null) => {
    setSelectedScreenId(id);
    setSelectedComponentId(null);
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const updateScreenPosition = useCallback((id: string, position: { x: number, y: number }) => {
    setScreens((prev) =>
      prev.map((screen) => (screen.id === id ? { ...screen, position } : screen))
    );
  }, []);

  const addComponentToScreen = useCallback((screenId: string, component: Omit<Component, 'id'>) => {
    const newComponent: Component = {
      ...component,
      id: `component_${Date.now()}`,
    };

    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? { ...screen, components: [...screen.components, newComponent] }
          : screen
      )
    );
  }, []);

  const removeComponentFromScreen = useCallback((screenId: string, componentId: string) => {
    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? {
              ...screen,
              components: screen.components.filter(
                (comp) => comp.id !== componentId
              ),
            }
          : screen
      )
    );

    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const updateComponent = useCallback(
    (screenId: string, componentId: string, updates: Partial<Omit<Component, 'id'>>) => {
      setScreens((prev) =>
        prev.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.map((comp) =>
                  comp.id === componentId ? { ...comp, ...updates } : comp
                ),
              }
            : screen
        )
      );
    },
    []
  );

  const value = {
    screens,
    connections,
    selectedScreenId,
    selectedComponentId,
    addScreen,
    updateScreen,
    removeScreen,
    addConnection,
    removeConnection,
    selectScreen,
    selectComponent,
    updateScreenPosition,
    addComponentToScreen,
    removeComponentFromScreen,
    updateComponent,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
