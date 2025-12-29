"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Copy, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { Schedule, Person } from "@/lib/types";
import { MINISTRIES } from "@/lib/constants";

interface ScheduleDetailDialogProps {
  schedule: Schedule | null;
  people: Person[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDetailDialog({
  schedule,
  people,
  open,
  onOpenChange,
}: ScheduleDetailDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!schedule) return null;

  const getPersonById = (id: string) => {
    return people.find((p) => p.id === id);
  };

  const getMinistryLabel = (value: string) => {
    return MINISTRIES.find((m) => m.value === value)?.label || value;
  };

  // Generate text format for copying
  const generateTextSchedule = () => {
    let text = `SERVICE SCHEDULE\n`;
    text += `${format(schedule.date, "EEEE, MMMM d, yyyy")}\n`;
    text += `${schedule.serviceType.replace("_", " ").toUpperCase()}\n`;
    text += `\n`;
    text += `ASSIGNMENTS:\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    schedule.assignments.forEach((assignment) => {
      const person = getPersonById(assignment.personId);
      if (person) {
        text += `${getMinistryLabel(assignment.ministry)}:\n`;
        text += `  • ${person.name}\n`;
        if (person.phone) {
          text += `    📱 ${person.phone}\n`;
        }
        text += `\n`;
      }
    });

    if (schedule.notes) {
      text += `NOTES:\n${schedule.notes}\n`;
    }

    return text;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateTextSchedule());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Schedule Details</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              {format(schedule.date, "EEEE, MMMM d, yyyy")}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Type */}
          <div>
            <Badge variant="secondary" className="text-sm">
              {schedule.serviceType.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Assignments */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-lg">
                Assignments ({schedule.assignments.length})
              </h3>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {schedule.assignments.map((assignment) => {
                const person = getPersonById(assignment.personId);
                if (!person) return null;

                return (
                  <Card key={assignment.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <Badge variant="outline" className="mb-2">
                          {getMinistryLabel(assignment.ministry)}
                        </Badge>
                        <p className="font-semibold">{person.name}</p>
                        {person.phone && (
                          <p className="text-sm text-muted-foreground">
                            📱 {person.phone}
                          </p>
                        )}
                        {person.email && (
                          <p className="text-sm text-muted-foreground truncate">
                            ✉️ {person.email}
                          </p>
                        )}
                        <div className="pt-2">
                          {assignment.confirmed ? (
                            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {schedule.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm">{schedule.notes}</p>
              </div>
            </div>
          )}

          {/* Text Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Copy Schedule</h3>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant={copied ? "default" : "outline"}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={generateTextSchedule()}
              readOnly
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

