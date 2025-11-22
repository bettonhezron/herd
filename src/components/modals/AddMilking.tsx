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
import { useState, useEffect, useMemo } from "react";
import { useRecordMilking, useUpdateMilkingRecord } from "@/hooks/useMilking";
import { useAnimalSummary } from "@/hooks/useAnimal";
import {
  MilkingRecordRequest,
  MilkingRecordResponse,
  MilkingShift,
  SHIFT_OPTIONS,
} from "@/types/milking";
import { Loader2, Search } from "lucide-react";

interface AddMilkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: MilkingRecordResponse;
}

const initialFormState = {
  animalId: "",
  milkingDate: new Date().toISOString().split("T")[0],
  shift: MilkingShift.MORNING,
  quantity: "",
  remarks: "",
};

export function AddMilkingModal({
  open,
  onOpenChange,
  editData,
}: AddMilkingModalProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: animals, isLoading: animalsLoading } = useAnimalSummary();
  const recordMilking = useRecordMilking();
  const updateMilking = useUpdateMilkingRecord();

  const isLoading = recordMilking.isPending || updateMilking.isPending;

  // Filter for lactating cows only
  const lactatingCows = useMemo(() => {
    if (!animals) return [];
    return animals.filter(
      (animal) =>
        animal.gender === "FEMALE" &&
        animal.lactationStatus === "LACTATING" &&
        animal.status === "ACTIVE"
    );
  }, [animals]);

  // Filter by search query
  const filteredAnimals = useMemo(() => {
    if (!searchQuery.trim()) return lactatingCows;
    const query = searchQuery.toLowerCase();
    return lactatingCows.filter(
      (animal) =>
        animal.tagNumber.toLowerCase().includes(query) ||
        animal.name?.toLowerCase().includes(query)
    );
  }, [lactatingCows, searchQuery]);

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (open && editData) {
      setFormData({
        animalId: editData.animalId.toString(),
        milkingDate: editData.milkingDate,
        shift: editData.shift,
        quantity: editData.quantity.toString(),
        remarks: editData.remarks || "",
      });
      setSearchQuery("");
    } else if (open) {
      setFormData(initialFormState);
      setSearchQuery("");
    }
  }, [open, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: MilkingRecordRequest = {
      animalId: parseInt(formData.animalId),
      milkingDate: formData.milkingDate,
      shift: formData.shift,
      quantity: parseFloat(formData.quantity),
      remarks: formData.remarks || undefined,
    };

    try {
      if (editData) {
        await updateMilking.mutateAsync({ id: editData.id, payload });
      } else {
        await recordMilking.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // Error handled by mutation's onError
    }
  };

  // Get selected animal details for display
  const selectedAnimal = useMemo(() => {
    if (!formData.animalId || !animals) return null;
    return animals.find((a) => a.id.toString() === formData.animalId);
  }, [formData.animalId, animals]);

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="w-[90%] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Milking Record" : "Add Milking Record"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? `Update record for ${editData.animalName || editData.animalTag}`
              : "Record new milking session"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Animal Selection */}
          <div className="space-y-2">
            <Label htmlFor="animalId">Animal *</Label>
            <Select
              value={formData.animalId}
              onValueChange={(value) => {
                setFormData({ ...formData, animalId: value });
                setSearchQuery("");
              }}
              disabled={isLoading || !!editData}
            >
              <SelectTrigger id="animalId">
                <SelectValue placeholder="Select animal">
                  {selectedAnimal
                    ? `${selectedAnimal.tagNumber} - ${
                        selectedAnimal.name || "Unnamed"
                      }`
                    : "Select animal"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 pb-2">
                  <div className="flex items-center border rounded-md px-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by tag or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                {animalsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredAnimals.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    {searchQuery
                      ? "No animals found"
                      : "No lactating cows available"}
                  </div>
                ) : (
                  filteredAnimals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{animal.tagNumber}</span>
                        <span className="text-muted-foreground ml-2">
                          {animal.name || "Unnamed"}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedAnimal && (
              <p className="text-xs text-muted-foreground">
                {selectedAnimal.breed} • {selectedAnimal.daysInMilk} days in
                milk
              </p>
            )}
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
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Shift *</Label>
              <Select
                value={formData.shift}
                onValueChange={(value) =>
                  setFormData({ ...formData, shift: value as MilkingShift })
                }
                disabled={isLoading}
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
              placeholder="e.g. 25.5"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Optional notes about this milking session..."
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.animalId || !formData.quantity}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editData ? "Updating..." : "Saving..."}
                </>
              ) : editData ? (
                "Update Record"
              ) : (
                "Save Record"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
