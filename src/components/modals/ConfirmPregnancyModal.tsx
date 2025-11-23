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

interface ConfirmPregnancyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breedingRecord: BreedingRecordResponse | null;
  onConfirm: (data: { confirmationDate?: string; remarks?: string }) => void;
  isSubmitting?: boolean;
}

export function ConfirmPregnancyModal({
  open,
  onOpenChange,
  breedingRecord,
  onConfirm,
  isSubmitting = false,
}: ConfirmPregnancyModalProps) {
  const [formData, setFormData] = useState({
    confirmationDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        confirmationDate: new Date().toISOString().split("T")[0],
        remarks: "",
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
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
          <DialogTitle>Confirm Pregnancy</DialogTitle>
          <DialogDescription>
            Confirm pregnancy for {breedingRecord.animalTag}{" "}
            {breedingRecord.animalName && `(${breedingRecord.animalName})`}
            <br />
            Bred on:{" "}
            {new Date(breedingRecord.breedingDate).toLocaleDateString()} (
            {daysSinceBreeding} days ago)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Confirmation Date */}
            <div className="grid gap-2">
              <Label htmlFor="confirmationDate">Confirmation Date *</Label>
              <Input
                id="confirmationDate"
                type="date"
                value={formData.confirmationDate}
                onChange={(e) =>
                  setFormData({ ...formData, confirmationDate: e.target.value })
                }
                min={breedingRecord.breedingDate}
                max={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="text-xs text-muted-foreground">
                Typically checked 30-60 days after breeding
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
                placeholder="Vet notes, ultrasound findings, or other observations..."
                rows={3}
              />
            </div>

            {/* Info Card */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">
                <strong>Expected Calving:</strong>{" "}
                {new Date(
                  breedingRecord.expectedCalvingDate
                ).toLocaleDateString()}
                {breedingRecord.daysUntilCalving && (
                  <span> (in {breedingRecord.daysUntilCalving} days)</span>
                )}
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
              className="min-w-[140px]"
            >
              {isSubmitting ? "Confirming..." : "Confirm Pregnancy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
