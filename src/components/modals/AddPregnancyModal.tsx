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
  breedingDate: string;
  confirmationDate: string;
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
    breedingDate: "",
    confirmationDate: new Date().toISOString().split("T")[0],
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
      breedingDate: "",
      confirmationDate: new Date().toISOString().split("T")[0],
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

            {/* Breeding Date */}
            <div className="grid gap-2">
              <Label htmlFor="breedingDate">Service Date</Label>
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
