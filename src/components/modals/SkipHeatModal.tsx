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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeatDetectionResponse } from "@/types/breeding";
import { XCircle } from "lucide-react";

interface SkipHeatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heatDetection: HeatDetectionResponse | null;
  onSkip: (reason?: string) => void;
  isSubmitting?: boolean;
}

const SKIP_REASONS = [
  "Animal still recovering",
  "Poor body condition",
  "Recent illness",
  "Waiting for better timing",
  "Insufficient resources",
  "Will breed next cycle",
  "Other - See notes below",
];

export function SkipHeatModal({
  open,
  onOpenChange,
  heatDetection,
  onSkip,
  isSubmitting = false,
}: SkipHeatModalProps) {
  const [reason, setReason] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setCustomNotes("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      reason === "Other - See notes below" ? customNotes : reason;
    onSkip(finalReason || undefined);
  };

  if (!heatDetection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-600" />
            Skip Heat Detection
          </DialogTitle>
          <DialogDescription>
            Skip breeding for {heatDetection.animalTag}{" "}
            {heatDetection.animalName && `(${heatDetection.animalName})`}
            <br />
            Heat detected:{" "}
            {new Date(heatDetection.heatDetectedDate).toLocaleDateString()} (
            {heatDetection.daysInHeat}{" "}
            {heatDetection.daysInHeat === 1 ? "day" : "days"} ago)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Reason Selection */}
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Skipping (Optional)</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {SKIP_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Notes - shown when "Other" is selected */}
            {reason === "Other - See notes below" && (
              <div className="grid gap-2">
                <Label htmlFor="customNotes">Additional Details</Label>
                <Textarea
                  id="customNotes"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Provide details for skipping this heat cycle..."
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Info Card */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This heat detection will be marked as
                skipped. The animal will be available for breeding during the
                next heat cycle.
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
              variant="secondary"
              className="min-w-[140px]"
            >
              {isSubmitting ? "Skipping..." : "Skip This Heat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
