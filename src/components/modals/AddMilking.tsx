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
import { toast } from "sonner";
import { useState } from "react";

interface AddMilkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: string;
    animalId: string;
    animalName: string;
    date: string;
    time: string;
    quantity: number;
    fat: number;
    protein: number;
    scc: number;
    temperature: number;
    quality: string;
    session: string;
  };
}

export function AddMilkingModal({
  open,
  onOpenChange,
  editData,
}: AddMilkingModalProps) {
  const [formData, setFormData] = useState({
    animalId: editData?.animalId || "",
    date: editData?.date || new Date().toISOString().split("T")[0],
    time: editData?.time || "",
    quantity: editData?.quantity?.toString() || "",
    fat: editData?.fat?.toString() || "",
    protein: editData?.protein?.toString() || "",
    scc: editData?.scc?.toString() || "",
    temperature: editData?.temperature?.toString() || "",
    quality: editData?.quality || "good",
    session: editData?.session || "morning",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      editData
        ? "Milking record updated successfully"
        : "Milking record added successfully"
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Wider but scrollable dialog for long forms */}
      <DialogContent className="w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Milking Record" : "Add Milking Record"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Update the milking record details"
              : "Record new milking session details and quality metrics"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Animal + Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalId">Animal ID *</Label>
              <Select
                value={formData.animalId}
                onValueChange={(value) =>
                  setFormData({ ...formData, animalId: value })
                }
              >
                <SelectTrigger id="animalId">
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A001">A001 - Bessie</SelectItem>
                  <SelectItem value="A002">A002 - Daisy</SelectItem>
                  <SelectItem value="A003">A003 - Luna</SelectItem>
                  <SelectItem value="A004">A004 - Stella</SelectItem>
                  <SelectItem value="A005">A005 - Rose</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Session *</Label>
              <Select
                value={formData.session}
                onValueChange={(value) =>
                  setFormData({ ...formData, session: value })
                }
              >
                <SelectTrigger id="session">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Quantity + Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Liters) *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                placeholder="28.5"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C) *</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="37.2"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Fat + Protein + SCC */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fat">Fat % *</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                placeholder="3.8"
                value={formData.fat}
                onChange={(e) =>
                  setFormData({ ...formData, fat: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein % *</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder="3.2"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({ ...formData, protein: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scc">SCC *</Label>
              <Input
                id="scc"
                type="number"
                placeholder="150000"
                value={formData.scc}
                onChange={(e) =>
                  setFormData({ ...formData, scc: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <Label htmlFor="quality">Quality Assessment *</Label>
            <Select
              value={formData.quality}
              onValueChange={(value) =>
                setFormData({ ...formData, quality: value })
              }
            >
              <SelectTrigger id="quality">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button type="submit" className="min-w-[140px]">
              {editData ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
