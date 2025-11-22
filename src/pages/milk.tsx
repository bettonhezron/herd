import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit3,
  Trash2,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddMilkingModal } from "@/components/modals/AddMilking";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import {
  useMilkingRecordsByDate,
  useDailyMilkingStats,
  useCowMilkingSummaries,
  useDeleteMilkingRecord,
} from "@/hooks/useMilking";
import {
  MilkingRecordResponse,
  MilkingShift,
  SHIFT_OPTIONS,
} from "@/types/milking";

import { SiGooglecalendar } from "react-icons/si";
import { GiMilkCarton } from "react-icons/gi";
import { GiCow } from "react-icons/gi";

const PAGE_SIZE = 10;

const getShiftBadge = (shift: MilkingShift) => {
  const config = {
    MORNING: {
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: "☀️",
    },
    AFTERNOON: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "🌤️",
    },
    EVENING: {
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: "🌙",
    },
  };

  const { color, icon } = config[shift];
  return (
    <Badge className={`${color} border gap-1`}>
      <span>{icon}</span>
      {shift}
    </Badge>
  );
};

const getTrendBadge = (trend: string) => {
  const config = {
    INCREASING: { color: "bg-green-100 text-green-700", icon: TrendingUp },
    DECREASING: { color: "bg-red-100 text-red-700", icon: TrendingDown },
    STABLE: { color: "bg-gray-100 text-gray-700", icon: Minus },
  };

  const { color, icon: Icon } = config[trend] || config.STABLE;
  return (
    <Badge className={color}>
      <Icon className="w-3 h-3 mr-1" />
      {trend}
    </Badge>
  );
};

export default function Milking() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("records");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<MilkingRecordResponse | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<MilkingRecordResponse | null>(null);

  const { data: records = [], isLoading: recordsLoading } =
    useMilkingRecordsByDate(selectedDate);
  const { data: stats } = useDailyMilkingStats(selectedDate);
  const { data: summaries = [] } = useCowMilkingSummaries(selectedDate);
  const deleteMutation = useDeleteMilkingRecord();

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.animalName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesShift =
        shiftFilter === "all" || record.shift === shiftFilter;
      return matchesSearch && matchesShift;
    });
  }, [records, searchTerm, shiftFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  const paginatedRecords = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [filteredRecords, currentPage]);

  const handleDelete = () => {
    if (!recordToDelete?.id) return;
    deleteMutation.mutate(recordToDelete.id);
    setDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  const exportData = () => {
    const csv = [
      ["Date", "Tag", "Name", "Shift", "Quantity (L)", "Recorded By"],
      ...filteredRecords.map((r) => [
        r.milkingDate,
        r.animalTag,
        r.animalName || "-",
        r.shift,
        r.quantity,
        r.recordedBy,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `milking-records-${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            Milking Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Monitor milk production, quality, and milking schedules
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
            max={new Date().toISOString().split("T")[0]}
          />
          <Button
            onClick={() => setAddModalOpen(true)}
            className="gap-2 px-3 py-2 text-sm sm:text-base bg-primary hover:bg-primary-hover"
          >
            <Plus className="w-4 h-4" />
            Record Milking
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Milk</CardTitle>
            <GiMilkCarton className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalMilkProduced.toFixed(1) || 0} L
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {stats?.averageMilkPerCow.toFixed(1) || 0} L/cow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cows Milked</CardTitle>
            <GiCow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCowsMilked || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeLactatingCows || 0} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">By Shift</CardTitle>
            <SiGooglecalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">☀️ Morning:</span>
                <span className="font-medium">
                  {stats?.morningMilk.toFixed(1) || 0} L
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">🌤️ Afternoon:</span>
                <span className="font-medium">
                  {stats?.afternoonMilk.toFixed(1) || 0} L
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">🌙 Evening:</span>
                <span className="font-medium">
                  {stats?.eveningMilk.toFixed(1) || 0} L
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Milked</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats?.cowsNotMilkedToday || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cows need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">Milking Records</TabsTrigger>
          <TabsTrigger value="performance">Cow Performance</TabsTrigger>
        </TabsList>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Daily Records</CardTitle>
                  <CardDescription>
                    All milking sessions for{" "}
                    {new Date(selectedDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={exportData}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by tag or name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={shiftFilter} onValueChange={setShiftFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    {SHIFT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Quantity (L)</TableHead>
                      <TableHead>Days in Milk</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recordsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Loading records...
                        </TableCell>
                      </TableRow>
                    ) : paginatedRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No milking records found for this date.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.animalTag}</p>
                              {record.animalName && (
                                <p className="text-sm text-muted-foreground">
                                  {record.animalName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getShiftBadge(record.shift)}</TableCell>
                          <TableCell className="font-medium">
                            {record.quantity.toFixed(1)} L
                          </TableCell>
                          <TableCell>
                            {record.daysInMilk
                              ? `${record.daysInMilk} days`
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {record.lactationStage || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {record.recordedBy}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingRecord(record)}
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit Record
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setRecordToDelete(record);
                                    setDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!recordsLoading && totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedRecords.length} of{" "}
                    {filteredRecords.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    <span className="text-sm font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cow Performance Analysis</CardTitle>
              <CardDescription>
                Individual cow production trends and analytics
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Days in Milk</TableHead>
                      <TableHead>Today</TableHead>
                      <TableHead>7-Day Avg</TableHead>
                      <TableHead>30-Day Avg</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Last Milked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No performance data available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      summaries.map((summary) => (
                        <TableRow key={summary.animalId}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{summary.tagNumber}</p>
                              {summary.name && (
                                <p className="text-sm text-muted-foreground">
                                  {summary.name}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {summary.daysInMilk
                              ? `${summary.daysInMilk} days`
                              : "—"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {summary.todayTotal.toFixed(1)} L
                          </TableCell>
                          <TableCell>
                            {summary.weekAverage.toFixed(1)} L
                          </TableCell>
                          <TableCell>
                            {summary.monthAverage.toFixed(1)} L
                          </TableCell>
                          <TableCell>{getTrendBadge(summary.trend)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {summary.lastMilked
                              ? new Date(
                                  summary.lastMilked
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddMilkingModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      <AddMilkingModal
        open={!!editingRecord}
        onOpenChange={(open) => !open && setEditingRecord(null)}
        editData={
          editingRecord
            ? {
                id: editingRecord.id,
                animalId: editingRecord.animalId,
                animalTag: editingRecord.animalTag,
                milkingDate: editingRecord.milkingDate,
                shift: editingRecord.shift,
                quantity: editingRecord.quantity,
                remarks: editingRecord.remarks,
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Milking Record"
        description={`Are you sure you want to delete this milking record for ${recordToDelete?.animalTag}? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
