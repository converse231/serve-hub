"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-200 hover:bg-zinc-900/80 hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-violet-500/10">
              <Music className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white truncate">{song.title}</h3>
          </div>
          {song.artist && (
            <p className="text-sm text-zinc-400 truncate pl-8">
              {song.artist}
            </p>
          )}
        </div>
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={() => onView(song)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View song</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={() => onEdit(song)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit song</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => onDelete(song.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete song</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {song.key && (
          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
            Key: {song.key}
          </Badge>
        )}
        {song.tempo && (
          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 capitalize">
            {song.tempo}
          </Badge>
        )}
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
          {getLanguageLabel(song.language)}
        </Badge>
        {song.genre && (
          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/30 capitalize">
            {getGenreLabel(song.genre)}
          </Badge>
        )}
      </div>

      {/* Last Sang */}
      {song.lastSang && (
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
          <Calendar className="w-3 h-3" />
          <span>Last sang: {format(song.lastSang, "MMM d, yyyy")}</span>
        </div>
      )}

      {/* Lyrics Preview */}
      <div className="text-sm text-zinc-400 line-clamp-2 mb-3 border-l-2 border-zinc-700 pl-3">
        {song.lyrics.split('\n')[0]}...
      </div>

      {/* Tags */}
      {song.tags && song.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-800">
          {song.tags.map((tag) => (
            <Badge key={tag} className="bg-zinc-800/50 text-zinc-400 border-zinc-700 text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
