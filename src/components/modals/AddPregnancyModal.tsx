import { useState } from "react";
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

interface PregnancyData {
  animalTag: string;
  animalName: string;
  breedingDate: string;
  confirmationDate: string;
  status: "healthy" | "attention" | "critical";
}

interface AddPregnancyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: PregnancyData) => void;
}

export function AddPregnancyModal({
  open,
  onOpenChange,
  onSave,
}: AddPregnancyModalProps) {
  const [formData, setFormData] = useState<PregnancyData>({
    animalTag: "",
    animalName: "",
    breedingDate: "",
    confirmationDate: new Date().toISOString().split("T")[0],
    status: "healthy",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      toast.success("Pregnancy confirmation recorded successfully");
    }
    onOpenChange(false);
    setFormData({
      animalTag: "",
      animalName: "",
      breedingDate: "",
      confirmationDate: new Date().toISOString().split("T")[0],
      status: "healthy",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Pregnancy</DialogTitle>
          <DialogDescription>
            Record pregnancy confirmation and initial health status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Animal Tag */}
            <div className="grid gap-2">
              <Label htmlFor="animalTag">Animal Tag ID</Label>
              <Input
                id="animalTag"
                value={formData.animalTag}
                onChange={(e) =>
                  setFormData({ ...formData, animalTag: e.target.value })
                }
                placeholder="A-2401"
                required
              />
            </div>

            {/* Animal Name */}
            <div className="grid gap-2">
              <Label htmlFor="animalName">Animal Name</Label>
              <Input
                id="animalName"
                value={formData.animalName}
                onChange={(e) =>
                  setFormData({ ...formData, animalName: e.target.value })
                }
                placeholder="Bessie"
                required
              />
            </div>

            {/* Breeding Date */}
            <div className="grid gap-2">
              <Label htmlFor="breedingDate">Original Breeding Date</Label>
              <Input
                id="breedingDate"
                type="date"
                value={formData.breedingDate}
                onChange={(e) =>
                  setFormData({ ...formData, breedingDate: e.target.value })
                }
                required
              />
            </div>

            {/* Confirmation Date */}
            <div className="grid gap-2">
              <Label htmlFor="confirmationDate">Confirmation Date</Label>
              <Input
                id="confirmationDate"
                type="date"
                value={formData.confirmationDate}
                onChange={(e) =>
                  setFormData({ ...formData, confirmationDate: e.target.value })
                }
                required
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Health Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="attention">Needs Attention</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer buttons side by side */}
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
              Confirm Pregnancy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
