"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Import the types from the original components
import { TeamMember } from "./TeamMemberForm";
import { ThirdPartyService } from "./ThirdPartyServiceForm";
import { Milestone } from "./MilestoneForm";

interface BudgetDailyChartProps {
  teamMembers: TeamMember[];
  thirdPartyServices: ThirdPartyService[];
  milestones: Milestone[];
}

interface DailyCostData {
  date: string;
  teamCost: number;
  serviceCost: number;
}

const BudgetDailyChart: React.FC<BudgetDailyChartProps> = ({
  teamMembers,
  thirdPartyServices,
  milestones,
}) => {
  // Generate daily cost data
  const [chartData, setChartData] = React.useState<DailyCostData[]>([]);
  const [activeChart, setActiveChart] = React.useState<
    "teamCost" | "serviceCost"
  >("teamCost");

  React.useEffect(() => {
    if (milestones.length === 0 || teamMembers.length === 0) {
      return;
    }

    // Find the earliest start date and latest end date across all milestones
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    milestones.forEach((milestone) => {
      if (milestone.dateRange?.from && milestone.dateRange?.to) {
        const startDate = new Date(milestone.dateRange.from);
        const endDate = new Date(milestone.dateRange.to);

        if (!earliestDate || startDate < earliestDate) {
          earliestDate = startDate;
        }

        if (!latestDate || endDate > latestDate) {
          latestDate = endDate;
        }
      }
    });

    if (!earliestDate || !latestDate) {
      return;
    }

    // Create a map of dates to costs
    const dailyCostsMap = new Map<
      string,
      { teamCost: number; serviceCost: number }
    >();

    // Initialize the map with all dates in the range
    const currentDate = new Date(earliestDate);
    const endDate = new Date(latestDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      dailyCostsMap.set(dateString, { teamCost: 0, serviceCost: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate daily costs for each milestone
    milestones.forEach((milestone) => {
      if (!milestone.dateRange?.from || !milestone.dateRange?.to) {
        return;
      }

      const startDate = new Date(milestone.dateRange.from);
      const endDate = new Date(milestone.dateRange.to);

      // Calculate daily team cost for this milestone
      let dailyTeamCost = 0;
      milestone.teamMemberIds.forEach((memberId) => {
        const member = teamMembers.find((m) => m.id === memberId);
        if (member) {
          dailyTeamCost += member.dailyCost;
        }
      });

      // Calculate daily service cost for this milestone (approximated from monthly)
      let dailyServiceCost = 0;
      milestone.serviceIds.forEach((serviceId) => {
        const service = thirdPartyServices.find((s) => s.id === serviceId);
        if (service) {
          dailyServiceCost += service.monthlyCost / 30; // Approximate daily cost
        }
      });

      // Add costs to each day in the milestone
      const milestoneCurrentDate = new Date(startDate);
      const milestoneEndDate = new Date(endDate);
      while (milestoneCurrentDate <= milestoneEndDate) {
        const dateString = milestoneCurrentDate.toISOString().split("T")[0];
        const existingCosts = dailyCostsMap.get(dateString) || {
          teamCost: 0,
          serviceCost: 0,
        };

        dailyCostsMap.set(dateString, {
          teamCost: existingCosts.teamCost + dailyTeamCost,
          serviceCost: existingCosts.serviceCost + dailyServiceCost,
        });

        milestoneCurrentDate.setDate(milestoneCurrentDate.getDate() + 1);
      }
    });

    // Convert map to array for chart data
    const chartDataArray: DailyCostData[] = Array.from(
      dailyCostsMap.entries()
    ).map(([date, costs]) => ({
      date,
      teamCost: Math.round(costs.teamCost),
      serviceCost: Math.round(costs.serviceCost),
    }));

    setChartData(chartDataArray);
  }, [milestones, teamMembers, thirdPartyServices]);

  const chartConfig = {
    costs: {
      label: "Daily Costs",
    },
    teamCost: {
      label: "Team Cost",
      color: "hsl(var(--chart-1))",
    },
    serviceCost: {
      label: "Service Cost",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const total = React.useMemo(
    () => ({
      teamCost: chartData.reduce((acc, curr) => acc + curr.teamCost, 0),
      serviceCost: chartData.reduce((acc, curr) => acc + curr.serviceCost, 0),
    }),
    [chartData]
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Daily Budget Breakdown</CardTitle>
          <CardDescription>
            Showing daily costs throughout the project timeline
          </CardDescription>
        </div>
        <div className="flex">
          {["teamCost", "serviceCost"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() =>
                  setActiveChart(chart as "teamCost" | "serviceCost")
                }
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ${total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  nameKey="costs"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetDailyChart;
