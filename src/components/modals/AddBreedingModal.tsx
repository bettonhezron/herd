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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface BreedingData {
  animalTag: string;
  animalName: string;
  breedingDate: string;
  method: "AI" | "Natural";
  bullId?: string;
  notes?: string;
}

interface AddBreedingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: BreedingData) => void;
}
export function AddBreedingModal({
  open,
  onOpenChange,
  onSave,
}: AddBreedingModalProps) {
  const [formData, setFormData] = useState<BreedingData>({
    animalTag: "",
    animalName: "",
    breedingDate: new Date().toISOString().split("T")[0],
    method: "AI",
    bullId: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      toast.success("Breeding record added successfully");
    }
    onOpenChange(false);
    setFormData({
      animalTag: "",
      animalName: "",
      breedingDate: new Date().toISOString().split("T")[0],
      method: "AI",
      bullId: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Breeding Event</DialogTitle>
          <DialogDescription>
            Add a new breeding record for artificial insemination or natural
            breeding
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
                  <SelectItem value="Natural">Natural Breeding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bull ID - only if AI */}
            {formData.method === "AI" && (
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

          {/* ✅ Footer buttons fixed */}
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
              Save Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
