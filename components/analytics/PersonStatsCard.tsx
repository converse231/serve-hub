"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { PersonStats } from "@/lib/analytics";

interface PersonStatsCardProps {
  stats: PersonStats[];
  title?: string;
  description?: string;
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

export function PersonStatsCard({ stats, title, description }: PersonStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          {title || "Who Serves Most Often"}
        </CardTitle>
        <CardDescription className="text-xs">
          {description || "People with the most assignments"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No assignment data available
            </p>
          ) : (
            stats.map((person, index) => (
              <div
                key={person.personId}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">{person.personName}</span>
                    {index < 3 && (
                      <Badge variant="default" className="text-[10px] h-4 px-1">
                        #{index + 1}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-0.5">
                    {Object.entries(person.byMinistry).slice(0, 3).map(([ministry, count]) => (
                      <span key={ministry} className="text-[10px] text-muted-foreground">
                        {MINISTRY_LABELS[ministry]?.split(' ')[0] || ministry}: {count}×
                        {Object.keys(person.byMinistry).indexOf(ministry) < Object.keys(person.byMinistry).length - 1 && " • "}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <span className="font-bold text-base tabular-nums">{person.totalAssignments}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

