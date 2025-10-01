import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const productionData = [
  { month: "Jan", milk: 12500, target: 13000 },
  { month: "Feb", milk: 13200, target: 13000 },
  { month: "Mar", milk: 14100, target: 14000 },
  { month: "Apr", milk: 13800, target: 14000 },
  { month: "May", milk: 15200, target: 15000 },
  { month: "Jun", milk: 15800, target: 15000 },
];

const herdGrowthData = [
  { month: "Jan", total: 420, added: 15, removed: 8 },
  { month: "Feb", total: 427, added: 12, removed: 5 },
  { month: "Mar", total: 434, added: 18, removed: 11 },
  { month: "Apr", total: 441, added: 20, removed: 13 },
  { month: "May", total: 448, added: 16, removed: 9 },
  { month: "Jun", total: 455, added: 14, removed: 7 },
];

const healthEventsData = [
  { name: "Vaccinations", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Treatments", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Check-ups", value: 67, color: "hsl(var(--chart-3))" },
  { name: "Emergencies", value: 12, color: "hsl(var(--chart-4))" },
];

const breedingData = [
  { month: "Jan", inseminations: 35, pregnancies: 28, calvings: 30 },
  { month: "Feb", inseminations: 40, pregnancies: 32, calvings: 28 },
  { month: "Mar", inseminations: 38, pregnancies: 30, calvings: 35 },
  { month: "Apr", inseminations: 42, pregnancies: 34, calvings: 32 },
  { month: "May", inseminations: 45, pregnancies: 36, calvings: 38 },
  { month: "Jun", inseminations: 48, pregnancies: 38, calvings: 36 },
];

const chartConfig = {
  milk: { label: "Milk Production", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-2))" },
  total: { label: "Total Herd", color: "hsl(var(--chart-1))" },
  added: { label: "Added", color: "hsl(var(--chart-3))" },
  removed: { label: "Removed", color: "hsl(var(--chart-4))" },
  inseminations: { label: "Inseminations", color: "hsl(var(--chart-1))" },
  pregnancies: { label: "Pregnancies", color: "hsl(var(--chart-2))" },
  calvings: { label: "Calvings", color: "hsl(var(--chart-3))" },
};

export default function Analytics() {
  const stats = [
    {
      title: "Avg. Milk/Cow/Day",
      value: "32.5L",
      change: "+5.2%",
      trend: "up",
    },
    {
      title: "Herd Growth Rate",
      value: "+8.3%",
      change: "vs last quarter",
      trend: "up",
    },
    {
      title: "Breeding Success",
      value: "79.2%",
      change: "+2.1%",
      trend: "up",
    },
    {
      title: "Health Events",
      value: "152",
      change: "-12.3%",
      trend: "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Advanced analytics and performance insights for your dairy farm
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs flex items-center gap-1 ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="production" className="space-y-6">
        <TabsList>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="herd">Herd Growth</TabsTrigger>
          <TabsTrigger value="breeding">Breeding</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        {/* Production Chart */}
        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Milk Production Trends</CardTitle>
              <CardDescription>
                Monthly milk production vs targets (Liters)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <AreaChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="milk"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                    name="Milk Production"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                    name="Target"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Herd Growth Chart */}
        <TabsContent value="herd">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Herd Growth Analytics</CardTitle>
                <CardDescription>
                  Track total herd size and changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                >
                  <LineChart data={herdGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Total Herd"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Herd Changes</CardTitle>
                <CardDescription>
                  Animals added vs removed monthly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <BarChart data={herdGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="added"
                      fill="hsl(var(--chart-3))"
                      name="Added"
                    />
                    <Bar
                      dataKey="removed"
                      fill="hsl(var(--chart-4))"
                      name="Removed"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Breeding Chart */}
        <TabsContent value="breeding">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Performance</CardTitle>
              <CardDescription>
                Track inseminations, pregnancies, and calvings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart data={breedingData}>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Chart */}
        <TabsContent value="health">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Health Events Distribution</CardTitle>
                <CardDescription>
                  Breakdown of health-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <PieChart>
                    <Pie
                      data={healthEventsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {healthEventsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Event Summary</CardTitle>
                <CardDescription>
                  Total events in the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthEventsData.map((event) => (
                    <div
                      key={event.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="font-medium">{event.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{event.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
