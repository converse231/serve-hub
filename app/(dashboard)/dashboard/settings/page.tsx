"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChurchSettings } from "@/components/settings/ChurchSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { DefaultRulesSettings } from "@/components/settings/DefaultRulesSettings";
import { Building2, User, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChurchSettings as ChurchSettingsType, UserProfile, ScheduleRules, LineupRules } from "@/lib/types";

export default function SettingsPage() {
  const { toast } = useToast();

  // Church settings state
  const [churchSettings, setChurchSettings] = useState<ChurchSettingsType>({
    name: "Grace Community Church",
    logo: undefined,
    address: "123 Faith Avenue, Manila, Philippines",
    phone: "+63 912 345 6789",
    email: "info@gracechurch.ph",
    website: "https://gracechurch.ph",
  });

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@gracechurch.ph",
    phone: "+63 912 345 6789",
    role: "Ministry Coordinator",
  });

  // Default rules state
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

  // Active tab state for mobile
  const [activeTab, setActiveTab] = useState("church");

  // Handlers
  const handleSaveChurchSettings = (settings: ChurchSettingsType) => {
    setChurchSettings(settings);
    toast({
      title: "Church settings saved",
      description: "Your church information has been updated.",
    });
  };

  const handleSaveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated.",
    });
  };

  const handleSaveScheduleRules = (rules: ScheduleRules) => {
    setScheduleRules(rules);
    toast({
      title: "Schedule rules saved",
      description: "Default schedule generation rules have been updated.",
    });
  };

  const handleSaveLineupRules = (rules: LineupRules) => {
    setLineupRules(rules);
    toast({
      title: "Lineup rules saved",
      description: "Default lineup generation rules have been updated.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your preferences and configurations
        </p>
      </div>

      {/* Mobile: Dropdown Select */}
      <div className="md:hidden mb-6">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="church">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Church Information</span>
              </div>
            </SelectItem>
            <SelectItem value="profile">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </SelectItem>
            <SelectItem value="rules">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Default Rules</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="hidden md:grid w-full grid-cols-3">
          <TabsTrigger value="church" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span>Church</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <Settings2 className="h-4 w-4" />
            <span>Rules</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="church" className="space-y-6 mt-0 md:mt-6">
          <ChurchSettings
            initialSettings={churchSettings}
            onSave={handleSaveChurchSettings}
          />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6 mt-0 md:mt-6">
          <ProfileSettings
            initialProfile={userProfile}
            onSave={handleSaveUserProfile}
          />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6 mt-0 md:mt-6">
          <DefaultRulesSettings
            initialScheduleRules={scheduleRules}
            initialLineupRules={lineupRules}
            onSaveScheduleRules={handleSaveScheduleRules}
            onSaveLineupRules={handleSaveLineupRules}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

