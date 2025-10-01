import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Milk } from "lucide-react";

import { FeedRecord } from "@/types/feeds";
import { AddFeedModal } from "@/components/modals/AddFeedModal";

export default function FeedsPage() {
  const [addFeedOpen, setAddFeedOpen] = useState(false);
  const [feeds, setFeeds] = useState<FeedRecord[]>([
    {
      id: "1",
      animalId: "A-001",
      animalTag: "C-001",
      animalName: "Bella",
      feedType: "hay",
      quantity: 10,
      unit: "kg",
      date: "2025-10-01",
      notes: "Morning feeding",
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Animal Feeds
        </h1>
        <Button onClick={() => setAddFeedOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Feed
        </Button>
      </div>

      {/* Feeds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feed Records</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-2">Animal</th>
                <th className="p-2">Feed Type</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Date</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map((feed) => (
                <tr key={feed.id} className="border-t">
                  <td className="p-2">
                    {feed.animalName} ({feed.animalTag})
                  </td>
                  <td className="p-2 capitalize">{feed.feedType}</td>
                  <td className="p-2">
                    {feed.quantity} {feed.unit}
                  </td>
                  <td className="p-2">{feed.date}</td>
                  <td className="p-2">{feed.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Feed Modal */}
      <AddFeedModal
        open={addFeedOpen}
        onOpenChange={setAddFeedOpen}
        onSave={(record) => setFeeds((prev) => [...prev, record])}
      />
    </div>
  );
}
