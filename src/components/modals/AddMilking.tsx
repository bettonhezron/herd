import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useState, useEffect } from "react";
import { useRecordMilking, useUpdateMilkingRecord } from "@/hooks/useMilking";
import { useAnimals } from "@/hooks/useAnimal";
import { MilkingShift, SHIFT_OPTIONS } from "@/types/milking";

interface AddMilkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: number;
    animalId: number;
    animalTag: string;
    milkingDate: string;
    shift: MilkingShift;
    quantity: number;
    remarks?: string;
  };
}

export function AddMilkingModal({
  open,
  onOpenChange,
  editData,
}: AddMilkingModalProps) {
  const { data: animals, isLoading: animalsLoading } = useAnimals();
  const recordMilking = useRecordMilking();
  const updateMilking = useUpdateMilkingRecord();

  const [formData, setFormData] = useState({
    animalId: editData?.animalId?.toString() || "",
    milkingDate:
      editData?.milkingDate || new Date().toISOString().split("T")[0],
    shift: editData?.shift || MilkingShift.MORNING,
    quantity: editData?.quantity?.toString() || "",
    remarks: editData?.remarks || "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        animalId: editData.animalId.toString(),
        milkingDate: editData.milkingDate,
        shift: editData.shift,
        quantity: editData.quantity.toString(),
        remarks: editData.remarks || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      animalId: parseInt(formData.animalId),
      milkingDate: formData.milkingDate,
      shift: formData.shift,
      quantity: parseFloat(formData.quantity),
      remarks: formData.remarks || undefined,
    };

    try {
      if (editData) {
        await updateMilking.mutateAsync({
          id: editData.id,
          payload,
        });
      } else {
        await recordMilking.mutateAsync(payload);
      }
      onOpenChange(false);
      // Reset form
      setFormData({
        animalId: "",
        milkingDate: new Date().toISOString().split("T")[0],
        shift: MilkingShift.MORNING,
        quantity: "",
        remarks: "",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Filter only lactating cows
  const lactatingCows = animals?.filter(
    (animal) => animal.lactationStatus === "LACTATING"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Milking Record" : "Record Milking Session"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Update the milking record details"
              : "Record milk production for a lactating cow"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Animal Selection */}
          <div className="space-y-2">
            <Label htmlFor="animalId">Animal *</Label>
            <Select
              value={formData.animalId}
              onValueChange={(value) =>
                setFormData({ ...formData, animalId: value })
              }
              disabled={!!editData || animalsLoading}
            >
              <SelectTrigger id="animalId">
                <SelectValue placeholder="Select lactating cow" />
              </SelectTrigger>
              <SelectContent>
                {lactatingCows?.map((animal) => (
                  <SelectItem key={animal.id} value={animal.id.toString()}>
                    {animal.tagNumber}
                    {/* {animal.daysInMilk && ` (${animal.daysInMilk} DIM)`} */}
                  </SelectItem>
                ))}
                {lactatingCows?.length === 0 && (
                  <SelectItem value="none" disabled>
                    No lactating cows available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date + Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="milkingDate">Date *</Label>
              <Input
                id="milkingDate"
                type="date"
                value={formData.milkingDate}
                onChange={(e) =>
                  setFormData({ ...formData, milkingDate: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                required
                disabled={!!editData}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Shift *</Label>
              <Select
                value={formData.shift}
                onValueChange={(value) =>
                  setFormData({ ...formData, shift: value as MilkingShift })
                }
                disabled={!!editData}
              >
                <SelectTrigger id="shift">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {SHIFT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Liters) *</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              placeholder="12.5"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter milk quantity in liters
            </p>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Any observations or notes..."
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={recordMilking.isPending || updateMilking.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={recordMilking.isPending || updateMilking.isPending}
            >
              {recordMilking.isPending || updateMilking.isPending
                ? "Saving..."
                : editData
                ? "Update Record"
                : "Save Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
