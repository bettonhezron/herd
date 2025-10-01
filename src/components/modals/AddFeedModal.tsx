import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { FeedRecord, FeedType } from "@/types/feeds";
import { toast } from "sonner";

interface AddFeedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (record: FeedRecord) => void;
}

export function AddFeedModal({
  open,
  onOpenChange,
  onSave,
}: AddFeedModalProps) {
  const [formData, setFormData] = useState<Partial<FeedRecord>>({
    animalId: "",
    animalTag: "",
    animalName: "",
    feedType: "hay",
    quantity: 0,
    unit: "kg",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: FeedRecord = {
      ...(formData as FeedRecord),
      id: crypto.randomUUID(),
    };
    onSave(newRecord);
    toast.success("Feed record added");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Feed Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Animal ID / Tag</Label>
            <Input
              value={formData.animalTag}
              onChange={(e) =>
                setFormData({ ...formData, animalTag: e.target.value })
              }
              placeholder="C-001"
              required
            />
          </div>
          <div>
            <Label>Animal Name</Label>
            <Input
              value={formData.animalName}
              onChange={(e) =>
                setFormData({ ...formData, animalName: e.target.value })
              }
              placeholder="Bella"
              required
            />
          </div>
          <div>
            <Label>Feed Type</Label>
            <Select
              value={formData.feedType}
              onValueChange={(value) =>
                setFormData({ ...formData, feedType: value as FeedType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feed type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hay">Hay</SelectItem>
                <SelectItem value="silage">Silage</SelectItem>
                <SelectItem value="concentrate">Concentrate</SelectItem>
                <SelectItem value="minerals">Minerals</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                placeholder="10"
                required
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value as "kg" | "liters" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Extra details..."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
