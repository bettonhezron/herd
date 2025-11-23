import { useState } from "react";
import {
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Baby,
  Pencil,
  Trash2,
  Edit3,
  XCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeatDetectionModal } from "@/components/modals/HeatDetectionModal";
import { BreedingModal } from "@/components/modals/AddBreedingModal";
import { ConfirmPregnancyModal } from "@/components/modals/ConfirmPregnancyModal";
import { MarkPregnancyFailedModal } from "@/components/modals/MarkPregnancyFailedModal";
import { CalvingModal } from "@/components/modals/CalvingModal";
import { SkipHeatModal } from "@/components/modals/SkipHeatModal";

// Import hooks
import {
  useAnimalsInHeat,
  useBreedingStats,
  useAllHeatDetections,
  useActivePregnancies,
  useUpcomingCalvings,
  useOverdueCalvings,
  usePendingPregnancyChecks,
  useCreateHeatDetection,
  useUpdateHeatDetection,
  useDeleteHeatDetection,
  useCreateBreedingFromHeat,
  useSkipHeatDetection,
  useConfirmPregnancy,
  useMarkPregnancyFailed,
  useRecordCalving,
  useUpdateBreedingRecord,
  useDeleteBreedingRecord,
} from "@/hooks/useBreeding";
import {
  HeatDetectionResponse,
  BreedingRecordResponse,
  BreedingStatus,
  ActionTaken,
  HeatDetectionRequest,
  BreedingRecordRequest,
} from "@/types/breeding";

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "healthy":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "PENDING":
    case "upcoming":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "FAILED":
    case "critical":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "attention":
    case "imminent":
    case "COMPLETED":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "healthy":
      return <CheckCircle className="w-3 h-3" />;
    case "PENDING":
    case "upcoming":
      return <Clock className="w-3 h-3" />;
    case "FAILED":
    case "critical":
    case "attention":
    case "imminent":
      return <AlertCircle className="w-3 h-3" />;
    case "COMPLETED":
      return <Baby className="w-3 h-3" />;
    default:
      return null;
  }
}

