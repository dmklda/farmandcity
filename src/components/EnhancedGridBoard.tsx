import React, { useState, useCallback } from 'react';
import { ReactFlow, Node, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './flow-nodes/resize-controls.css';
import backgroundImage from '../assets/grid-board-background.jpg';
import FarmNode from './flow-nodes/FarmNode';
import CityNode from './flow-nodes/CityNode';
import LandmarkNode from './flow-nodes/LandmarkNode';
import EventNode from './flow-nodes/EventNode';

interface GridCell {
  card?: any;
  x: number;
  y: number;
}

interface EnhancedGridBoardProps {
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  eventGrid: GridCell[][];
  farmCount: number;
  farmMax: number;
  cityCount: number;
  cityMax: number;
  eventCount: number;
  eventMax: number;
  landmarkCount: number;
  landmarkMax: number;
  onSelectFarm: (x: number, y: number) => void;
  onSelectCity: (x: number, y: number) => void;
  onSelectEvent: (x: number, y: number) => void;
  highlightFarm: boolean;
  highlightCity: boolean;
  highlightEvent: boolean;
}

const nodeTypes = {
  farm: FarmNode,
  city: CityNode,
  landmark: LandmarkNode,
  event: EventNode,
};

const EnhancedGridBoard: React.FC<EnhancedGridBoardProps> = ({
  farmGrid,
  cityGrid,
  eventGrid,
  farmCount,
  farmMax,
  cityCount,
  cityMax,
  eventCount,
  eventMax,
  landmarkCount,
  landmarkMax,
  onSelectFarm,
  onSelectCity,
  onSelectEvent,
  highlightFarm,
  highlightCity,
  highlightEvent
}) => {
  const initialNodes: Node[] = [
    {
      id: 'farm-node',
      type: 'farm',
      position: { x: 50, y: 50 },
      data: {
        grid: farmGrid,
        count: farmCount,
        max: farmMax,
        onSelectCell: onSelectFarm,
        highlight: highlightFarm
      },
      style: { width: 350, height: 250 }
    },
    {
      id: 'city-node',
      type: 'city',
      position: { x: 450, y: 50 },
      data: {
        grid: cityGrid,
        count: cityCount,
        max: cityMax,
        onSelectCell: onSelectCity,
        highlight: highlightCity
      },
      style: { width: 300, height: 200 }
    },
    {
      id: 'event-node',
      type: 'event',
      position: { x: 50, y: 350 },
      data: {
        eventGrid,
        eventCount,
        eventMax,
        onSelectEvent,
        highlight: highlightEvent
      },
      style: { width: 300, height: 150 }
    },
    {
      id: 'landmark-node',
      type: 'landmark',
      position: { x: 400, y: 350 },
      data: {
        landmarkCount,
        landmarkMax
      },
      style: { width: 250, height: 150 }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update node data when props change
  React.useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === 'farm-node') {
          return {
            ...node,
            data: {
              ...node.data,
              grid: farmGrid,
              count: farmCount,
              max: farmMax,
              onSelectCell: onSelectFarm,
              highlight: highlightFarm
            }
          };
        }
        if (node.id === 'city-node') {
          return {
            ...node,
            data: {
              ...node.data,
              grid: cityGrid,
              count: cityCount,
              max: cityMax,
              onSelectCell: onSelectCity,
              highlight: highlightCity
            }
          };
        }
        if (node.id === 'event-node') {
          return {
            ...node,
            data: {
              ...node.data,
              eventGrid,
              eventCount,
              eventMax,
              onSelectEvent,
              highlight: highlightEvent
            }
          };
        }
        if (node.id === 'landmark-node') {
          return {
            ...node,
            data: {
              ...node.data,
              landmarkCount,
              landmarkMax
            }
          };
        }
        return node;
      })
    );
  }, [farmGrid, cityGrid, eventGrid, farmCount, farmMax, cityCount, cityMax, eventCount, eventMax, landmarkCount, landmarkMax, onSelectFarm, onSelectCity, onSelectEvent, highlightFarm, highlightCity, highlightEvent]);

  return (
    <div 
      className="relative rounded-2xl overflow-hidden h-[600px]"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* ReactFlow Content */}
      <div className="relative z-10 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          style={{ backgroundColor: 'transparent' }}
        >
          <Background color="#ffffff" gap={16} size={1} style={{ opacity: 0.1 }} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default EnhancedGridBoard;