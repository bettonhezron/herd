import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Animal,
  CreateAnimalPayload,
  UpdateAnimalPayload,
} from "@/types/animal";
import { useCreateAnimal, useUpdateAnimal } from "@/hooks/useAnimal";

interface AddAnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Animal | null;
  onSave?: (animal: Animal) => void;
}

export function AddAnimalModal({
  open,
  onOpenChange,
  animal,
}: AddAnimalModalProps) {
  const [formData, setFormData] = useState<Animal>({
    tagNumber: "",
    breed: "HOLSTEIN",
    gender: "FEMALE",
    status: "ACTIVE",
    weight: "",
    dob: "",
  });

  const createMutation = useCreateAnimal();
  const updateMutation = useUpdateAnimal();

  useEffect(() => {
    if (animal) {
      setFormData(animal);
    } else {
      setFormData({
        tagNumber: "",
        breed: "HOLSTEIN",
        gender: "FEMALE",
        status: "ACTIVE",
        weight: "",
        dob: "",
      });
    }
  }, [animal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (animal?.id) {
      // Update existing animal
      const payload: UpdateAnimalPayload = {
        ...formData,
      };
      updateMutation.mutate(
        { id: Number(animal.id), payload },
        {
          onSuccess: () => {
            toast.success("Animal updated successfully");
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to update animal"),
        }
      );
    } else {
      //  Create new animal
      const payload: CreateAnimalPayload = {
        tagNumber: formData.tagNumber,
        breed: formData.breed,
        gender: formData.gender,
        status: formData.status,
        weight: formData.weight,
        dob: formData.dob,
      };
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Animal added successfully");
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to add animal"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{animal ? "Edit Animal" : "Add New Animal"}</DialogTitle>
          <DialogDescription>
            {animal
              ? "Update the details of the animal"
              : "Enter the details of the new animal to add to your herd."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Tag Number */}
            <div className="grid gap-2">
              <Label htmlFor="tagNumber">Tag Number</Label>
              <Input
                id="tagNumber"
                value={formData.tagNumber}
                onChange={(e) =>
                  setFormData({ ...formData, tagNumber: e.target.value })
                }
                required
              />
            </div>

            {/* Breed */}
            <div className="grid gap-2">
              <Label htmlFor="breed">Breed</Label>
              <Select
                value={formData.breed}
                onValueChange={(value: Animal["breed"]) =>
                  setFormData({ ...formData, breed: value })
                }
              >
                <SelectTrigger id="breed">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOLSTEIN">Holstein</SelectItem>
                  <SelectItem value="JERSEY">Jersey</SelectItem>
                  <SelectItem value="GUERNSEY">Guernsey</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                required
              />
            </div>

            {/* DOB */}
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
              />
            </div>

            {/* Gender */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: Animal["gender"]) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Animal["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="DEAD">Dead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show extra only if editing */}
            {animal && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="lactationStatus">Lactation Status</Label>
                  <Select
                    value={formData.lactationStatus}
                    onValueChange={(value: Animal["lactationStatus"]) =>
                      setFormData({ ...formData, lactationStatus: value })
                    }
                  >
                    <SelectTrigger id="lactationStatus">
                      <SelectValue placeholder="Select lactation status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LACTATING">Lactating</SelectItem>
                      <SelectItem value="DRY">Dry</SelectItem>
                      <SelectItem value="UNKNOWN">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-[140px]"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {animal ? "Update Animal" : "Add Animal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
