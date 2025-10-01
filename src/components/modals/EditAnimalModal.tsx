import { useEffect, useState } from "react";
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

interface Animal {
  id: string;
  name: string;
  tagId: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  status: string;
}

interface EditAnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal: Animal | null;
  onUpdate: (id: string, updates: Partial<Animal>) => void;
}

export function EditAnimalModal({
  open,
  onOpenChange,
  animal,
  onUpdate,
}: EditAnimalModalProps) {
  const [formData, setFormData] = useState<Animal | null>(null);

  // Prefill when modal opens with provided animal
  useEffect(() => {
    if (animal) {
      setFormData({ ...animal });
    }
  }, [animal]);

  if (!formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!animal) return;

    // Get changed fields only
    const updates: Partial<Animal> = {};
    (Object.keys(formData) as (keyof Animal)[]).forEach((key) => {
      if (formData[key] !== animal[key]) {
        updates[key] = formData[key];
      }
    });

    if (Object.keys(updates).length > 0) {
      onUpdate(animal.id, updates);
      toast.success("Animal updated successfully");
    } else {
      toast.info("No changes were made");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Animal</DialogTitle>
          <DialogDescription>
            Update the details of this animal. Only changed fields will be
            saved.
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
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
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="shrink-0">
              Update Animal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
