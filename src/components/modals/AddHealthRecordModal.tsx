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

interface HealthRecord {
  id?: string;
  animalId: string;
  type: "vaccination" | "treatment" | "checkup" | "emergency" | "";
  date: string;
  veterinarian?: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

interface AddHealthRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  health?: HealthRecord | null;
  onSave?: (record: HealthRecord) => void;
}

export function AddHealthRecordModal({
  open,
  onOpenChange,
  health,
  onSave,
}: AddHealthRecordModalProps) {
  const [formData, setFormData] = useState<HealthRecord>({
    animalId: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
    veterinarian: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  useEffect(() => {
    if (health) {
      setFormData(health);
    } else {
      setFormData({
        animalId: "",
        type: "",
        date: new Date().toISOString().split("T")[0],
        veterinarian: "",
        diagnosis: "",
        treatment: "",
        notes: "",
      });
    }
  }, [health, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSave) {
      onSave(formData);
    } else {
      toast.success(
        health
          ? "Health record updated successfully"
          : "Health record added successfully"
      );
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {health ? "Edit Health Record" : "Add Health Record"}
          </DialogTitle>
          <DialogDescription>
            {health
              ? "Update the selected health event or treatment."
              : "Record a new health event or treatment."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="animalId">Animal ID</Label>
              <Input
                id="animalId"
                value={formData.animalId}
                onChange={(e) =>
                  setFormData({ ...formData, animalId: e.target.value })
                }
                placeholder="e.g., C-001"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as HealthRecord["type"],
                  })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="veterinarian">Veterinarian</Label>
              <Input
                id="veterinarian"
                value={formData.veterinarian}
                onChange={(e) =>
                  setFormData({ ...formData, veterinarian: e.target.value })
                }
                placeholder="Dr. Jane Doe"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosis: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Input
                id="treatment"
                value={formData.treatment}
                onChange={(e) =>
                  setFormData({ ...formData, treatment: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {health ? "Update Record" : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
