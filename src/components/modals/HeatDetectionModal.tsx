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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnimals } from "@/hooks/useAnimals";
import { HeatDetectionRequest, HeatDetectionResponse } from "@/types/breeding";

interface HeatDetectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heatDetection?: HeatDetectionResponse | null;
  onSubmit: (data: HeatDetectionRequest & { id?: number }) => void;
  isSubmitting?: boolean;
}

export function HeatDetectionModal({
  open,
  onOpenChange,
  heatDetection,
  onSubmit,
  isSubmitting = false,
}: HeatDetectionModalProps) {
  const { data: animals } = useAnimals();

  const [formData, setFormData] = useState<
    HeatDetectionRequest & { id?: number }
  >({
    animalId: 0,
    heatDetectedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (heatDetection) {
      setFormData({
        id: heatDetection.id,
        animalId: heatDetection.animalId,
        heatDetectedDate: heatDetection.heatDetectedDate,
        notes: heatDetection.notes || "",
      });
    } else {
      setFormData({
        animalId: 0,
        heatDetectedDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
  }, [heatDetection, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animalId) {
      return;
    }
    onSubmit(formData);
  };

  // Filter female animals only
  const femaleAnimals = animals?.filter((a) => a.gender === "FEMALE") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {heatDetection ? "Edit Heat Detection" : "Record Heat Detection"}
          </DialogTitle>
          <DialogDescription>
            {heatDetection
              ? "Update heat detection details"
              : "Record a new heat detection event for an animal"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Animal Selection */}
            <div className="grid gap-2">
              <Label htmlFor="animalId">Animal *</Label>
              <Select
                value={formData.animalId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, animalId: parseInt(value) })
                }
                disabled={!!heatDetection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {femaleAnimals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id.toString()}>
                      {animal.tagNumber} - {animal.name || "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Heat Detected Date */}
            <div className="grid gap-2">
              <Label htmlFor="heatDetectedDate">Heat Detected Date *</Label>
              <Input
                id="heatDetectedDate"
                type="date"
                value={formData.heatDetectedDate}
                onChange={(e) =>
                  setFormData({ ...formData, heatDetectedDate: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional observations about heat behavior..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.animalId}
              className="min-w-[140px]"
            >
              {isSubmitting
                ? "Saving..."
                : heatDetection
                ? "Update Record"
                : "Save Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
