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
import {
  BreedingMethod,
  BreedingRecordRequest,
  HeatDetectionResponse,
  BREEDING_METHOD_OPTIONS,
} from "@/types/breeding";

interface BreedingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heatDetection: HeatDetectionResponse | null;
  onSubmit: (data: BreedingRecordRequest) => void;
  isSubmitting?: boolean;
}

export function BreedingModal({
  open,
  onOpenChange,
  heatDetection,
  onSubmit,
  isSubmitting = false,
}: BreedingModalProps) {
  const [formData, setFormData] = useState<BreedingRecordRequest>({
    breedingDate: new Date().toISOString().split("T")[0],
    method: BreedingMethod.AI,
    remarks: "",
  });

  useEffect(() => {
    if (heatDetection) {
      // Calculate expected calving date (approximately 283 days from breeding)
      const breedingDate = new Date();
      const expectedDate = new Date(breedingDate);
      expectedDate.setDate(expectedDate.getDate() + 283);

      setFormData({
        breedingDate: new Date().toISOString().split("T")[0],
        method: BreedingMethod.AI,
        expectedCalvingDate: expectedDate.toISOString().split("T")[0],
        remarks: "",
      });
    }
  }, [heatDetection, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Update expected calving date when breeding date changes
  const handleBreedingDateChange = (date: string) => {
    setFormData({ ...formData, breedingDate: date });

    // Auto-calculate expected calving date (283 days)
    const breeding = new Date(date);
    const expected = new Date(breeding);
    expected.setDate(expected.getDate() + 283);

    setFormData((prev) => ({
      ...prev,
      breedingDate: date,
      expectedCalvingDate: expected.toISOString().split("T")[0],
    }));
  };

  if (!heatDetection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Breeding Event</DialogTitle>
          <DialogDescription>
            Record breeding for {heatDetection.animalTag}{" "}
            {heatDetection.animalName && `(${heatDetection.animalName})`}
            <br />
            Heat detected:{" "}
            {new Date(heatDetection.heatDetectedDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Breeding Date */}
            <div className="grid gap-2">
              <Label htmlFor="breedingDate">Breeding Date *</Label>
              <Input
                id="breedingDate"
                type="date"
                value={formData.breedingDate}
                onChange={(e) => handleBreedingDateChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Method */}
            <div className="grid gap-2">
              <Label htmlFor="method">Breeding Method *</Label>
              <Select
                value={formData.method}
                onValueChange={(value: BreedingMethod) =>
                  setFormData({ ...formData, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {BREEDING_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expected Calving Date */}
            <div className="grid gap-2">
              <Label htmlFor="expectedCalvingDate">Expected Calving Date</Label>
              <Input
                id="expectedCalvingDate"
                type="date"
                value={formData.expectedCalvingDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expectedCalvingDate: e.target.value,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Auto-calculated as 283 days from breeding date
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
                placeholder="Additional notes about the breeding event..."
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
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? "Recording..." : "Record Breeding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
