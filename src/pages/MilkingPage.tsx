import { useState, useMemo } from "react";
import {
  useDailyMilkingStats,
  useCowMilkingSummaries,
  useMilkingRecordsByDate,
  useCowsNotMilked,
  useDeleteMilkingRecord,
} from "@/hooks/useMilking";
import {
  MilkingRecordResponse,
  MilkingShift,
  SHIFT_OPTIONS,
} from "@/types/milking";
import { AddMilkingModal } from "@/components/modals/AddMilking";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Milk,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Search,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Loader2,
  RefreshCw,
} from "lucide-react";

// Helper to get current shift based on time
const getCurrentShift = (): MilkingShift => {
  const hour = new Date().getHours();
  if (hour < 12) return MilkingShift.MORNING;
  if (hour < 17) return MilkingShift.AFTERNOON;
  return MilkingShift.EVENING;
};

// Shift icon component
const ShiftIcon = ({
  shift,
  className,
}: {
  shift: MilkingShift;
  className?: string;
}) => {
  switch (shift) {
    case MilkingShift.MORNING:
      return <Sun className={className} />;
    case MilkingShift.AFTERNOON:
      return <Sunset className={className} />;
    case MilkingShift.EVENING:
      return <Moon className={className} />;
  }
};

// Trend icon component
const TrendIcon = ({
  trend,
}: {
  trend: "INCREASING" | "STABLE" | "DECREASING";
}) => {
  switch (trend) {
    case "INCREASING":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "DECREASING":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
};

export default function MilkingPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedShift, setSelectedShift] = useState<MilkingShift | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<
    MilkingRecordResponse | undefined
  >();
  const [deleteRecord, setDeleteRecord] =
    useState<MilkingRecordResponse | null>(null);

  // Queries
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDailyMilkingStats(selectedDate);
  const { data: summaries, isLoading: summariesLoading } =
    useCowMilkingSummaries(selectedDate);
  const {
    data: records,
    isLoading: recordsLoading,
    refetch: refetchRecords,
  } = useMilkingRecordsByDate(selectedDate);
  const { data: cowsNotMilked, isLoading: notMilkedLoading } = useCowsNotMilked(
    getCurrentShift()
  );
  const deleteMutation = useDeleteMilkingRecord();

  // Filter records by shift and search
  const filteredRecords = useMemo(() => {
    if (!records) return [];
    return records.filter((record) => {
      const matchesShift =
        selectedShift === "ALL" || record.shift === selectedShift;
      const matchesSearch =
        !searchQuery ||
        record.animalTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.animalName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesShift && matchesSearch;
    });
  }, [records, selectedShift, searchQuery]);

  // Handlers
  const handleAddNew = () => {
    setEditRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (record: MilkingRecordResponse) => {
    setEditRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;
    await deleteMutation.mutateAsync(deleteRecord.id);
    setDeleteRecord(null);
  };

  const handleRefresh = () => {
    refetchStats();
    refetchRecords();
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Milk Records</h1>
          <p className="text-muted-foreground">
            Track and manage daily milking sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Record Milking
          </Button>
        </div>
      </div>

      {/* Cows Not Milked Alert */}
      {isToday && cowsNotMilked && cowsNotMilked.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-orange-800 dark:text-orange-200">
                {cowsNotMilked.length} cow{cowsNotMilked.length > 1 ? "s" : ""}{" "}
                not milked this {getCurrentShift().toLowerCase()} shift
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {cowsNotMilked
                  .slice(0, 5)
                  .map((c) => c.animalTag)
                  .join(", ")}
                {cowsNotMilked.length > 5 &&
                  ` +${cowsNotMilked.length - 5} more`}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={handleAddNew}
            >
              Record Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Date Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
        {!isToday && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSelectedDate(new Date().toISOString().split("T")[0])
            }
          >
            Today
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Milk</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats?.totalMilkProduced.toFixed(1) || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    L
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg {stats?.averageMilkPerCow.toFixed(1) || 0}L per cow
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cows Milked</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats?.totalCowsMilked || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {stats?.activeLactatingCows || 0}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.cowsNotMilkedToday || 0} not milked today
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Morning / Afternoon</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats?.morningMilk.toFixed(1) || 0}
                  <span className="text-sm font-normal text-muted-foreground mx-1">
                    /
                  </span>
                  {stats?.afternoonMilk.toFixed(1) || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    L
                  </span>
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sun className="h-3 w-3" /> AM
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sunset className="h-3 w-3" /> PM
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Evening Milk</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats?.eveningMilk.toFixed(1) || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    L
                  </span>
                </p>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Moon className="h-3 w-3" /> Evening shift
                </span>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="summary">Cow Summary</TabsTrigger>
        </TabsList>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tag or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedShift}
              onValueChange={(v) => setSelectedShift(v as MilkingShift | "ALL")}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Shifts</SelectItem>
                {SHIFT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Records List */}
          {recordsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Milk className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchQuery || selectedShift !== "ALL"
                    ? "No records match your filters"
                    : "No milking records for this date"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Shift Icon */}
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <ShiftIcon
                          shift={record.shift}
                          className="h-5 w-5 text-primary"
                        />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {record.animalTag}
                          </span>
                          {record.animalName && (
                            <span className="text-muted-foreground">
                              {record.animalName}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 sm:hidden">
                            <ShiftIcon
                              shift={record.shift}
                              className="h-3 w-3"
                            />
                            {record.shift}
                          </span>
                          <span className="hidden sm:inline">
                            {record.shift}
                          </span>
                          {record.daysInMilk !== undefined && (
                            <span>{record.daysInMilk} DIM</span>
                          )}
                          {record.lactationStage && (
                            <span className="capitalize">
                              {record.lactationStage}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold">
                          {record.quantity.toFixed(1)}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            L
                          </span>
                        </p>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(record)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteRecord(record)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Remarks */}
                    {record.remarks && (
                      <p className="text-sm text-muted-foreground mt-3 pl-0 sm:pl-14 border-t pt-3">
                        {record.remarks}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {summariesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !summaries || summaries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Milk className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No cow summaries available
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {summaries.map((cow) => (
                <Card key={cow.animalId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {cow.tagNumber}
                        </CardTitle>
                        {cow.name && (
                          <CardDescription>{cow.name}</CardDescription>
                        )}
                      </div>
                      <TrendIcon trend={cow.trend} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold">
                          {cow.todayTotal.toFixed(1)}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            L today
                          </span>
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Week Avg</p>
                          <p className="font-medium">
                            {cow.weekAverage.toFixed(1)} L
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Month Avg</p>
                          <p className="font-medium">
                            {cow.monthAverage.toFixed(1)} L
                          </p>
                        </div>
                      </div>
                      {cow.daysInMilk !== undefined && (
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                          {cow.daysInMilk} days in milk
                          {cow.lastMilked &&
                            ` • Last: ${new Date(
                              cow.lastMilked
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <AddMilkingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editData={editRecord}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteRecord}
        onOpenChange={() => setDeleteRecord(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Milking Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the milking record for{" "}
              <span className="font-medium">
                {deleteRecord?.animalTag}
                {deleteRecord?.animalName && ` (${deleteRecord.animalName})`}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
