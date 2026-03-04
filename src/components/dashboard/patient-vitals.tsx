"use client";

import { TrendingUp } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { time: "12:00", heartRate: 72, temp: 36.8, oxygen: 98, bp: 120 },
  { time: "13:00", heartRate: 75, temp: 36.9, oxygen: 98, bp: 122 },
  { time: "14:00", heartRate: 80, temp: 37.0, oxygen: 97, bp: 118 },
  { time: "15:00", heartRate: 78, temp: 36.8, oxygen: 99, bp: 125 },
  { time: "16:00", heartRate: 82, temp: 37.1, oxygen: 97, bp: 123 },
  { time: "17:00", heartRate: 79, temp: 36.9, oxygen: 98, bp: 121 },
];

const chartConfigs = {
  heartRate: {
    label: "Heart Rate (bpm)",
    color: "hsl(var(--chart-1))",
  },
  temp: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-2))",
  },
  oxygen: {
    label: "Oxygen Sat. (%)",
    color: "hsl(var(--chart-3))",
  },
  bp: {
    label: "Systolic BP (mmHg)",
    color: "hsl(var(--chart-4))",
  }
};

type VitalKey = keyof typeof chartConfigs;

function VitalChart({ vital, title }: { vital: VitalKey, title: string }) {
  const config: ChartConfig = {
    [vital]: chartConfigs[vital]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Last 6 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              hide
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey={vital}
              type="monotone"
              stroke={chartConfigs[vital].color}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Patient: John Doe
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function PatientVitals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Real-time Patient Vitals</CardTitle>
        <CardDescription>Continuous monitoring from smart medical devices.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <VitalChart vital="heartRate" title="Heart Rate" />
        <VitalChart vital="bp" title="Blood Pressure" />
        <VitalChart vital="temp" title="Temperature" />
        <VitalChart vital="oxygen" title="Oxygen Saturation" />
      </CardContent>
    </Card>
  );
}
