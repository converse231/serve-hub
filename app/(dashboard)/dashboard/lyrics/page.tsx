"use client";

import { useState, useEffect } from "react";
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
import { Search, Plus, Music as MusicIcon, Globe, Filter } from "lucide-react";
import type { Song, SongGenre, SongLanguage } from "@/lib/types";
import { SONG_GENRES, SONG_LANGUAGES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LyricsPage() {
  const supabase = createClient();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [filterTempo, setFilterTempo] = useState<string>("all");
  const [viewingSong, setViewingSong] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: churches } = await supabase.rpc("get_my_churches");
      if (!churches || churches.length === 0) return;

      const currentChurchId = churches[0].church_id;
      setChurchId(currentChurchId);

      const { data: songsData, error } = await supabase
        .from("songs")
        .select("*")
        .eq("church_id", currentChurchId)
        .order("title");

      if (error) throw error;

      setSongs(
        (songsData || []).map((s) => ({
          ...s,
          createdAt: new Date(s.created_at),
          lastSang: s.last_sang ? new Date(s.last_sang) : undefined,
        }))
      );
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  // Add new song
  const handleAddSong = async (data: {
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
    if (!churchId) return;

    try {
      const { data: newSong, error } = await supabase
        .from("songs")
        .insert({
          church_id: churchId,
          title: data.title,
          artist: data.artist || null,
          genre: data.genre || null,
          language: data.language,
          lyrics: data.lyrics,
          chords: data.chords || null,
          key: data.key || null,
          tempo: data.tempo || null,
          tags: data.tags,
        })
        .select()
        .single();

      if (error) throw error;

      setSongs([
        {
          ...newSong,
          createdAt: new Date(newSong.created_at),
          lastSang: newSong.last_sang ? new Date(newSong.last_sang) : undefined,
        },
        ...songs,
      ]);

      toast.success("Song added successfully");
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error("Failed to add song");
    }
  };

  // Edit song
  const handleEditSong = async (data: {
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

    try {
      const { error } = await supabase
        .from("songs")
        .update({
          title: data.title,
          artist: data.artist || null,
          genre: data.genre || null,
          language: data.language,
          lyrics: data.lyrics,
          chords: data.chords || null,
          key: data.key || null,
          tempo: data.tempo || null,
          tags: data.tags,
        })
        .eq("id", editingSong.id);

      if (error) throw error;

      setSongs(
        songs.map((song) =>
          song.id === editingSong.id ? { ...song, ...data } : song
        )
      );

      toast.success("Song updated successfully");
    } catch (error) {
      console.error("Error updating song:", error);
      toast.error("Failed to update song");
    }
  };

  // Delete song
  const handleDeleteSong = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const { error } = await supabase.from("songs").delete().eq("id", id);
      if (error) throw error;

      setSongs(songs.filter((song) => song.id !== id));
      toast.success("Song deleted successfully");
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Failed to delete song");
    }
  };

  const handleViewClick = (song: Song) => {
    setViewingSong(song);
    setViewDialogOpen(true);
  };

  const handleEditClick = (song: Song) => {
    setEditingSong(song);
    setEditDialogOpen(true);
  };

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

    const matchesGenre = filterGenre === "all" || song.genre === filterGenre;
    const matchesLanguage = filterLanguage === "all" || song.language === filterLanguage;
    const matchesTempo = filterTempo === "all" || song.tempo === filterTempo;

    return matchesSearch && matchesGenre && matchesLanguage && matchesTempo;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Song Library</h1>
          <p className="text-zinc-400 mt-1">
            Browse and manage your worship songs
          </p>
        </div>
        <div className="flex gap-2">
          <GenerateLineupDialog songs={songs} />
          <Button 
            onClick={handleAddClick} 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Song
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          icon={<MusicIcon className="w-5 h-5" />}
          value={songs.length}
          label="Total Songs"
          color="amber"
        />
        <StatCard
          icon={<Globe className="w-5 h-5" />}
          value={songs.filter((s) => s.language === "english").length}
          label="English"
          color="blue"
        />
        <StatCard
          icon={<Globe className="w-5 h-5" />}
          value={songs.filter((s) => s.language === "tagalog").length}
          label="Tagalog"
          color="emerald"
        />
        <StatCard
          icon={<Filter className="w-5 h-5" />}
          value={filteredSongs.length}
          label="Filtered"
          color="violet"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by title, artist, or lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-amber-500"
          />
        </div>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All Genres</SelectItem>
            {SONG_GENRES.map((genre) => (
              <SelectItem key={genre.value} value={genre.value}>
                {genre.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterLanguage} onValueChange={setFilterLanguage}>
          <SelectTrigger className="w-full sm:w-[160px] h-11 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All Languages</SelectItem>
            {SONG_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterTempo} onValueChange={setFilterTempo}>
          <SelectTrigger className="w-full sm:w-[140px] h-11 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Tempo" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All Tempos</SelectItem>
            <SelectItem value="slow">Slow</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
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
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
            <MusicIcon className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No songs found</h3>
          <p className="text-sm text-zinc-400 mb-6 text-center max-w-sm">
            {searchQuery || filterGenre !== "all" || filterLanguage !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first worship song"}
          </p>
          {!searchQuery && filterGenre === "all" && filterLanguage === "all" && (
            <Button 
              onClick={handleAddClick}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Song
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

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "amber" | "blue" | "emerald" | "violet";
}) {
  const colorClasses = {
    amber: "bg-amber-500/10 text-amber-400",
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
