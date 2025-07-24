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
import { BookOpen } from "lucide-react";
import { getMonthNames } from "@/constants/Helper";

function IssuedBooksChart({ issuedBooksData }) {
  const chartConfig = {
    books: {
      label: "Books Issued",
      dataKey: "books",
      color: "#265cfc",
    },
  };

  const transformedData = issuedBooksData.map((item) => ({
    ...item,
    monthName: getMonthNames(item.month).slice(0, 3),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Monthly Issued Books
        </CardTitle>
        <CardDescription>
          Overview of books issued each month over the past 6 months.
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
            dataKey={chartConfig.books.dataKey}
            fill={chartConfig.books.color}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

export default IssuedBooksChart;
