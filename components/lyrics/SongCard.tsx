"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Edit, Trash2, Eye, Calendar } from "lucide-react";
import type { Song } from "@/lib/types";
import { SONG_GENRES, SONG_LANGUAGES } from "@/lib/constants";
import { format } from "date-fns";

interface SongCardProps {
  song: Song;
  onView: (song: Song) => void;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export function SongCard({ song, onView, onEdit, onDelete }: SongCardProps) {
  const getGenreLabel = (value?: string) => {
    if (!value) return null;
    return SONG_GENRES.find((g) => g.value === value)?.label || value;
  };

  const getLanguageLabel = (value: string) => {
    return SONG_LANGUAGES.find((l) => l.value === value)?.label || value;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg truncate">{song.title}</h3>
            </div>
            {song.artist && (
              <p className="text-sm text-muted-foreground truncate">
                {song.artist}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onView(song)}
            >
              <Eye className="w-4 h-4" />
              <span className="sr-only">View</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(song)}
            >
              <Edit className="w-4 h-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(song.id)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          {song.key && (
            <Badge variant="outline" className="gap-1">
              <Music className="w-3 h-3" />
              Key: {song.key}
            </Badge>
          )}
          {song.tempo && (
            <Badge variant="outline">{song.tempo}</Badge>
          )}
          <Badge variant="secondary">
            {getLanguageLabel(song.language)}
          </Badge>
          {song.genre && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {getGenreLabel(song.genre)}
            </Badge>
          )}
        </div>

        {/* Last Sang */}
        {song.lastSang && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Last sang: {format(song.lastSang, "MMM d, yyyy")}</span>
          </div>
        )}

        {/* Lyrics Preview */}
        <div className="text-sm text-muted-foreground line-clamp-2">
          {song.lyrics.split('\n')[0]}...
        </div>

        {/* Tags */}
        {song.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {song.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

