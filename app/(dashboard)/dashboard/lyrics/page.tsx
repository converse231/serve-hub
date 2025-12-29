"use client";

import { useState } from "react";
import { SongCard } from "@/components/lyrics/SongCard";
import { ViewSongDialog } from "@/components/lyrics/ViewSongDialog";
import { AddEditSongDialog } from "@/components/lyrics/AddEditSongDialog";
import { GenerateLineupDialog } from "@/components/lyrics/GenerateLineupDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Music as MusicIcon } from "lucide-react";
import { mockSongs } from "@/lib/data/mock";
import type { Song, SongGenre, SongLanguage } from "@/lib/types";
import { SONG_GENRES, SONG_LANGUAGES } from "@/lib/constants";

export default function LyricsPage() {
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [filterTempo, setFilterTempo] = useState<string>("all");
  const [viewingSong, setViewingSong] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add new song
  const handleAddSong = (data: {
    title: string;
    artist?: string;
    genre?: SongGenre;
    language: SongLanguage;
    lyrics: string;
    chords?: string;
    key?: string;
    tempo?: string;
    tags: string[];
  }) => {
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: data.title,
      artist: data.artist,
      genre: data.genre,
      language: data.language,
      lyrics: data.lyrics,
      chords: data.chords,
      key: data.key,
      tempo: data.tempo,
      tags: data.tags,
      createdAt: new Date(),
    };

    setSongs([newSong, ...songs]);
  };

  // Edit song
  const handleEditSong = (data: {
    title: string;
    artist?: string;
    genre?: SongGenre;
    language: SongLanguage;
    lyrics: string;
    chords?: string;
    key?: string;
    tempo?: string;
    tags: string[];
  }) => {
    if (!editingSong) return;

    setSongs(
      songs.map((song) =>
        song.id === editingSong.id
          ? { ...song, ...data }
          : song
      )
    );
  };

  // Delete song
  const handleDeleteSong = (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setSongs(songs.filter((song) => song.id !== id));
    }
  };

  // Open view dialog
  const handleViewClick = (song: Song) => {
    setViewingSong(song);
    setViewDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (song: Song) => {
    setEditingSong(song);
    setEditDialogOpen(true);
  };

  // Open add dialog
  const handleAddClick = () => {
    setEditingSong(null);
    setAddDialogOpen(true);
  };

  // Filter songs
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      song.lyrics.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      filterGenre === "all" || song.genre === filterGenre;

    const matchesLanguage =
      filterLanguage === "all" || song.language === filterLanguage;

    const matchesTempo =
      filterTempo === "all" || song.tempo === filterTempo;

    return matchesSearch && matchesGenre && matchesLanguage && matchesTempo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Song Lyrics</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your song lyrics database
          </p>
        </div>
        <div className="flex gap-2">
          <GenerateLineupDialog songs={songs} />
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Song
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <MusicIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{songs.length}</p>
              <p className="text-sm text-muted-foreground">Total Songs</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/10 p-2">
              <MusicIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {songs.filter((s) => s.language === "english").length}
              </p>
              <p className="text-sm text-muted-foreground">English</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/10 p-2">
              <MusicIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {songs.filter((s) => s.language === "tagalog").length}
              </p>
              <p className="text-sm text-muted-foreground">Tagalog</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-500/10 p-2">
              <MusicIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredSongs.length}</p>
              <p className="text-sm text-muted-foreground">Filtered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, artist, or lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-base"
          />
        </div>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {SONG_GENRES.map((genre) => (
              <SelectItem key={genre.value} value={genre.value}>
                {genre.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterLanguage} onValueChange={setFilterLanguage}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {SONG_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterTempo} onValueChange={setFilterTempo}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Tempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tempos</SelectItem>
            <SelectItem value="Slow">Slow</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Fast">Fast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Songs List */}
      {filteredSongs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteSong}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <MusicIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No songs found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filterGenre !== "all" || filterLanguage !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first song"}
          </p>
          {!searchQuery && filterGenre === "all" && filterLanguage === "all" && (
            <Button onClick={handleAddClick} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Song
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <ViewSongDialog
        song={viewingSong}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <AddEditSongDialog
        song={editingSong}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditSong}
      />

      <AddEditSongDialog
        song={null}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddSong}
      />
    </div>
  );
}