function getActionColor(action: ActionTaken) {
  switch (action) {
    case ActionTaken.BRED:
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case ActionTaken.SKIP:
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case ActionTaken.PENDING:
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

export default function BreedingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Modal states
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [breedingModalOpen, setBreedingModalOpen] = useState(false);
  const [confirmPregnancyModalOpen, setConfirmPregnancyModalOpen] =
    useState(false);
  const [failedPregnancyModalOpen, setFailedPregnancyModalOpen] =
    useState(false);
  const [calvingModalOpen, setCalvingModalOpen] = useState(false);
  const [skipHeatModalOpen, setSkipHeatModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Selected records
  const [selectedHeat, setSelectedHeat] =
    useState<HeatDetectionResponse | null>(null);
  const [selectedBreeding, setSelectedBreeding] =
    useState<BreedingRecordResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "heat" | "breeding";
    id: number;
  } | null>(null);

  // Query hooks
  const { data: stats } = useBreedingStats();
  const { data: inHeatAnimals, isLoading: loadingHeat } = useAnimalsInHeat();
  const { data: allHeatDetections } = useAllHeatDetections();
  const { data: pendingChecks, isLoading: loadingPending } =
    usePendingPregnancyChecks();
  const { data: activePregnancies, isLoading: loadingPregnancies } =
    useActivePregnancies();
  const { data: upcomingCalvings } = useUpcomingCalvings(30);
  const { data: overdueCalvings } = useOverdueCalvings();

  // Mutation hooks
  const createHeatMutation = useCreateHeatDetection();
  const updateHeatMutation = useUpdateHeatDetection();
  const deleteHeatMutation = useDeleteHeatDetection();
  const createBreedingMutation = useCreateBreedingFromHeat();
  const skipHeatMutation = useSkipHeatDetection();
  const confirmPregnancyMutation = useConfirmPregnancy();
  const failPregnancyMutation = useMarkPregnancyFailed();
  const recordCalvingMutation = useRecordCalving();
  const updateBreedingMutation = useUpdateBreedingRecord();
  const deleteBreedingMutation = useDeleteBreedingRecord();

  // Combine upcoming and overdue calvings
  const allCalvings = [...(overdueCalvings || []), ...(upcomingCalvings || [])];

  // Filter breeding records (pending checks)
  const filteredRecords = (pendingChecks || []).filter((record) => {
    const matchesSearch =
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.animalName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleCreateOrUpdateHeat = (
    data: HeatDetectionRequest & { id?: number }
  ) => {
    if (data.id) {
      updateHeatMutation.mutate(
        { id: data.id, payload: data },
        {
          onSuccess: () => {
            setHeatModalOpen(false);
            setSelectedHeat(null);
          },
        }
      );
    } else {
      createHeatMutation.mutate(data, {
        onSuccess: () => {
          setHeatModalOpen(false);
        },
      });
    }
  };

  const handleCreateBreeding = (data: BreedingRecordRequest) => {
    if (!selectedHeat) return;

    createBreedingMutation.mutate(
      { heatId: selectedHeat.id, payload: data },
      {
        onSuccess: () => {
          setBreedingModalOpen(false);
          setSelectedHeat(null);
        },
      }
    );
  };

  const handleSkipHeat = (reason?: string) => {
    if (!selectedHeat) return;

    skipHeatMutation.mutate(
      { heatId: selectedHeat.id, reason },
      {
        onSuccess: () => {
          setSkipHeatModalOpen(false);
          setSelectedHeat(null);
        },
      }
    );
  };

  const handleConfirmPregnancy = (data: {
    confirmationDate?: string;
    remarks?: string;
  }) => {
    if (!selectedBreeding) return;

    confirmPregnancyMutation.mutate(
      { breedingId: selectedBreeding.id, ...data },
      {
        onSuccess: () => {
          setConfirmPregnancyModalOpen(false);
          setSelectedBreeding(null);
        },
      }
    );
  };

  const handleMarkPregnancyFailed = (data: {
    checkDate?: string;
    reason?: string;
  }) => {
    if (!selectedBreeding) return;

    failPregnancyMutation.mutate(
      { breedingId: selectedBreeding.id, ...data },
      {
        onSuccess: () => {
          setFailedPregnancyModalOpen(false);
          setSelectedBreeding(null);
        },
      }
    );
  };

  const handleRecordCalving = (data: {
    calvingDate?: string;
    remarks?: string;
  }) => {
    if (!selectedBreeding) return;

    recordCalvingMutation.mutate(
      { breedingId: selectedBreeding.id, ...data },
      {
        onSuccess: () => {
          setCalvingModalOpen(false);
          setSelectedBreeding(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "heat") {
      deleteHeatMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    } else {
      deleteBreedingMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  const openBreedingModal = (heat: HeatDetectionResponse) => {
    setSelectedHeat(heat);
    setBreedingModalOpen(true);
  };

  const openSkipModal = (heat: HeatDetectionResponse) => {
    setSelectedHeat(heat);
    setSkipHeatModalOpen(true);
  };

  const openConfirmPregnancyModal = (breeding: BreedingRecordResponse) => {
    setSelectedBreeding(breeding);
    setConfirmPregnancyModalOpen(true);
  };

  const openFailedPregnancyModal = (breeding: BreedingRecordResponse) => {
    setSelectedBreeding(breeding);
    setFailedPregnancyModalOpen(true);
  };

  const openCalvingModal = (breeding: BreedingRecordResponse) => {
    setSelectedBreeding(breeding);
    setCalvingModalOpen(true);
  };

  const openDeleteModal = (type: "heat" | "breeding", id: number) => {
    setDeleteTarget({ type, id });
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            Breeding Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Track breeding cycles, artificial insemination, and calving records
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button
            className="gap-2 px-3 py-2 text-sm sm:text-base"
            onClick={() => {
              setSelectedHeat(null);
              setHeatModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Record Heat
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              In Heat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats?.inHeatCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ready for breeding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Pending Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats?.pendingChecksCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Due for confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Pregnancies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats?.activePregnanciesCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.confirmedThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Calvings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats?.upcomingCalvingsCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="heat" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide border-b rounded-none bg-transparent p-0">
          <TabsTrigger
            value="heat"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Heat Detection
          </TabsTrigger>
          <TabsTrigger
            value="breeding"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Breeding Records
          </TabsTrigger>
          <TabsTrigger
            value="pregnancy"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Pregnancy Tracking
          </TabsTrigger>
          <TabsTrigger
            value="calving"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Calving Calendar
          </TabsTrigger>
        </TabsList>

        {/* Heat Detection Tab */}
        <TabsContent value="heat">
          <Card>
            <CardHeader>
              <CardTitle>Heat Detection</CardTitle>
              <CardDescription>
                Animals currently in heat and ready for breeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHeat ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : !inHeatAnimals || inHeatAnimals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No animals in heat at the moment
                </div>
              ) : (
                <div className="space-y-3">
                  {inHeatAnimals.map((animal) => (
                    <div
                      key={animal.id}
                      className="p-3 sm:p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{animal.animalTag}</p>
                            {animal.animalName && (
                              <span className="text-sm text-muted-foreground">
                                ({animal.animalName})
                              </span>
                            )}
                            <Badge
                              variant="secondary"
                              className={`gap-1 ${getActionColor(
                                animal.actionTaken
                              )} text-xs`}
                            >
                              {animal.actionTaken === ActionTaken.PENDING ? (
                                <>
                                  <AlertCircle className="w-3 h-3" />
                                  Day {animal.daysInHeat + 1}
                                </>
                              ) : (
                                animal.actionTaken
                              )}
                            </Badge>
                          </div>
                        </div>
                        {animal.actionTaken === ActionTaken.PENDING && (
                          <div className="flex gap-2 ml-2 shrink-0">
                            <Button
                              size="sm"
                              onClick={() => openBreedingModal(animal)}
                              className="gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="hidden sm:inline">Breed</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openSkipModal(animal)}
                            >
                              <XCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">Skip</span>
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                        <div>
                          <p className="text-muted-foreground">Heat Detected</p>
                          <p className="font-medium">
                            {new Date(
                              animal.heatDetectedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        {animal.lastBredDate && (
                          <div>
                            <p className="text-muted-foreground">Last Bred</p>
                            <p className="font-medium">
                              {new Date(
                                animal.lastBredDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {animal.daysSinceLastBirth && (
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-muted-foreground">
                              Days Since Birth
                            </p>
                            <p className="font-medium">
                              {animal.daysSinceLastBirth}
                            </p>
                          </div>
                        )}
                      </div>

                      {animal.notes && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <p className="font-medium">Notes:</p>
                          <p>{animal.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breeding Records Tab */}
        <TabsContent value="breeding">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Records</CardTitle>
              <CardDescription>
                All breeding attempts - pending pregnancy confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by tag or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value={BreedingStatus.PENDING}>Pending</option>
                  <option value={BreedingStatus.CONFIRMED}>Confirmed</option>
                  <option value={BreedingStatus.FAILED}>Failed</option>
                  <option value={BreedingStatus.COMPLETED}>Completed</option>
                </select>
              </div>

              {loadingPending ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No breeding records found
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Animal Tag</TableHead>
                        <TableHead>Service Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expected Calving</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.animalTag}</p>
                              {record.animalName && (
                                <p className="text-xs text-muted-foreground">
                                  {record.animalName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(record.breedingDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {record.method || "AI"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`gap-1 ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {getStatusIcon(record.status)}
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(
                              record.expectedCalvingDate
                            ).toLocaleDateString()}
                            {record.daysUntilCalving !== undefined && (
                              <span className="text-xs text-muted-foreground block">
                                {record.daysUntilCalving > 0
                                  ? `in ${record.daysUntilCalving} days`
                                  : record.daysUntilCalving === 0
                                  ? "Due today"
                                  : `${Math.abs(
                                      record.daysUntilCalving
                                    )} days overdue`}
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                {record.status === BreedingStatus.PENDING && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        openConfirmPregnancyModal(record)
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Confirm Pregnancy
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        openFailedPregnancyModal(record)
                                      }
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Mark as Failed
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {record.status === BreedingStatus.CONFIRMED && (
                                  <DropdownMenuItem
                                    onClick={() => openCalvingModal(record)}
                                  >
                                    <Baby className="w-4 h-4 mr-2" />
                                    Record Calving
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    openDeleteModal("breeding", record.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pregnancy Tracking Tab */}
        <TabsContent value="pregnancy">
          <Card>
            <CardHeader>
              <CardTitle>Pregnancy Monitoring</CardTitle>
              <CardDescription>
                Monitor pregnant animals and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPregnancies ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : !activePregnancies || activePregnancies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active pregnancies
                </div>
              ) : (
                <div className="space-y-4">
                  {activePregnancies.map((record) => {
                    const daysPregnant = record.daysPregnant || 0;
                    const progressPercent = Math.round(
                      (daysPregnant / 283) * 100
                    );
                    const trimester =
                      daysPregnant <= 94 ? 1 : daysPregnant <= 188 ? 2 : 3;

                    return (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {record.animalTag}
                              </p>
                              {record.animalName && (
                                <span className="text-sm text-muted-foreground">
                                  ({record.animalName})
                                </span>
                              )}
                              <Badge
                                variant="secondary"
                                className={`gap-1 ${getStatusColor(
                                  record.status
                                )}`}
                              >
                                {getStatusIcon(record.status)}
                                {record.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Trimester {trimester} • {daysPregnant} days
                              pregnant
                            </p>
                          </div>
                          <Badge variant="outline">
                            Expected:{" "}
                            {new Date(
                              record.expectedCalvingDate
                            ).toLocaleDateString()}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Pregnancy Progress
                            </span>
                            <span className="font-medium">
                              {progressPercent}%
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Breeding Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                record.breedingDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {record.pregnancyConfirmationDate && (
                            <div>
                              <p className="text-muted-foreground">
                                Confirmed On
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  record.pregnancyConfirmationDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {record.remarks && (
                          <div className="mt-3 text-sm">
                            <p className="text-muted-foreground font-medium">
                              Notes:
                            </p>
                            <p>{record.remarks}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calving Calendar Tab */}
        <TabsContent value="calving">
          <Card>
            <CardHeader>
              <CardTitle>Calving Calendar</CardTitle>
              <CardDescription>
                Upcoming calving events and birth notifications
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!allCalvings || allCalvings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming calvings in the next 30 days
                </div>
              ) : (
                <div className="space-y-4">
                  {allCalvings.map((event) => {
                    const daysUntil = event.daysUntilCalving || 0;
                    const isDue = daysUntil <= 0;
                    const isImminent = daysUntil > 0 && daysUntil <= 7;
                    const status =
                      isDue || event.isOverdue
                        ? "imminent"
                        : isImminent
                        ? "imminent"
                        : "upcoming";

                    return (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-full ${getStatusColor(
                              status
                            )}`}
                          >
                            <Baby className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {event.animalTag}
                              {event.animalName && (
                                <span className="text-sm text-muted-foreground ml-1">
                                  ({event.animalName})
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expected calving date
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="text-left sm:text-right">
                            <p className="font-medium">
                              {new Date(
                                event.expectedCalvingDate
                              ).toLocaleDateString()}
                            </p>
                            <Badge
                              variant="secondary"
                              className={`gap-1 ${getStatusColor(
                                status
                              )} inline-flex mt-1`}
                            >
                              {event.isOverdue ? (
                                <span className="text-red-600 font-semibold">
                                  {Math.abs(daysUntil)} day
                                  {Math.abs(daysUntil) !== 1 ? "s" : ""} overdue
                                </span>
                              ) : daysUntil === 0 ? (
                                "Due Today"
                              ) : daysUntil < 0 ? (
                                <span className="text-red-600 font-semibold">
                                  {Math.abs(daysUntil)} day
                                  {Math.abs(daysUntil) !== 1 ? "s" : ""} overdue
                                </span>
                              ) : (
                                `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`
                              )}
                            </Badge>
                          </div>

                          {(isDue || event.isOverdue || daysUntil <= 3) && (
                            <Button
                              onClick={() => openCalvingModal(event)}
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              Record Birth
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <HeatDetectionModal
        open={heatModalOpen}
        onOpenChange={setHeatModalOpen}
        heatDetection={selectedHeat}
        onSubmit={handleCreateOrUpdateHeat}
        isSubmitting={
          createHeatMutation.isPending || updateHeatMutation.isPending
        }
      />

      <BreedingModal
        open={breedingModalOpen}
        onOpenChange={setBreedingModalOpen}
        heatDetection={selectedHeat}
        onSubmit={handleCreateBreeding}
        isSubmitting={createBreedingMutation.isPending}
      />

      <SkipHeatModal
        open={skipHeatModalOpen}
        onOpenChange={setSkipHeatModalOpen}
        heatDetection={selectedHeat}
        onSkip={handleSkipHeat}
        isSubmitting={skipHeatMutation.isPending}
      />

      <ConfirmPregnancyModal
        open={confirmPregnancyModalOpen}
        onOpenChange={setConfirmPregnancyModalOpen}
        breedingRecord={selectedBreeding}
        onConfirm={handleConfirmPregnancy}
        isSubmitting={confirmPregnancyMutation.isPending}
      />

      <MarkPregnancyFailedModal
        open={failedPregnancyModalOpen}
        onOpenChange={setFailedPregnancyModalOpen}
        breedingRecord={selectedBreeding}
        onMarkFailed={handleMarkPregnancyFailed}
        isSubmitting={failPregnancyMutation.isPending}
      />

      <CalvingModal
        open={calvingModalOpen}
        onOpenChange={setCalvingModalOpen}
        breedingRecord={selectedBreeding}
        onRecordCalving={handleRecordCalving}
        isSubmitting={recordCalvingMutation.isPending}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={`Delete ${
          deleteTarget?.type === "heat" ? "Heat Detection" : "Breeding Record"
        }?`}
        description={`Are you sure you want to delete this ${
          deleteTarget?.type === "heat" ? "heat detection" : "breeding record"
        }? This action cannot be undone.`}
        onConfirm={handleDelete}
        isDeleting={
          deleteHeatMutation.isPending || deleteBreedingMutation.isPending
        }
      />
    </div>
  );
}
