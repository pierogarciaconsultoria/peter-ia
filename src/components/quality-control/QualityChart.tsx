
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Types for the chart component
interface ChartProps {
  type: "bar" | "line" | "pie" | "doughnut";
  data: any;
  options?: any;
}

// A component that wraps Recharts to provide a similar API to Chart.js
export const Chart: React.FC<ChartProps> = ({ type, data, options = {} }) => {
  const COLORS = ["#22c55e", "#ef4444", "#eab308", "#3b82f6", "#8b5cf6", "#ec4899"];
  
  // Helper to get formatted tooltip
  const renderTooltip = (props: any) => {
    const { formatter } = options?.plugins?.tooltip || {};
    
    if (!props.active || !props.payload || !props.payload.length) {
      return null;
    }
    
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{props.label}</p>
        {props.payload.map((entry: any, index: number) => {
          const value = formatter 
            ? formatter(entry.value, entry.name) 
            : entry.value;
          
          return (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {value}
            </p>
          );
        })}
      </div>
    );
  };
  
  // Extract some common options
  const showLegend = options?.plugins?.legend?.display !== false;
  const legendPosition = options?.plugins?.legend?.position || "bottom";
  const aspectRatio = options?.maintainAspectRatio === false ? undefined : options?.aspectRatio || 2;
  
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
        <BarChart
          data={data.datasets[0].data.map((value: any, index: number) => ({
            name: data.labels[index],
            value
          }))}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={renderTooltip} />
          {showLegend && <Legend verticalAlign={legendPosition === "bottom" ? "bottom" : "top"} />}
          <Bar dataKey="value" fill={data.datasets[0].backgroundColor}>
            {data.datasets[0].data.map((_: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={Array.isArray(data.datasets[0].backgroundColor) 
                  ? data.datasets[0].backgroundColor[index] 
                  : data.datasets[0].backgroundColor || COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
        <LineChart
          data={data.labels.map((label: string, index: number) => {
            const dataPoint: any = { name: label };
            data.datasets.forEach((dataset: any, datasetIndex: number) => {
              dataPoint[dataset.label] = dataset.data[index];
            });
            return dataPoint;
          })}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={renderTooltip} />
          {showLegend && <Legend verticalAlign={legendPosition === "bottom" ? "bottom" : "top"} />}
          {data.datasets.map((dataset: any, index: number) => (
            <Line
              key={index}
              type="monotone"
              dataKey={dataset.label}
              stroke={dataset.borderColor || COLORS[index % COLORS.length]}
              activeDot={{ r: 8 }}
              strokeWidth={dataset.borderWidth || 2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
  
  if (type === "pie" || type === "doughnut") {
    const innerRadius = type === "doughnut" ? "60%" : "0%";
    
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
        <PieChart>
          <Pie
            data={data.datasets[0].data.map((value: any, index: number) => ({
              name: data.labels[index],
              value
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.datasets[0].data.map((_: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={Array.isArray(data.datasets[0].backgroundColor) 
                  ? data.datasets[0].backgroundColor[index] 
                  : COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          {showLegend && <Legend verticalAlign={legendPosition === "bottom" ? "bottom" : "top"} />}
        </PieChart>
      </ResponsiveContainer>
    );
  }
  
  // Default fallback
  return <div>Chart type not supported</div>;
};
