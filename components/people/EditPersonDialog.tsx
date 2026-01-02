"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { MINISTRIES } from "@/lib/constants";
import type { Person, Ministry } from "@/lib/types";

interface EditPersonDialogProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPerson: (
    id: string,
    data: {
      name: string;
      email?: string;
      phone?: string;
      gender: "male" | "female";
      priority?: "high" | "normal" | "low";
      ministries: Ministry[];
    }
  ) => void;
}

export function EditPersonDialog({
  person,
  open,
  onOpenChange,
  onEditPerson,
}: EditPersonDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male" as "male" | "female",
    priority: "normal" as "high" | "normal" | "low",
    ministries: [] as Ministry[],
  });

  useEffect(() => {
    if (person) {
      setFormData((prev) => ({
        ...prev,
        name: person.name,
        email: person.email || "",
        phone: person.phone || "",
        gender: person.gender,
        priority: person.priority || "normal",
        ministries: [...person.ministries],
      }));
    }
  }, [person]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!person || !formData.name.trim()) return;

    onEditPerson(person.id, {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      gender: formData.gender,
      priority: formData.priority,
      ministries: formData.ministries,
    });

    onOpenChange(false);
  };

  const toggleMinistry = (ministry: Ministry) => {
    setFormData((prev) => ({
      ...prev,
      ministries: prev.ministries.includes(ministry)
        ? prev.ministries.filter((m) => m !== ministry)
        : [...prev.ministries, ministry],
    }));
  };

  if (!person) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit Person</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update person information and ministry assignments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-zinc-300">
                Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-name"
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
              <Label htmlFor="edit-email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="edit-email"
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
              <Label htmlFor="edit-phone" className="text-zinc-300">
                Phone
              </Label>
              <Input
                id="edit-phone"
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
                <Label htmlFor="edit-gender" className="text-zinc-300">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female") =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger
                    id="edit-gender"
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
                <Label htmlFor="edit-priority" className="text-zinc-300">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "normal" | "low") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger
                    id="edit-priority"
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
                      id={`edit-ministry-${ministry.value}`}
                      checked={formData.ministries.includes(ministry.value)}
                      onCheckedChange={() => toggleMinistry(ministry.value)}
                      className="mt-1 border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor={`edit-ministry-${ministry.value}`}
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
              onClick={() => onOpenChange(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
