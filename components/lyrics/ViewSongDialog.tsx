"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle2, Music, FileText, Calendar } from "lucide-react";
import type { Song } from "@/lib/types";
import { SONG_GENRES, SONG_LANGUAGES } from "@/lib/constants";
import { format } from "date-fns";

interface ViewSongDialogProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewSongDialog({ song, open, onOpenChange }: ViewSongDialogProps) {
  const [copied, setCopied] = useState(false);
  const [copiedChords, setCopiedChords] = useState(false);

  if (!song) return null;

  const getGenreLabel = (value?: string) => {
    if (!value) return null;
    return SONG_GENRES.find((g) => g.value === value)?.label || value;
  };

  const getLanguageLabel = (value: string) => {
    return SONG_LANGUAGES.find((l) => l.value === value)?.label || value;
  };

  const copyLyrics = async () => {
    try {
      await navigator.clipboard.writeText(song.lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const copyChords = async () => {
    try {
      if (song.chords) {
        await navigator.clipboard.writeText(song.chords);
        setCopiedChords(true);
        setTimeout(() => setCopiedChords(false), 2000);
      }
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl md:text-4xl">{song.title}</DialogTitle>
              {song.artist && (
                <DialogDescription className="text-lg md:text-xl mt-2">
                  {song.artist}
                </DialogDescription>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 pt-3">
            {song.key && (
              <Badge variant="outline" className="gap-1 text-sm py-1">
                <Music className="w-4 h-4" />
                Key: {song.key}
              </Badge>
            )}
            {song.tempo && (
              <Badge variant="outline" className="text-sm py-1">{song.tempo}</Badge>
            )}
            <Badge variant="secondary" className="text-sm py-1">
              {getLanguageLabel(song.language)}
            </Badge>
            {song.genre && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1">
                {getGenreLabel(song.genre)}
              </Badge>
            )}
          </div>

          {song.lastSang && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <Calendar className="w-4 h-4" />
              <span>Last sang: {format(song.lastSang, "MMMM d, yyyy")}</span>
            </div>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Tabs defaultValue="lyrics" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="lyrics" className="gap-2 text-base">
                <FileText className="w-5 h-5" />
                Lyrics Only
              </TabsTrigger>
              <TabsTrigger value="chords" className="gap-2 text-base" disabled={!song.chords}>
                <Music className="w-5 h-5" />
                Lyrics & Chords
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lyrics" className="space-y-4 mt-6 flex-1">
              <div className="relative h-full">
                <Button
                  onClick={copyLyrics}
                  size="default"
                  className="absolute top-4 right-4 z-10 shadow-lg"
                  variant={copied ? "default" : "secondary"}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Lyrics
                    </>
                  )}
                </Button>
                <div className="rounded-lg border bg-muted/30 p-8 md:p-10 pr-40 min-h-[400px] md:min-h-[500px]">
                  <pre className="whitespace-pre-wrap font-sans text-lg md:text-xl leading-relaxed md:leading-loose">
                    {song.lyrics}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chords" className="space-y-4 mt-6 flex-1">
              {song.chords ? (
                <div className="relative h-full">
                  <Button
                    onClick={copyChords}
                    size="default"
                    className="absolute top-4 right-4 z-10 shadow-lg"
                    variant={copiedChords ? "default" : "secondary"}
                  >
                    {copiedChords ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Chords
                      </>
                    )}
                  </Button>
                  <div className="rounded-lg border bg-muted/30 p-8 md:p-10 pr-40 min-h-[400px] md:min-h-[500px]">
                    <pre className="whitespace-pre-wrap font-mono text-base md:text-lg leading-relaxed md:leading-loose">
                      {song.chords}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground text-lg">
                  No chords available for this song
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Tags */}
        {song.tags.length > 0 && (
          <div className="border-t pt-4 px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {song.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

