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
import { toast } from "sonner";

interface BreedingData {
  id?: string;
  animalTag: string;

  breedingDate: string;
  method: "AI" | "NATURAL";
  bullId?: string;
  notes?: string;
}

interface AddBreedingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breeding?: BreedingData | null;
  onSave?: (data: BreedingData) => void;
}

export function AddBreedingModal({
  open,
  onOpenChange,
  breeding,
  onSave,
}: AddBreedingModalProps) {
  const [formData, setFormData] = useState<BreedingData>({
    animalTag: "",

    breedingDate: new Date().toISOString().split("T")[0],
    method: "AI",
    bullId: "",
    notes: "",
  });

  useEffect(() => {
    if (breeding) {
      setFormData(breeding);
    } else {
      setFormData({
        animalTag: "",

        breedingDate: new Date().toISOString().split("T")[0],
        method: "AI",
        bullId: "",
        notes: "",
      });
    }
  }, [breeding, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      toast.success(
        breeding
          ? "Breeding record updated successfully"
          : "Breeding record added successfully"
      );
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {breeding ? "Edit Breeding Event" : "Record Breeding Event"}
          </DialogTitle>
          <DialogDescription>
            {breeding
              ? "Update breeding details for this animal"
              : "Add a new breeding record for artificial insemination or natural breeding"}
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
              <Label htmlFor="breedingDate">Breeding Date</Label>
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

            {/* Method */}
            <div className="grid gap-2">
              <Label htmlFor="method">Breeding Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI">Artificial Insemination</SelectItem>
                  <SelectItem value="NATURAL">Natural Breeding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bull ID - only if natural */}
            {formData.method === "NATURAL" && (
              <div className="grid gap-2">
                <Label htmlFor="bullId">Bull ID (Optional)</Label>
                <Input
                  id="bullId"
                  value={formData.bullId}
                  onChange={(e) =>
                    setFormData({ ...formData, bullId: e.target.value })
                  }
                  placeholder="BULL-789"
                />
              </div>
            )}

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes about the breeding event..."
                rows={3}
              />
            </div>
          </div>

          {/* Footer buttons */}
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
              {breeding ? "Update Record" : "Save Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
