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
  children?: React.ReactNode;
}

export function AddPersonDialog({
  onAddPerson,
  children,
}: AddPersonDialogProps) {
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
        {children || (
          <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold">
            <Plus className="w-4 h-4" />
            Add Person
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Add New Person</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add a new person to your ministry team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-zinc-300">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female") =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger
                    id="gender"
                    className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-zinc-300">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "normal" | "low") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger
                    id="priority"
                    className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                  Higher priority = more likely to be assigned
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300">Ministries</Label>
              <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4">
                {MINISTRIES.map((ministry) => (
                  <div
                    key={ministry.value}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`ministry-${ministry.value}`}
                      checked={formData.ministries.includes(ministry.value)}
                      onCheckedChange={() => toggleMinistry(ministry.value)}
                      className="mt-1 border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor={`ministry-${ministry.value}`}
                        className="text-sm font-medium leading-none cursor-pointer text-white"
                      >
                        {ministry.label}
                      </label>
                      <p className="text-xs text-zinc-500">
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
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
            >
              Add Person
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
