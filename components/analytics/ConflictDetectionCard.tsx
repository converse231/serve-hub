"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { ScheduleConflict } from "@/lib/conflictDetection";
import type { Person } from "@/lib/types";

interface ConflictDetectionCardProps {
  conflicts: ScheduleConflict[];
  people: Person[];
}

const MINISTRY_LABELS: Record<string, string> = {
  musician: "Musician",
  usher: "Usher",
  multimedia: "Multimedia",
  singer: "Singer",
  scripture_reader: "Scripture Reader",
  prayer_leader: "Prayer Leader",
  host: "Host",
};

export function ConflictDetectionCard({ conflicts, people }: ConflictDetectionCardProps) {
  // Map person IDs to names
  const conflictsWithNames = conflicts.map((conflict) => {
    const person = people.find((p) => p.id === conflict.personId);
    return {
      ...conflict,
      personName: person?.name || "Unknown Person",
    };
  });

  const highSeverity = conflictsWithNames.filter((c) => c.severity === "high");
  const mediumSeverity = conflictsWithNames.filter((c) => c.severity === "medium");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4" />
          Conflict Detection
        </CardTitle>
        <CardDescription className="text-xs">
          Identifies people assigned multiple times
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {conflictsWithNames.length === 0 ? (
          <div className="text-center py-4 space-y-1">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
            <p className="font-medium text-sm">No conflicts detected!</p>
            <p className="text-xs text-muted-foreground">
              All schedules are conflict-free
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {highSeverity.length}
                </div>
                <div className="text-[10px] text-red-600/80 dark:text-red-400/80">
                  High Priority
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded-md">
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {mediumSeverity.length}
                </div>
                <div className="text-[10px] text-yellow-600/80 dark:text-yellow-400/80">
                  Medium Priority
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {conflictsWithNames.map((conflict, index) => (
                <div
                  key={`${conflict.personId}-${index}`}
                  className={`p-2 rounded-md border ${
                    conflict.severity === "high"
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
                      : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle
                        className={`h-3 w-3 ${
                          conflict.severity === "high" ? "text-red-600" : "text-yellow-600"
                        }`}
                      />
                      <span className="font-medium text-sm">{conflict.personName}</span>
                    </div>
                    <Badge
                      variant={conflict.severity === "high" ? "destructive" : "secondary"}
                      className="text-[10px] h-4 px-1"
                    >
                      {conflict.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5" />
                      {format(conflict.date, "MMM d, yyyy")}
                    </div>

                    <div>
                      <span className="font-medium">Roles:</span>{" "}
                      {conflict.ministries.map((m) => MINISTRY_LABELS[m]?.split(' ')[0] || m).join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

