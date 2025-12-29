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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Song, SongGenre, SongLanguage } from "@/lib/types";
import { SONG_GENRES, SONG_LANGUAGES } from "@/lib/constants";

interface AddEditSongDialogProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    title: string;
    artist?: string;
    genre?: SongGenre;
    language: SongLanguage;
    lyrics: string;
    chords?: string;
    key?: string;
    tempo?: string;
    tags: string[];
  }) => void;
}

export function AddEditSongDialog({
  song,
  open,
  onOpenChange,
  onSave,
}: AddEditSongDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "" as SongGenre | "",
    language: "english" as SongLanguage,
    lyrics: "",
    chords: "",
    key: "",
    tempo: "",
    tags: "",
  });
  const [includeChords, setIncludeChords] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist || "",
        genre: song.genre || "",
        language: song.language,
        lyrics: song.lyrics,
        chords: song.chords || "",
        key: song.key || "",
        tempo: song.tempo || "",
        tags: song.tags.join(", "),
      });
      setIncludeChords(!!song.chords);
    } else {
      setFormData({
        title: "",
        artist: "",
        genre: "",
        language: "english",
        lyrics: "",
        chords: "",
        key: "",
        tempo: "",
        tags: "",
      });
      setIncludeChords(false);
    }
  }, [song, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.lyrics.trim()) return;

    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      title: formData.title,
      artist: formData.artist || undefined,
      genre: formData.genre || undefined,
      language: formData.language,
      lyrics: formData.lyrics,
      chords: includeChords && formData.chords ? formData.chords : undefined,
      key: formData.key || undefined,
      tempo: formData.tempo || undefined,
      tags,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{song ? "Edit Song" : "Add New Song"}</DialogTitle>
            <DialogDescription>
              {song ? "Update song information" : "Add a new song to the lyrics database"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Song Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Amazing Grace"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="text-base"
              />
            </div>

            {/* Artist */}
            <div className="space-y-2">
              <Label htmlFor="artist">Artist/Band</Label>
              <Input
                id="artist"
                placeholder="John Newton"
                value={formData.artist}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                className="text-base"
              />
            </div>

            {/* Genre and Language */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) =>
                    setFormData({ ...formData, genre: value as SongGenre })
                  }
                >
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {SONG_GENRES.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">
                  Language <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value as SongLanguage })
                  }
                  required
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SONG_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key and Tempo */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="key">Musical Key</Label>
                <Input
                  id="key"
                  placeholder="G, Am, C#m, etc."
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo</Label>
                <Select
                  value={formData.tempo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tempo: value })
                  }
                >
                  <SelectTrigger id="tempo">
                    <SelectValue placeholder="Select tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slow">Slow</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lyrics */}
            <div className="space-y-2">
              <Label htmlFor="lyrics">
                Lyrics <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="lyrics"
                placeholder="Enter song lyrics here..."
                value={formData.lyrics}
                onChange={(e) =>
                  setFormData({ ...formData, lyrics: e.target.value })
                }
                required
                className="min-h-[200px] font-sans resize-none"
              />
            </div>

            {/* Chords Toggle */}
            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Switch
                id="include-chords"
                checked={includeChords}
                onCheckedChange={setIncludeChords}
              />
              <Label htmlFor="include-chords" className="cursor-pointer">
                Include chords
              </Label>
            </div>

            {/* Chords */}
            {includeChords && (
              <div className="space-y-2">
                <Label htmlFor="chords">Chords</Label>
                <Textarea
                  id="chords"
                  placeholder="[G]Amazing [C]grace, how [G]sweet..."
                  value={formData.chords}
                  onChange={(e) =>
                    setFormData({ ...formData, chords: e.target.value })
                  }
                  className="min-h-[200px] font-mono text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Use [chord] format: [G], [Am], [C], etc.
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="worship, hymn, traditional (comma-separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{song ? "Save Changes" : "Add Song"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

