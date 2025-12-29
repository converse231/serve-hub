"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { MINISTRIES } from "@/lib/constants";
import type { Ministry } from "@/lib/types";

interface AddPersonDialogProps {
  onAddPerson: (person: {
    name: string;
    email?: string;
    phone?: string;
    gender: "male" | "female";
    priority?: "high" | "normal" | "low";
    ministries: Ministry[];
  }) => void;
}

export function AddPersonDialog({ onAddPerson }: AddPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male" as "male" | "female",
    priority: "normal" as "high" | "normal" | "low",
    ministries: [] as Ministry[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    onAddPerson({
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      gender: formData.gender,
      priority: formData.priority,
      ministries: formData.ministries,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "male",
      priority: "normal",
      ministries: [],
    });
    setOpen(false);
  };

  const toggleMinistry = (ministry: Ministry) => {
    setFormData((prev) => ({
      ...prev,
      ministries: prev.ministries.includes(ministry)
        ? prev.ministries.filter((m) => m !== ministry)
        : [...prev.ministries, ministry],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Person</DialogTitle>
            <DialogDescription>
              Add a new person to your ministry team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="text-base"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female") =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "normal" | "low") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Higher priority = more likely to be assigned
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Ministries</Label>
              <div className="space-y-3 rounded-lg border p-4">
                {MINISTRIES.map((ministry) => (
                  <div key={ministry.value} className="flex items-start space-x-3">
                    <Checkbox
                      id={`ministry-${ministry.value}`}
                      checked={formData.ministries.includes(ministry.value)}
                      onCheckedChange={() => toggleMinistry(ministry.value)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor={`ministry-${ministry.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {ministry.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {ministry.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Person</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

