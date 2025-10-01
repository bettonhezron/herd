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

export interface Animal {
  id?: string;
  name: string;
  tagId: string;
  breed: string;
  dateOfBirth: string;
  gender: "male" | "female";
  status: "healthy" | "pregnant" | "treatment";
  nextEvent: string;
}

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
  onSave,
}: AddAnimalModalProps) {
  const [formData, setFormData] = useState<Animal>({
    name: "",
    tagId: "",
    breed: "",
    dateOfBirth: "",
    gender: "female",
    status: "healthy",
    nextEvent: "",
  });

  useEffect(() => {
    if (animal) {
      setFormData(animal);
    } else {
      setFormData({
        name: "",
        tagId: "",
        breed: "",
        dateOfBirth: "",
        gender: "female",
        status: "healthy",
        nextEvent: "",
      });
    }
  }, [animal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      toast.success(
        animal ? "Animal updated successfully" : "Animal added successfully"
      );
    }
    onOpenChange(false);
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
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tagId">Tag ID</Label>
              <Input
                id="tagId"
                value={formData.tagId}
                onChange={(e) =>
                  setFormData({ ...formData, tagId: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="breed">Breed</Label>
              <Select
                value={formData.breed}
                onValueChange={(value) =>
                  setFormData({ ...formData, breed: value })
                }
              >
                <SelectTrigger id="breed">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Holstein">Holstein</SelectItem>
                  <SelectItem value="Jersey">Jersey</SelectItem>
                  <SelectItem value="Guernsey">Guernsey</SelectItem>
                  <SelectItem value="Brown Swiss">Brown Swiss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: "male" | "female") =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "healthy" | "pregnant" | "treatment") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="treatment">Sick</SelectItem>
                  <SelectItem value="pregnant">Sick</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Button type="submit" className="min-w-[140px]">
              {animal ? "Update Animal" : "Add Animal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
