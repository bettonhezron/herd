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

// Sample animal data
const animals = [
  {
    id: "A247",
    breed: "Holstein",
    age: "3 years",
    status: "healthy",
    lastMilking: "6 hours ago",
    production: "28.5L",
    nextEvent: "Vaccination due",
  },
  {
    id: "A156",
    breed: "Jersey",
    age: "5 years",
    status: "pregnant",
    lastMilking: "5 hours ago",
    production: "22.3L",
    nextEvent: "Calving expected",
  },
  {
    id: "A198",
    breed: "Holstein",
    age: "2 years",
    status: "healthy",
    lastMilking: "4 hours ago",
    production: "31.2L",
    nextEvent: "Health check",
  },
  {
    id: "A203",
    breed: "Guernsey",
    age: "4 years",
    status: "treatment",
    lastMilking: "8 hours ago",
    production: "18.7L",
    nextEvent: "Treatment follow-up",
  },
  {
    id: "A089",
    breed: "Holstein",
    age: "6 years",
    status: "healthy",
    lastMilking: "3 hours ago",
    production: "26.8L",
    nextEvent: "Breeding program",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "healthy":
      return (
        <Badge className="bg-health-good/10 text-health-good border-health-good/20">
          Healthy
        </Badge>
      );
    case "pregnant":
      return (
        <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
          Pregnant
        </Badge>
      );
    case "treatment":
      return (
        <Badge className="bg-health-warning/10 text-health-warning border-health-warning/20">
          Treatment
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || animal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            <div className="text-2xl font-bold text-foreground">247</div>
            <p className="text-xs text-muted-foreground">Active in herd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lactating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">189</div>
            <p className="text-xs text-muted-foreground">Currently milking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pregnant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">23</div>
            <p className="text-xs text-muted-foreground">Expecting calves</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-warning">8</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
                placeholder="Search by name or ID..."
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
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="pregnant">Pregnant</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Animals Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Milking</TableHead>
                  <TableHead>Production</TableHead>
                  <TableHead>Next Event</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">{animal.id}</TableCell>

                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{animal.age}</TableCell>
                    <TableCell>{getStatusBadge(animal.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {animal.lastMilking}
                    </TableCell>
                    <TableCell className="font-medium">
                      {animal.production}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {animal.nextEvent}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete"
                          onClick={() => setDeleteModalOpen(true)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddAnimalModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Animal?"
        description="Are you sure you want to delete this animal? This action cannot be undone and will remove all associated records."
      />
    </div>
  );
}
