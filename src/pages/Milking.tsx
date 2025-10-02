import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Download,
  Filter,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AddMilkingModal } from "@/components/modals/AddMilking";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

interface MilkingRecord {
  id: string;
  animalId: string;
  animalName: string;
  animalTag: string;
  date: string;
  time: string;
  quantity: number;
  fat: number;
  protein: number;
  scc: number;
  temperature: number;
  quality: "excellent" | "good" | "fair" | "poor";
  session: "morning" | "evening";
}

const mockMilkingData: MilkingRecord[] = [
  {
    id: "1",
    animalId: "A001",
    animalName: "Bessie",
    animalTag: "001",
    date: "2024-01-15",
    time: "06:30",
    quantity: 28.5,
    fat: 3.8,
    protein: 3.2,
    scc: 150000,
    temperature: 37.2,
    quality: "excellent",
    session: "morning",
  },
  {
    id: "2",
    animalId: "A002",
    animalName: "Daisy",
    animalTag: "002",
    date: "2024-01-15",
    time: "06:35",
    quantity: 32.1,
    fat: 4.1,
    protein: 3.4,
    scc: 180000,
    temperature: 37.5,
    quality: "excellent",
    session: "morning",
  },
  {
    id: "3",
    animalId: "A003",
    animalName: "Luna",
    animalTag: "003",
    date: "2024-01-15",
    time: "06:40",
    quantity: 25.8,
    fat: 3.6,
    protein: 3.1,
    scc: 220000,
    temperature: 37.8,
    quality: "good",
    session: "morning",
  },
  {
    id: "4",
    animalId: "A004",
    animalName: "Stella",
    animalTag: "004",
    date: "2024-01-15",
    time: "18:30",
    quantity: 26.4,
    fat: 3.9,
    protein: 3.3,
    scc: 320000,
    temperature: 38.1,
    quality: "fair",
    session: "evening",
  },
  {
    id: "5",
    animalId: "A005",
    animalName: "Rose",
    animalTag: "005",
    date: "2024-01-15",
    time: "18:35",
    quantity: 29.7,
    fat: 4.0,
    protein: 3.5,
    scc: 450000,
    temperature: 38.5,
    quality: "poor",
    session: "evening",
  },
];

const productionData = [
  { day: "Mon", morning: 245, evening: 232 },
  { day: "Tue", morning: 258, evening: 241 },
  { day: "Wed", morning: 251, evening: 238 },
  { day: "Thu", morning: 264, evening: 249 },
  { day: "Fri", morning: 249, evening: 235 },
  { day: "Sat", morning: 267, evening: 253 },
  { day: "Sun", morning: 242, evening: 229 },
];

const qualityTrendData = [
  { date: "Jan 10", avgFat: 3.7, avgProtein: 3.2, avgSCC: 185000 },
  { date: "Jan 11", avgFat: 3.8, avgProtein: 3.3, avgSCC: 195000 },
  { date: "Jan 12", avgFat: 3.9, avgProtein: 3.1, avgSCC: 175000 },
  { date: "Jan 13", avgFat: 3.6, avgProtein: 3.4, avgSCC: 210000 },
  { date: "Jan 14", avgFat: 3.8, avgProtein: 3.2, avgSCC: 180000 },
  { date: "Jan 15", avgFat: 3.9, avgProtein: 3.3, avgSCC: 264000 },
];

const getQualityColor = (quality: string) => {
  switch (quality) {
    case "excellent":
      return "text-green-600 bg-green-50 border-green-200";
    case "good":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "fair":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "poor":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getSessionColor = (session: string) => {
  return session === "morning"
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-indigo-600 bg-indigo-50 border-indigo-200";
};

export default function Milking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MilkingRecord | null>(
    null
  );

  const filteredRecords = mockMilkingData.filter((record) => {
    const matchesSearch =
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSession =
      selectedSession === "all" || record.session === selectedSession;
    const matchesQuality =
      selectedQuality === "all" || record.quality === selectedQuality;

    return matchesSearch && matchesSession && matchesQuality;
  });

  const totalQuantity = mockMilkingData.reduce(
    (sum, record) => sum + record.quantity,
    0
  );
  const avgFat =
    mockMilkingData.reduce((sum, record) => sum + record.fat, 0) /
    mockMilkingData.length;
  const avgProtein =
    mockMilkingData.reduce((sum, record) => sum + record.protein, 0) /
    mockMilkingData.length;
  const avgSCC =
    mockMilkingData.reduce((sum, record) => sum + record.scc, 0) /
    mockMilkingData.length;

  const stats = [
    {
      title: "Total Production",
      value: `${totalQuantity.toFixed(1)}L`,
      change: "+5.2% from yesterday",
    },
    {
      title: "Average Fat %",
      value: `${avgFat.toFixed(2)}%`,
      change: "Within target range",
    },
    {
      title: "Average Protein %",
      value: `${avgProtein.toFixed(2)}%`,
      change: "+0.1% from last week",
    },
    {
      title: "Average SCC",
      value: `${(avgSCC / 1000).toFixed(0)}K`,
      change: "2 alerts need attention",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Milking Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Monitor milk production, quality, and milking schedules
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            className="gap-2 px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Record Milking
          </Button>

          <Button
            variant="outline"
            className="gap-2 px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Production (Liters)</CardTitle>
            <CardDescription>
              Morning vs Evening milking sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                morning: { label: "Morning", color: "hsl(var(--chart-1))" },
                evening: { label: "Evening", color: "hsl(var(--chart-3))" },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productionData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="morning" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="evening" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Trends</CardTitle>
            <CardDescription>
              Fat %, Protein %, and SCC over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgFat: { label: "Fat %", color: "hsl(var(--primary))" },
                avgProtein: {
                  label: "Protein %",
                  color: "hsl(var(--secondary))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={qualityTrendData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="avgFat"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgProtein"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Milking Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Milking Records</CardTitle>
          <CardDescription>
            Track individual animal milk production and quality metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by animal name or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Sessions</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Quality</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Fat %</TableHead>
                  <TableHead>Protein %</TableHead>
                  <TableHead>SCC</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.animalName}</p>
                        <p className="text-sm text-muted-foreground">
                          Tag: {record.animalTag}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.time}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getSessionColor(record.session)}
                      >
                        {record.session === "morning" ? (
                          <Calendar className="w-3 h-3 mr-1" />
                        ) : (
                          <Calendar className="w-3 h-3 mr-1" />
                        )}
                        {record.session.charAt(0).toUpperCase() +
                          record.session.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.quantity}L
                    </TableCell>
                    <TableCell>{record.fat}%</TableCell>
                    <TableCell>{record.protein}%</TableCell>
                    <TableCell>
                      <span
                        className={
                          record.scc > 400000 ? "text-red-600 font-medium" : ""
                        }
                      >
                        {(record.scc / 1000).toFixed(0)}K
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getQualityColor(record.quality)}
                      >
                        {record.quality.charAt(0).toUpperCase() +
                          record.quality.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No milking records found matching your search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddMilkingModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <AddMilkingModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editData={selectedRecord || undefined}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Milking Record"
        description="Are you sure you want to delete this milking record?"
      />
    </div>
  );
}
