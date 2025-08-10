// src/components/ThreeDChart.tsx
import dynamic from "next/dynamic";
import { useMemo } from "react";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ThreeDChart({
  x = [1,2,3,4,5],
  y = [0.1,0.2,0.3,0.4,0.5],
  z = [[3,4,2,5,3],[2,3,1,4,2],[3,4,2,5,3],[2,3,1,4,2],[3,4,2,5,3]],
  title = "Inventory Quality Metrics",
  subtitle = "Ad-to-Content Ratio: 0.12335 avg",
}: {
  x?: number[];
  y?: number[];
  z?: number[][];
  title?: string;
  subtitle?: string;
}) {
  const data = useMemo(() => ([
    {
      type: "surface",
      x, y, z,
      colorscale: [
        [0, "rgb(10, 30, 20)"],
        [0.5, "rgb(0, 180, 90)"],
        [1, "rgb(64, 255, 147)"],
      ],
      showscale: false,
      opacity: 0.95,
    },
    // glowing markers like the screenshot
    {
      type: "scatter3d",
      mode: "markers",
      x: x.flatMap(xi => Array(y.length).fill(xi)),
      y: y.reduce((arr, yi) => arr.concat(Array(x.length).fill(yi)), [] as number[]),
      z: z.flat(),
      marker: {
        size: 6,
        color: "rgb(64,255,147)",
        opacity: 0.9,
        line: { width: 2, color: "rgba(64,255,147,.6)" },
      },
    },
  ]), [x, y, z]);

  const layout: Partial<Plotly.Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 0, r: 0, b: 0, t: 0 },
    scene: {
      xaxis: { color: "#9fb0c6", gridcolor: "rgba(150,170,200,.12)", zerolinecolor: "rgba(150,170,200,.25)" },
      yaxis: { color: "#9fb0c6", gridcolor: "rgba(150,170,200,.12)", zerolinecolor: "rgba(150,170,200,.25)" },
      zaxis: { color: "#9fb0c6", gridcolor: "rgba(150,170,200,.12)", zerolinecolor: "rgba(150,170,200,.25)" },
      camera: { eye: { x: 1.6, y: -1.2, z: 1.2 } },
      bgcolor: "rgba(0,0,0,0)",
    },
  };

  return (
    <div className="card-glass p-4">
      <div className="px-2 pb-2">
        <div className="text-xl font-semibold">Inventory Quality <span className="text-muted-foreground">Metrics</span></div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
      <Plot data={data as any} layout={layout} style={{ width: "100%", height: 420 }} config={{ displayModeBar: false }}/>
    </div>
  );
}