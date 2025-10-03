import { useState } from "react";
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
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { AddAnimalModal } from "@/components/modals/AddAnimalModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Animal } from "@/types/animal";
import {
  useAnimals,
  useAnimalAnalytics,
  useCreateAnimal,
  useUpdateAnimal,
  useDeleteAnimal,
} from "@/hooks/useAnimal";
import { toast } from "sonner";
import { formatAge } from "@/lib/dateUtils";

const getStatusBadge = (status: Animal["status"]) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-health-good/10 text-health-good border-health-good/20">
          Active
        </Badge>
      );
    case "SOLD":
      return (
        <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
          Sold
        </Badge>
      );
    case "DEAD":
      return (
        <Badge className="bg-health-warning/10 text-health-warning border-health-warning/20">
          Dead
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);

  // Queries
  const { data: animals = [], isLoading, isError } = useAnimals();
  const { data: analytics } = useAnimalAnalytics();

  // Mutations
  const createAnimal = useCreateAnimal();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();

  // Filter + search
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (animal.id?.toString() ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || animal.status === filterStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleSaveAnimal = (animal: Animal) => {
    if (animal.id) {
      // Update
      updateAnimal.mutate(
        { id: Number(animal.id), payload: animal },
        {
          onSuccess: () => toast.success("Animal updated successfully"),
          onError: () => toast.error("Failed to update animal"),
        }
      );
    } else {
      // Create
      createAnimal.mutate(animal, {
        onSuccess: () => toast.success("Animal created successfully"),
        onError: () => toast.error("Failed to create animal"),
      });
    }
  };

  const handleDeleteAnimal = () => {
    if (!animalToDelete?.id) return;
    deleteAnimal.mutate(Number(animalToDelete.id), {
      onSuccess: () => {
        toast.success("Animal deleted successfully");
        setDeleteModalOpen(false);
      },
      onError: () => toast.error("Failed to delete animal"),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            Animals
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your dairy herd information
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="gap-2 px-3 py-2 self-start sm:self-auto text-sm sm:text-base bg-primary hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4" />
          Add Animal
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Animals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics?.totalAnimals ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">All the animals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lactating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              {analytics?.lactatingAnimals ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">Currently milking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              {analytics?.activeAnimals ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">Active animals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bulls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-warning">
              {analytics?.totalBulls ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">Bulls</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Search */}
      <Card>
        <CardHeader>
          <CardTitle>Animal Records</CardTitle>
          <CardDescription>
            View and manage individual animal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by tag or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DEAD">Dead</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading animals...
              </div>
            ) : isError ? (
              <div className="p-4 text-sm text-red-500">
                Failed to load animals.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnimals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        No animals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAnimals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell>{animal.id}</TableCell>
                        <TableCell>{animal.tagNumber}</TableCell>
                        <TableCell>{animal.breed}</TableCell>
                        <TableCell>{formatAge(animal.dob)}</TableCell>

                        <TableCell>{animal.category}</TableCell>
                        <TableCell>{getStatusBadge(animal.status)}</TableCell>
                        <TableCell>{animal.weight} kg</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit"
                              onClick={() => setEditingAnimal(animal)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete"
                              onClick={() => {
                                setAnimalToDelete(animal);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddAnimalModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleSaveAnimal}
      />
      <AddAnimalModal
        open={!!editingAnimal}
        onOpenChange={(open) => !open && setEditingAnimal(null)}
        animal={editingAnimal}
        onSave={handleSaveAnimal}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Animal?"
        description="Are you sure you want to delete this animal? This action cannot be undone."
        onConfirm={handleDeleteAnimal}
      />
    </div>
  );
}
