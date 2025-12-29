"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { SongStats } from "@/lib/analytics";

interface SongStatsCardProps {
  stats: SongStats[];
  title?: string;
  description?: string;
}

const GENRE_LABELS: Record<string, string> = {
  adoration: "Adoration",
  confession: "Confession",
  thanksgiving: "Thanksgiving",
  supplication: "Supplication",
  christmas: "Christmas",
  hymnal: "Hymnal",
  praise_worship: "Praise & Worship",
};

export function SongStatsCard({ stats, title, description }: SongStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Music className="h-4 w-4" />
          {title || "Song Usage Statistics"}
        </CardTitle>
        <CardDescription className="text-xs">
          {description || "Recently used songs in services"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2 col-span-full">
              No song data available
            </p>
          ) : (
            stats.slice(0, 9).map((song) => (
              <div
                key={song.songId}
                className="p-2 rounded-md border bg-muted/30"
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm line-clamp-1">{song.songTitle}</div>
                  {song.artist && (
                    <div className="text-xs text-muted-foreground line-clamp-1">{song.artist}</div>
                  )}
                  <div className="flex flex-wrap gap-0.5">
                    {song.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="outline" className="text-[10px] h-4 px-1">
                        {GENRE_LABELS[genre]?.split(' ')[0] || genre}
                      </Badge>
                    ))}
                  </div>
                  {song.lastUsed && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5" />
                      {format(song.lastUsed, "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

