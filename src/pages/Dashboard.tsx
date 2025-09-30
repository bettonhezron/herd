import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Circle,
  Droplets,
  Heart,
  Activity,
  TrendingUp,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import farmHero from "@/assets/farm-hero.jpg";

// Sample data
const milkProductionData = [
  { month: "Jan", production: 2400 },
  { month: "Feb", production: 2600 },
  { month: "Mar", production: 2800 },
  { month: "Apr", production: 3200 },
  { month: "May", production: 3600 },
  { month: "Jun", production: 3400 },
  // { month: "Jul", production: 3200 },
  // { month: "Aug", production: 4000 },
  // { month: "Sep", production: 3800 },
  // { month: "Oct", production: 3700 },
  // { month: "Nov", production: 4200 },
  // { month: "Dec", production: 3500 },
];

const milkProductionDataWeek = [
  { month: "Mon", production: 2400 },
  { month: "Tue", production: 2600 },
  { month: "Wed", production: 2800 },
  { month: "Thur", production: 3200 },
  { month: "Fri", production: 3600 },
  { month: "Sat", production: 3400 },
  { month: "Sun", production: 3200 },
];

const herdHealthData = [
  { name: "Healthy", value: 85, color: "hsl(var(--health-good))" },
  { name: "Needs Attention", value: 12, color: "hsl(var(--health-warning))" },
  { name: "Critical", value: 3, color: "hsl(var(--health-critical))" },
];

const recentAlerts = [
  {
    id: 1,
    type: "health",
    message: "Cow #247 vaccination due",
    priority: "medium",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "breeding",
    message: "Cow #156 expected calving tomorrow",
    priority: "high",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "milking",
    message: "Production drop in Barn 2",
    priority: "medium",
    time: "6 hours ago",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={farmHero}
          alt="Modern dairy farm with green pastures and Holstein cows"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center">
          <div className="px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Dairy Farm
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Monitor your herds, milk production, and farm performance metrics
            </p>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add Animal
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome back, Farm Manager!
        </h2>
        <p className="text-muted-foreground">
          Here's your farm overview for today. Everything is running smoothly
          with 92% of your herd in good health.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Animals
            </CardTitle>
            <Circle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">247</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Milk Production
            </CardTitle>
            <Droplets className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3,642L</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Breeding Program
            </CardTitle>
            <Heart className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23</div>
            <p className="text-xs text-muted-foreground">
              Expecting calves this month
            </p>
            <Progress value={76} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-health-good">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Status
            </CardTitle>
            <Activity className="h-4 w-4 text-health-good" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">92%</div>
            <p className="text-xs text-success">Healthy animals</p>
            <div className="flex gap-1 mt-2">
              <Badge
                variant="outline"
                className="text-xs bg-health-good/10 text-health-good border-health-good/20"
              >
                210 Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milk Production Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Milk Production OverTime
            </CardTitle>
            <CardDescription>
              Daily production over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={milkProductionData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="production"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Herd Health Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Herd Health Distribution
            </CardTitle>
            <CardDescription>
              Current health status of all animals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={herdHealthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {herdHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Recent Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Important events requiring your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.priority === "high"
                        ? "bg-health-critical"
                        : alert.priority === "medium"
                        ? "bg-health-warning"
                        : "bg-health-good"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {alert.message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
