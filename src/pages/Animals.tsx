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
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Edit3,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddAnimalModal } from "@/components/modals/AddAnimalModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import {
  useAnimals,
  useAnimalAnalytics,
  useDeleteAnimal,
} from "@/hooks/useAnimals";
import { AnimalDto, AnimalStatus, LactationStatus } from "@/types/animals";

const PAGE_SIZE = 10;

const getStatusBadge = (status: AnimalStatus) => {
  const config = {
    ACTIVE: {
      color: "bg-green-100 text-green-700 border-green-200",
      label: "Active",
    },
    SOLD: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Sold" },
    DEAD: {
      color: "bg-red-100 text-red-700 border-red-200",
      label: "Deceased",
    },
    CULLED: {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      label: "Culled",
    },
  };

  const { color, label } = config[status] || config.ACTIVE;
  return <Badge className={`${color} border`}>{label}</Badge>;
};

const getLactationBadge = (status?: LactationStatus) => {
  if (!status) return null;

  const config = {
    LACTATING: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      label: "Lactating",
    },
    DRY: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Dry",
    },
    HEIFER: {
      color: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Heifer",
    },
  };

  const { color, label } = config[status];
  return <Badge className={`${color} border text-xs`}>{label}</Badge>;
};

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lactationFilter, setLactationFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<AnimalDto | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<AnimalDto | null>(null);

  const { data: animals = [], isLoading } = useAnimals();
  const { data: analytics } = useAnimalAnalytics();
  const deleteMutation = useDeleteAnimal();

  // Filter animals
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch =
        animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || animal.status === statusFilter;
      const matchesLactation =
        lactationFilter === "all" || animal.lactationStatus === lactationFilter;

      return matchesSearch && matchesStatus && matchesLactation;
    });
  }, [animals, searchTerm, statusFilter, lactationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAnimals.length / PAGE_SIZE);
  const paginatedAnimals = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredAnimals.slice(start, start + PAGE_SIZE);
  }, [filteredAnimals, currentPage]);

  const handleDelete = () => {
    if (!animalToDelete?.id) return;
    deleteMutation.mutate(animalToDelete.id);
    setDeleteModalOpen(false);
    setAnimalToDelete(null);
  };

  const exportData = () => {
    const csv = [
      [
        "ID",
        "Tag",
        "Name",
        "Breed",
        "Gender",
        "Age (months)",
        "Status",
        "Category",
        "Weight",
      ],
      ...filteredAnimals.map((a) => [
        a.id,
        a.tagNumber,
        a.name || "-",
        a.breed,
        a.gender,
        a.ageInMonths || "-",
        a.status,
        a.animalType || "-",
        a.weight ? `${a.weight} kg` : "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `animals-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            Herd Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your dairy herd information
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={exportData}
            className="gap-2 px-3 py-2 text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="gap-2 px-3 py-2 text-sm sm:text-base bg-primary hover:bg-primary-hover"
          >
            <Plus className="w-4 h-4" />
            Add Animal
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Herd</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalAnimals || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.activeAnimals || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Production</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.milkingCows || 0}
            </div>
            <p className="text-xs text-muted-foreground">Milking cows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ready to Breed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.heifersReadyForBreeding || 0}
            </div>
            <p className="text-xs text-muted-foreground">Eligible heifers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Need Attention
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.animalsDueForDryOff || 0}
            </div>
            <p className="text-xs text-muted-foreground">Due for dry-off</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Animal Records</CardTitle>
          <CardDescription>
            View and manage individual animal information
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by tag, name, or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
                <SelectItem value="DEAD">Deceased</SelectItem>
                <SelectItem value="CULLED">Culled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={lactationFilter} onValueChange={setLactationFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by lactation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lactation</SelectItem>
                <SelectItem value="LACTATING">Lactating</SelectItem>
                <SelectItem value="DRY">Dry</SelectItem>
                <SelectItem value="HEIFER">Heifer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>

                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lactation Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading animals...
                    </TableCell>
                  </TableRow>
                ) : paginatedAnimals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No animals found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAnimals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-medium">
                        {animal.tagNumber}
                      </TableCell>

                      <TableCell>{animal.breed}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {animal.ageInMonths || 0}mo
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {animal.ageInYears || 0}yr
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {animal.animalType || "—"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(animal.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getLactationBadge(animal.lactationStatus)}
                          {animal.daysInMilk && (
                            <span className="text-xs text-muted-foreground">
                              {animal.daysInMilk} DIM
                            </span>
                          )}
                        </div>
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
                              onClick={() => setEditingAnimal(animal)}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit Animal
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setAnimalToDelete(animal);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Animal
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
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedAnimals.length} of {filteredAnimals.length}{" "}
                results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
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
                  onClick={handleNextPage}
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

      {/* Modals */}
      <AddAnimalModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      <AddAnimalModal
        open={!!editingAnimal}
        onOpenChange={(open) => !open && setEditingAnimal(null)}
        animal={editingAnimal}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Animal"
        description={`Are you sure you want to delete ${animalToDelete?.tagNumber}? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
