import { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Milk,
  Heart,
  Activity,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const productionReportData = [
  { month: "Jan", milk: 12500, target: 13000, avgPerCow: 29.8 },
  { month: "Feb", milk: 13200, target: 13000, avgPerCow: 31.2 },
  { month: "Mar", milk: 14100, target: 14000, avgPerCow: 32.5 },
];

const healthReportData = [
  { month: "Jan", vaccinations: 45, treatments: 28, checkups: 67 },
  { month: "Feb", vaccinations: 52, treatments: 22, checkups: 71 },
  { month: "Mar", vaccinations: 48, treatments: 25, checkups: 69 },
];

const breedingReportData = [
  { month: "Jan", inseminations: 35, pregnancies: 28, calvings: 30 },
  { month: "Feb", inseminations: 40, pregnancies: 32, calvings: 28 },
  { month: "Mar", inseminations: 38, pregnancies: 30, calvings: 35 },
];

const financialReportData = [
  { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000 },
  { month: "Feb", revenue: 48000, expenses: 29500, profit: 18500 },
  { month: "Mar", revenue: 52000, expenses: 31000, profit: 21000 },
];

const chartConfig = {
  milk: { label: "Milk Production", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-2))" },
  vaccinations: { label: "Vaccinations", color: "hsl(var(--chart-1))" },
  treatments: { label: "Treatments", color: "hsl(var(--chart-2))" },
  checkups: { label: "Checkups", color: "hsl(var(--chart-3))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  profit: { label: "Profit", color: "hsl(var(--chart-3))" },
};

export default function Reports() {
  const [reportType, setReportType] = useState<string>("production");
  const [dateRange, setDateRange] = useState<string>("last-3-months");
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [endDate, setEndDate] = useState<string>("2024-03-31");

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format: string) => {
    // In a real implementation, this would trigger an export
    console.log(`Exporting report as ${format}`);
    alert(`Report exported as ${format}`);
  };

  const reportTypes = [
    {
      id: "production",
      name: "Production Report",
      icon: Milk,
      description: "Milk production analysis and performance metrics",
    },
    {
      id: "health",
      name: "Health Report",
      icon: Activity,
      description: "Veterinary activities and health statistics",
    },
    {
      id: "breeding",
      name: "Breeding Report",
      icon: Heart,
      description: "Breeding performance and pregnancy tracking",
    },
    {
      id: "financial",
      name: "Financial Report",
      icon: DollarSign,
      description: "Revenue, expenses, and profitability analysis",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header - Hidden when printing */}
      <div className="print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Reports & Documentation
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate, customize, and export comprehensive farm reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={() => handleExport("PDF")} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Report Configuration - Hidden when printing */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Report Configuration
          </CardTitle>
          <CardDescription>
            Customize your report parameters and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleExport("PDF")}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export as PDF
            </Button>
            <Button
              onClick={() => handleExport("Excel")}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export as Excel
            </Button>
            <Button
              onClick={() => handleExport("CSV")}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export as CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview - Printable Area */}
      <div className="print:p-8">
        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block mb-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Green Valley Dairy Farm</h1>
            <p className="text-muted-foreground">Farm Report</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="font-semibold">Report Type:</p>
              <p>{reportTypes.find((t) => t.id === reportType)?.name}</p>
            </div>
            <div>
              <p className="font-semibold">Date Range:</p>
              <p>
                {startDate} to {endDate}
              </p>
            </div>
            <div>
              <p className="font-semibold">Generated:</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Generated By:</p>
              <p>John Anderson</p>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>

        {/* Production Report */}
        {reportType === "production" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Production Performance Summary
                </CardTitle>
                <CardDescription>
                  Milk production analysis from {startDate} to {endDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Production
                    </p>
                    <p className="text-2xl font-bold">39,800 L</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +12.5% vs previous period
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Average per Cow
                    </p>
                    <p className="text-2xl font-bold">31.2 L/day</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +8.3% vs target
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Target Achievement
                    </p>
                    <p className="text-2xl font-bold">98.5%</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      Above target
                    </p>
                  </div>
                </div>

                <div className="h-[300px] print:h-[250px]">
                  <h3 className="font-semibold mb-3">
                    Monthly Production Trends
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <BarChart data={productionReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="milk"
                        fill="hsl(var(--chart-1))"
                        name="Milk Production (L)"
                      />
                      <Bar
                        dataKey="target"
                        fill="hsl(var(--chart-2))"
                        name="Target (L)"
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Production Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-2">Month</th>
                        <th className="text-right p-2">Total Production (L)</th>
                        <th className="text-right p-2">Target (L)</th>
                        <th className="text-right p-2">Avg per Cow (L/day)</th>
                        <th className="text-right p-2">Achievement %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionReportData.map((row) => (
                        <tr key={row.month} className="border-b">
                          <td className="p-2">{row.month}</td>
                          <td className="text-right p-2">
                            {row.milk.toLocaleString()}
                          </td>
                          <td className="text-right p-2">
                            {row.target.toLocaleString()}
                          </td>
                          <td className="text-right p-2">{row.avgPerCow}</td>
                          <td className="text-right p-2">
                            {((row.milk / row.target) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Health Report */}
        {reportType === "health" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Health Management Summary
                </CardTitle>
                <CardDescription>
                  Health activities and veterinary statistics from {startDate}{" "}
                  to {endDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Health Events
                    </p>
                    <p className="text-2xl font-bold">387</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all categories
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Vaccinations
                    </p>
                    <p className="text-2xl font-bold">145</p>
                    <p className="text-xs text-green-600 mt-1">
                      100% coverage rate
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Active Treatments
                    </p>
                    <p className="text-2xl font-bold">75</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Currently ongoing
                    </p>
                  </div>
                </div>

                <div className="h-[300px] print:h-[250px]">
                  <h3 className="font-semibold mb-3">
                    Health Activities Trends
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <LineChart data={healthReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="vaccinations"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="Vaccinations"
                      />
                      <Line
                        type="monotone"
                        dataKey="treatments"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Treatments"
                      />
                      <Line
                        type="monotone"
                        dataKey="checkups"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        name="Checkups"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Breeding Report */}
        {reportType === "breeding" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Breeding Performance Summary
                </CardTitle>
                <CardDescription>
                  Breeding activities and success rates from {startDate} to{" "}
                  {endDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Inseminations
                    </p>
                    <p className="text-2xl font-bold">113</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI + Natural breeding
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Confirmed Pregnancies
                    </p>
                    <p className="text-2xl font-bold">90</p>
                    <p className="text-xs text-green-600 mt-1">
                      79.6% success rate
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Calvings
                    </p>
                    <p className="text-2xl font-bold">93</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Healthy births
                    </p>
                  </div>
                </div>

                <div className="h-[300px] print:h-[250px]">
                  <h3 className="font-semibold mb-3">
                    Breeding Performance Trends
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <LineChart data={breedingReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="inseminations"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="Inseminations"
                      />
                      <Line
                        type="monotone"
                        dataKey="pregnancies"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Pregnancies"
                      />
                      <Line
                        type="monotone"
                        dataKey="calvings"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        name="Calvings"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Report */}
        {reportType === "financial" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Financial Performance Summary
                </CardTitle>
                <CardDescription>
                  Revenue, expenses, and profitability from {startDate} to{" "}
                  {endDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">$145,000</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +15.6% vs last period
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold">$88,500</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Feed, vet, labor costs
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-2xl font-bold">$56,500</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      39% profit margin
                    </p>
                  </div>
                </div>

                <div className="h-[300px] print:h-[250px]">
                  <h3 className="font-semibold mb-3">
                    Financial Performance Trends
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <BarChart data={financialReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="hsl(var(--chart-1))"
                        name="Revenue ($)"
                      />
                      <Bar
                        dataKey="expenses"
                        fill="hsl(var(--chart-2))"
                        name="Expenses ($)"
                      />
                      <Bar
                        dataKey="profit"
                        fill="hsl(var(--chart-3))"
                        name="Profit ($)"
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Footer - Only visible when printing */}
        <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>Green Valley Dairy Farm • 1234 Rural Road, Farmville, ST 12345</p>
          <p>Phone No: 0726509023 • Email: contact@greenvalley.farm</p>
          <p className="mt-2">
            Report generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
