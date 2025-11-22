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
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnimal, useUpdateAnimal } from "@/hooks/useAnimals";
import {
  AnimalDto,
  CreateAnimalRequest,
  UpdateAnimalRequest,
  Gender,
  Breed,
  AnimalStatus,
  GENDER_OPTIONS,
  BREED_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/animals";

interface AddAnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: AnimalDto | null;
}

export function AddAnimalModal({
  open,
  onOpenChange,
  animal,
}: AddAnimalModalProps) {
  const [formData, setFormData] = useState<CreateAnimalRequest>({
    tagNumber: "",
    name: "",
    gender: Gender.FEMALE,
    breed: Breed.FRIESIAN,
    dateOfBirth: "",
    weight: undefined,
    notes: "",
  });

  const createMutation = useCreateAnimal();
  const updateMutation = useUpdateAnimal();

  useEffect(() => {
    if (animal) {
      setFormData({
        tagNumber: animal.tagNumber,
        name: animal.name || "",
        gender: animal.gender,
        breed: animal.breed,
        dateOfBirth: animal.dateOfBirth,
        weight: animal.weight,
        notes: animal.notes || "",
      });
    } else {
      setFormData({
        tagNumber: "",
        name: "",
        gender: Gender.FEMALE,
        breed: Breed.FRIESIAN,
        dateOfBirth: "",
        weight: undefined,
        notes: "",
      });
    }
  }, [animal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (animal?.id) {
        const payload: UpdateAnimalRequest = {
          name: formData.name || undefined,
          breed: formData.breed,
          dateOfBirth: formData.dateOfBirth,
          weight: formData.weight,
          notes: formData.notes || undefined,
        };

        await updateMutation.mutateAsync({ id: animal.id, payload });
        onOpenChange(false);
      } else {
        const payload: CreateAnimalRequest = {
          tagNumber: formData.tagNumber,
          name: formData.name || undefined,
          gender: formData.gender,
          breed: formData.breed,
          dateOfBirth: formData.dateOfBirth,
          weight: formData.weight,
          notes: formData.notes || undefined,
        };

        await createMutation.mutateAsync(payload);
        onOpenChange(false);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{animal ? "Edit Animal" : "Add New Animal"}</DialogTitle>
          <DialogDescription>
            {animal
              ? "Update the animal's information"
              : "Register a new animal in your herd"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tag Number & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tagNumber">Tag Number *</Label>
              <Input
                id="tagNumber"
                value={formData.tagNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tagNumber: e.target.value.toUpperCase(),
                  })
                }
                placeholder="ANM-001"
                required
                disabled={!!animal}
              />
              {animal && (
                <p className="text-xs text-muted-foreground">
                  Tag number cannot be changed
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Bessie"
              />
            </div>
          </div>

          {/* Gender & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: Gender) =>
                  setFormData({ ...formData, gender: value })
                }
                disabled={!!animal}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {animal && (
                <p className="text-xs text-muted-foreground">
                  Gender cannot be changed
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed *</Label>
              <Select
                value={formData.breed}
                onValueChange={(value: Breed) =>
                  setFormData({ ...formData, breed: value })
                }
              >
                <SelectTrigger id="breed">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  {BREED_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date of Birth & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) (Optional)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="350"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          {/* Show animal info if editing */}
          {animal && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">Current Information:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-medium">{animal.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  <span className="font-medium">{animal.animalType}</span>
                </div>
                {animal.lactationStatus && (
                  <div>
                    <span className="text-muted-foreground">Lactation:</span>{" "}
                    <span className="font-medium">
                      {animal.lactationStatus}
                    </span>
                  </div>
                )}
                {animal.daysInMilk && (
                  <div>
                    <span className="text-muted-foreground">Days in Milk:</span>{" "}
                    <span className="font-medium">{animal.daysInMilk}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : animal
                ? "Update Animal"
                : "Add Animal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
