"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TeamMember } from "./TeamMemberForm";
import { ThirdPartyService } from "./ThirdPartyServiceForm";

interface MilestonePieChartProps {
  teamMembers: TeamMember[];
  services: ThirdPartyService[];
  teamMemberIds: number[];
  serviceIds: number[];
  durationInDays: number;
}

interface CostData {
  name: string;
  cost: number;
  fill: string;
}

const MilestonePieChart: React.FC<MilestonePieChartProps> = ({
  teamMembers,
  services,
  teamMemberIds,
  serviceIds,
  durationInDays,
}) => {
  // Calculate costs for each team member and service
  const chartData: CostData[] = [
    // Calculate team member costs
    ...teamMemberIds
      .map((id, index) => {
        const member = teamMembers.find((m) => m.id === id);
        if (!member) return null;
        return {
          name: member.name || "Unnamed",
          cost: member.dailyCost * durationInDays,
          fill: `var(--color-chart-${(index % 3) + 1})`, // Use first 3 chart colors for team members
        };
      })
      .filter((item): item is CostData => item !== null),

    // Calculate service costs
    ...serviceIds
      .map((id, index) => {
        const service = services.find((s) => s.id === id);
        if (!service) return null;
        const durationInMonths = Math.ceil(durationInDays / 30);
        return {
          name: service.name || "Unnamed",
          cost: service.monthlyCost * durationInMonths,
          fill: `var(--color-chart-${(index % 2) + 4})`, // Use last 2 chart colors for services
        };
      })
      .filter((item): item is CostData => item !== null),
  ];

  const chartConfig = {
    costs: {
      label: "Costs",
    },
    ...chartData.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: {
          label: item.name,
          color: item.fill,
        },
      }),
      {}
    ),
  } satisfies ChartConfig;

  if (chartData.length === 0) {
    return null;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[200px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="w-[150px]" nameKey="name" />}
        />
        <Pie
          data={chartData}
          dataKey="cost"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="80%"
          fill="#000000"
          isAnimationActive={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default MilestonePieChart;
