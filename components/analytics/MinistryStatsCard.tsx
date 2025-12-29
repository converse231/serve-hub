"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import type { MinistryStats } from "@/lib/analytics";

interface MinistryStatsCardProps {
  stats: MinistryStats[];
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

export function MinistryStatsCard({ stats }: MinistryStatsCardProps) {
  const maxAssignments = Math.max(...stats.map((s) => s.totalAssignments), 1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4" />
          Ministry Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Assignment statistics by ministry
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2.5">
          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No ministry data available
            </p>
          ) : (
            stats.map((ministry) => {
              const percentage = (ministry.totalAssignments / maxAssignments) * 100;
              
              return (
                <div key={ministry.ministry} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {MINISTRY_LABELS[ministry.ministry] || ministry.ministry}
                    </span>
                    <span className="text-xs font-semibold tabular-nums">{ministry.totalAssignments}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-0.5">
                      <Users className="h-2.5 w-2.5" />
                      {ministry.uniquePeople} {ministry.uniquePeople === 1 ? "person" : "people"}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {ministry.averagePerMonth.toFixed(1)}/mo
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

