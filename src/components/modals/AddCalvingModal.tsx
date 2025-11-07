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

interface CalvingData {
  calvingDate: string;
  calvingTime: string;
  calfGender: "male" | "female";
  calfWeight: string;
  calfHealth: "healthy" | "weak" | "critical";
  motherCondition: "excellent" | "good" | "fair" | "poor";
  assistanceRequired: "none" | "minimal" | "moderate" | "extensive";
  calfTag: string;
  notes: string;
}

interface AddCalvingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pregnancyRecord?: {
    animalTag: string;
    animalName: string;
  };
  onSave?: (data: CalvingData) => void;
}

export function AddCalvingModal({
  open,
  onOpenChange,
  pregnancyRecord,
  onSave,
}: AddCalvingModalProps) {
  const [formData, setFormData] = useState<CalvingData>({
    calvingDate: new Date().toISOString().split("T")[0],
    calvingTime: new Date().toTimeString().slice(0, 5),
    calfGender: "female",
    calfWeight: "",
    calfHealth: "healthy",
    motherCondition: "good",
    assistanceRequired: "none",
    calfTag: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      toast.success("Calving record saved successfully");
    }
    onOpenChange(false);
    setFormData({
      calvingDate: new Date().toISOString().split("T")[0],
      calvingTime: new Date().toTimeString().slice(0, 5),
      calfGender: "female",
      calfWeight: "",
      calfHealth: "healthy",
      motherCondition: "good",
      assistanceRequired: "none",
      calfTag: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Calving</DialogTitle>
          <DialogDescription>
            {pregnancyRecord
              ? `Record calving details for ${pregnancyRecord.animalName} (Tag: ${pregnancyRecord.animalTag})`
              : "Record calving details and calf information"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="calvingDate">Calving Date</Label>
                <Input
                  id="calvingDate"
                  type="date"
                  value={formData.calvingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, calvingDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calvingTime">Calving Time</Label>
                <Input
                  id="calvingTime"
                  type="time"
                  value={formData.calvingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, calvingTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="calfTag">Calf Tag ID</Label>
              <Input
                id="calfTag"
                value={formData.calfTag}
                onChange={(e) =>
                  setFormData({ ...formData, calfTag: e.target.value })
                }
                placeholder="C-2401"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="calfGender">Calf Gender</Label>
                <Select
                  value={formData.calfGender}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, calfGender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calfWeight">Calf Weight (kg)</Label>
                <Input
                  id="calfWeight"
                  type="number"
                  step="0.1"
                  value={formData.calfWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, calfWeight: e.target.value })
                  }
                  placeholder="35.5"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="calfHealth">Calf Health Status</Label>
              <Select
                value={formData.calfHealth}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, calfHealth: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select health status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="weak">Weak</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="motherCondition">Mother's Condition</Label>
              <Select
                value={formData.motherCondition}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, motherCondition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assistanceRequired">Assistance Required</Label>
              <Select
                value={formData.assistanceRequired}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, assistanceRequired: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assistance level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Natural)</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="extensive">
                    Extensive (Veterinary)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any complications, observations, or special notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Record Calving</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
