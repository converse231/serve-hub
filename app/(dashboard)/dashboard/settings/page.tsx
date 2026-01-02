"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Settings2, Users, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScheduleRules, LineupRules } from "@/lib/types";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("church");
  
  // Data
  const [churchId, setChurchId] = useState<string | null>(null);
  const [churchData, setChurchData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [memberCount, setMemberCount] = useState(0);
  const [scheduleRules, setScheduleRules] = useState<ScheduleRules>({
    singersPerMonth: 1,
    techPerMonth: 2,
    scriptureReadersPerMonth: 1,
    singersPerService: 3,
    minGapDays: 7,
    alwaysAssignScriptureReader: true,
    alwaysAssignTechPerson: true,
    respectExemptions: true,
  });
  const [lineupRules, setLineupRules] = useState<LineupRules>({
    minSongs: 4,
    maxSongs: 6,
    slowModerateCount: 2,
    fastCount: 2,
    requireAdoration: true,
    requireThanksgiving: true,
    requireConfession: true,
    requireSupplication: true,
    avoidRecentlyPlayed: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfileData({
          name: profile.name || "",
          email: profile.email || "",
        });
      }

      // Get church
      const { data: churches } = await supabase.rpc("get_my_churches");
      if (!churches || churches.length === 0) return;

      const currentChurch = churches[0];
      setChurchId(currentChurch.church_id);
      setMemberCount(Number(currentChurch.member_count) || 0);

      // Get full church data
      const { data: church } = await supabase
        .from("churches")
        .select("*")
        .eq("id", currentChurch.church_id)
        .single();

      if (church) {
        setChurchData({
          name: church.name || "",
          address: church.address || "",
          phone: church.phone || "",
          email: church.email || "",
          website: church.website || "",
        });
      }

      // Get settings
      const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .eq("church_id", currentChurch.church_id)
        .single();

      if (settings) {
        if (settings.schedule_rules) {
          setScheduleRules(settings.schedule_rules);
        }
        if (settings.lineup_rules) {
          setLineupRules(settings.lineup_rules);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChurch = async () => {
    if (!churchId) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("churches")
        .update({
          name: churchData.name,
          address: churchData.address || null,
          phone: churchData.phone || null,
          email: churchData.email || null,
          website: churchData.website || null,
        })
        .eq("id", churchId);

      if (error) throw error;
      toast.success("Church settings saved");
    } catch (error) {
      console.error("Error saving church:", error);
      toast.error("Failed to save church settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ name: profileData.name })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile saved");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRules = async () => {
    if (!churchId) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("settings")
        .update({
          schedule_rules: scheduleRules,
          lineup_rules: lineupRules,
        })
        .eq("church_id", churchId);

      if (error) throw error;
      toast.success("Rules saved");
    } catch (error) {
      console.error("Error saving rules:", error);
      toast.error("Failed to save rules");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">
          Manage your church and account preferences
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "church", label: "Church", icon: Building2 },
          { id: "profile", label: "Profile", icon: User },
          { id: "rules", label: "Rules", icon: Settings2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Church Tab */}
      {activeTab === "church" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-amber-500/10">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Church Information</h2>
                <p className="text-sm text-zinc-400">Basic details about your church</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Church Name</Label>
                <Input
                  value={churchData.name}
                  onChange={(e) => setChurchData({ ...churchData, name: e.target.value })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Email</Label>
                <Input
                  type="email"
                  value={churchData.email}
                  onChange={(e) => setChurchData({ ...churchData, email: e.target.value })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Phone</Label>
                <Input
                  value={churchData.phone}
                  onChange={(e) => setChurchData({ ...churchData, phone: e.target.value })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Website</Label>
                <Input
                  value={churchData.website}
                  onChange={(e) => setChurchData({ ...churchData, website: e.target.value })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-zinc-300">Address</Label>
                <Input
                  value={churchData.address}
                  onChange={(e) => setChurchData({ ...churchData, address: e.target.value })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveChurch}
                disabled={saving}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Team info */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Team</h2>
                <p className="text-sm text-zinc-400">{memberCount} of 10 members</p>
              </div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all"
                style={{ width: `${(memberCount / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Invite more team members from the dashboard (coming soon)
            </p>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Your Profile</h2>
              <p className="text-sm text-zinc-400">Manage your personal information</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Name</Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                value={profileData.email}
                disabled
                className="h-11 bg-zinc-800/30 border-zinc-700 text-zinc-500"
              />
              <p className="text-xs text-zinc-500">Email cannot be changed</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-violet-500/10">
                <Settings2 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Schedule Rules</h2>
                <p className="text-sm text-zinc-400">Configure auto-scheduling behavior</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Singers per Service</Label>
                <Input
                  type="number"
                  value={scheduleRules.singersPerService}
                  onChange={(e) => setScheduleRules({ ...scheduleRules, singersPerService: parseInt(e.target.value) || 0 })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Minimum Gap (Days)</Label>
                <Input
                  type="number"
                  value={scheduleRules.minGapDays}
                  onChange={(e) => setScheduleRules({ ...scheduleRules, minGapDays: parseInt(e.target.value) || 0 })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-amber-500/10">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Lineup Rules</h2>
                <p className="text-sm text-zinc-400">Configure song lineup generation</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Minimum Songs</Label>
                <Input
                  type="number"
                  value={lineupRules.minSongs}
                  onChange={(e) => setLineupRules({ ...lineupRules, minSongs: parseInt(e.target.value) || 0 })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Maximum Songs</Label>
                <Input
                  type="number"
                  value={lineupRules.maxSongs}
                  onChange={(e) => setLineupRules({ ...lineupRules, maxSongs: parseInt(e.target.value) || 0 })}
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveRules}
                disabled={saving}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
              >
                {saving ? "Saving..." : "Save Rules"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
