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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ban, Search, Users } from "lucide-react";
import type { Person } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExemptionManagerDialogProps {
  people: Person[];
  onToggleExemption: (id: string) => void;
}

export function ExemptionManagerDialog({
  people,
  onToggleExemption,
}: ExemptionManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter people by search
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get counts
  const exemptCount = people.filter((p) => p.isExemptFromAutoSchedule).length;
  const activeCount = people.filter((p) => !p.isExemptFromAutoSchedule).length;

  // Quick actions
  const exemptAll = () => {
    people.forEach((person) => {
      if (!person.isExemptFromAutoSchedule) {
        onToggleExemption(person.id);
      }
    });
  };

  const clearAllExemptions = () => {
    people.forEach((person) => {
      if (person.isExemptFromAutoSchedule) {
        onToggleExemption(person.id);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Ban className="w-4 h-4" />
          Manage Exemptions
          {exemptCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {exemptCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage People Exemptions</DialogTitle>
          <DialogDescription>
            Exempt people from auto-scheduling. They won&apos;t be assigned automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active for scheduling</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-orange-50 dark:bg-orange-950/20 p-3">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{exemptCount}</p>
                <p className="text-xs text-muted-foreground">Exempt from scheduling</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exemptAll}
            className="gap-2"
          >
            <Ban className="w-3 h-3" />
            Exempt All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllExemptions}
            className="gap-2"
          >
            Clear All
          </Button>
        </div>

        {/* People List */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          {filteredPeople.length > 0 ? (
            <div className="divide-y">
              {filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
                    person.isExemptFromAutoSchedule && "bg-orange-50/50 dark:bg-orange-950/10"
                  )}
                >
                  <Checkbox
                    id={`exempt-${person.id}`}
                    checked={person.isExemptFromAutoSchedule}
                    onCheckedChange={() => onToggleExemption(person.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label
                        htmlFor={`exempt-${person.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {person.name}
                      </label>
                      {person.isExemptFromAutoSchedule && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-orange-500 text-orange-600 dark:text-orange-400"
                        >
                          <Ban className="w-3 h-3" />
                          Exempt
                        </Badge>
                      )}
                      {person.priority && person.priority !== "normal" && (
                        <Badge variant="secondary" className="text-xs">
                          {person.priority} priority
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {person.ministries.map((ministry) => (
                        <Badge key={ministry} variant="secondary" className="text-xs">
                          {ministry.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                    {(person.email || person.phone) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {person.email || person.phone}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No people found" : "No people to manage"}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

