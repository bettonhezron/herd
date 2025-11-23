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
import { BreedingRecordResponse } from "@/types/breeding";
import { PartyPopper } from "lucide-react";

interface CalvingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breedingRecord: BreedingRecordResponse | null;
  onRecordCalving: (data: { calvingDate?: string; remarks?: string }) => void;
  isSubmitting?: boolean;
}

export function CalvingModal({
  open,
  onOpenChange,
  breedingRecord,
  onRecordCalving,
  isSubmitting = false,
}: CalvingModalProps) {
  const [formData, setFormData] = useState({
    calvingDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    if (open && breedingRecord) {
      const today = new Date();
      const expectedDate = new Date(breedingRecord.expectedCalvingDate);
      const daysDiff = Math.floor(
        (today.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const suggestedDate =
        Math.abs(daysDiff) <= 7
          ? breedingRecord.expectedCalvingDate
          : today.toISOString().split("T")[0];

      setFormData({
        calvingDate: suggestedDate,
        remarks: "",
      });
    }
  }, [open, breedingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordCalving(formData);
  };

  if (!breedingRecord) return null;

  const daysPregnant = breedingRecord.daysPregnant || 0;
  const isOverdue = breedingRecord.isOverdue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-blue-600" />
            Record Calving Event
          </DialogTitle>
          <DialogDescription>
            Record calving for {breedingRecord.animalTag}{" "}
            {breedingRecord.animalName && `(${breedingRecord.animalName})`}
            <br />
            {isOverdue ? (
              <span className="text-orange-600 font-medium">
                Overdue by {Math.abs(breedingRecord.daysUntilCalving || 0)} days
              </span>
            ) : (
              <span>
                Expected:{" "}
                {new Date(
                  breedingRecord.expectedCalvingDate
                ).toLocaleDateString()}
                {breedingRecord.daysUntilCalving !== undefined &&
                  breedingRecord.daysUntilCalving > 0 && (
                    <span> (in {breedingRecord.daysUntilCalving} days)</span>
                  )}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Calving Date */}
            <div className="grid gap-2">
              <Label htmlFor="calvingDate">Calving Date *</Label>
              <Input
                id="calvingDate"
                type="date"
                value={formData.calvingDate}
                onChange={(e) =>
                  setFormData({ ...formData, calvingDate: e.target.value })
                }
                min={breedingRecord.breedingDate}
                max={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="text-xs text-muted-foreground">
                Currently {daysPregnant} days pregnant
              </p>
            </div>

            {/* Remarks */}
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                placeholder="Calf details (gender, health, weight), delivery notes, or other observations..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Include calf tag ID, gender, birth weight, and any
                complications
              </p>
            </div>

            {/* Success Card */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> After recording, remember to:
              </p>
              <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc space-y-0.5">
                <li>Register the calf in the system</li>
                <li>Update dam's lactation status</li>
                <li>Schedule post-calving health check</li>
              </ul>
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
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? "Recording..." : "Record Calving"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
