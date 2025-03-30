
import React from "react";
import { Card } from "@/components/ui/card";
import ReactFlow, { 
  Node as FlowNode, 
  Edge, 
  ReactFlowProvider, 
  useNodesState, 
  useEdgesState,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDepartments } from "@/hooks/useDepartments";

interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
  parentPosition?: string | null;
  isDepartmentHead?: boolean;
}

interface DepartmentOrgChartProps {
  positions: Position[];
}

interface OrgChartNode extends FlowNode {
  data: {
    label: string;
    department?: string;
    isDepartmentHead?: boolean;
  };
}

const nodeTypes = {
  department: ({ data }: { data: { label: string, department?: string, isDepartmentHead?: boolean } }) => (
    <div className={`px-4 py-2 shadow-md rounded-md border ${data.isDepartmentHead ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="font-bold">{data.label}</div>
      {data.department && <div className="text-xs text-gray-500">{data.department}</div>}
    </div>
  ),
};

function DepartmentOrgChartContent({ positions }: DepartmentOrgChartProps) {
  const { departments: orgDepartments } = useDepartments();
  
  // Group positions by department for more organized layout
  const departmentGroups = React.useMemo(() => {
    const deptMap = new Map<string, Position[]>();
    
    positions.forEach(pos => {
      if (!deptMap.has(pos.department)) {
        deptMap.set(pos.department, []);
      }
      deptMap.get(pos.department)?.push(pos);
    });
    
    return Array.from(deptMap.entries());
  }, [positions]);
  
  // Create nodes and edges for the org chart
  const { nodes: initialNodes, edges: initialEdges } = React.useMemo(() => {
    const nodes: OrgChartNode[] = [];
    const edges: Edge[] = [];
    let xOffset = 0;
    
    departmentGroups.forEach(([deptName, deptPositions], deptIndex) => {
      // Sort positions by level (Senior -> Pleno -> Junior)
      const sortedPositions = [...deptPositions].sort((a, b) => {
        const levelOrder = { "Senior": 0, "Pleno": 1, "Junior": 2 };
        const aLevel = a.level as keyof typeof levelOrder;
        const bLevel = b.level as keyof typeof levelOrder;
        return (levelOrder[aLevel] || 3) - (levelOrder[bLevel] || 3);
      });
      
      // Calculate vertical positioning based on hierarchy
      const yGap = 100;
      
      // Add nodes for each position in the department
      sortedPositions.forEach((position, index) => {
        nodes.push({
          id: position.id,
          type: 'department',
          position: { 
            x: xOffset + (deptIndex * 300), 
            y: index * yGap 
          },
          data: { 
            label: position.title, 
            department: position.department,
            isDepartmentHead: position.isDepartmentHead
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
        
        // Add edge from parent to this position
        if (position.parentPosition) {
          edges.push({
            id: `e${position.parentPosition}-${position.id}`,
            source: position.parentPosition,
            target: position.id,
            type: 'smoothstep',
          });
        }
      });
      
      // Increment x offset for next department
      xOffset += 300;
    });
    
    return { nodes, edges };
  }, [departmentGroups]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes and edges when positions change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  return (
    <div style={{ height: 500 }}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      />
    </div>
  );
}

export function DepartmentOrgChart(props: DepartmentOrgChartProps) {
  return (
    <Card className="p-0">
      <ReactFlowProvider>
        <DepartmentOrgChartContent {...props} />
      </ReactFlowProvider>
    </Card>
  );
}
