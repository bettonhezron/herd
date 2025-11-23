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
import { BreedingRecordResponse } from "@/types/breeding";
import { AlertTriangle } from "lucide-react";

interface MarkPregnancyFailedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breedingRecord: BreedingRecordResponse | null;
  onMarkFailed: (data: { checkDate?: string; reason?: string }) => void;
  isSubmitting?: boolean;
}

const FAILURE_REASONS = [
  "Not Pregnant - Negative Test",
  "Early Embryonic Death",
  "Reabsorption",
  "Miscarriage",
  "Other - See Notes",
];

export function MarkPregnancyFailedModal({
  open,
  onOpenChange,
  breedingRecord,
  onMarkFailed,
  isSubmitting = false,
}: MarkPregnancyFailedModalProps) {
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    reason: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        checkDate: new Date().toISOString().split("T")[0],
        reason: "",
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMarkFailed(formData);
  };

  if (!breedingRecord) return null;

  const daysSinceBreeding = Math.floor(
    (new Date().getTime() - new Date(breedingRecord.breedingDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Mark Pregnancy as Failed
          </DialogTitle>
          <DialogDescription>
            Record that {breedingRecord.animalTag}{" "}
            {breedingRecord.animalName && `(${breedingRecord.animalName})`} is
            not pregnant
            <br />
            Bred on:{" "}
            {new Date(breedingRecord.breedingDate).toLocaleDateString()} (
            {daysSinceBreeding} days ago)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Check Date */}
            <div className="grid gap-2">
              <Label htmlFor="checkDate">Check Date *</Label>
              <Input
                id="checkDate"
                type="date"
                value={formData.checkDate}
                onChange={(e) =>
                  setFormData({ ...formData, checkDate: e.target.value })
                }
                min={breedingRecord.breedingDate}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Reason */}
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Select
                value={formData.reason}
                onValueChange={(value) =>
                  setFormData({ ...formData, reason: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {FAILURE_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes */}
            {formData.reason === "Other - See Notes" && (
              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Provide details..."
                  rows={3}
                />
              </div>
            )}

            {/* Warning Card */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> This will mark the breeding as failed.
                The animal will be available for rebreeding.
              </p>
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
              variant="destructive"
              className="min-w-[140px]"
            >
              {isSubmitting ? "Updating..." : "Mark as Failed"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
