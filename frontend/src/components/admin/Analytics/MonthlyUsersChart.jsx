import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Users } from "lucide-react";
import { getMonthNames } from "@/constants/Helper";

function MonthlyUsersChart({ activeUsersData }) {
  const chartConfig = {
    users: {
      label: "Active Users",
      dataKey: "users",
      color: "#00B7D9",
    },
  };

  const transformedData = activeUsersData.map((item) => ({
    ...item,
    monthName: getMonthNames(item.month).slice(0, 3),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Monthly Active Users
        </CardTitle>
        <CardDescription>
          Overview of Active Users each month over the past 6 months.
        </CardDescription>
      </CardHeader>

      <ChartContainer config={chartConfig} className="h-80">
        <BarChart data={transformedData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="monthName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey={chartConfig.users.dataKey}
            fill={chartConfig.users.color}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

export default MonthlyUsersChart;
