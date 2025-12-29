"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings2, Save, RotateCcw, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScheduleRules, LineupRules } from "@/lib/types";

interface DefaultRulesSettingsProps {
  initialScheduleRules: ScheduleRules;
  initialLineupRules: LineupRules;
  onSaveScheduleRules: (rules: ScheduleRules) => void;
  onSaveLineupRules: (rules: LineupRules) => void;
}

const DEFAULT_SCHEDULE_RULES: ScheduleRules = {
  singersPerMonth: 1,
  techPerMonth: 2,
  scriptureReadersPerMonth: 1,
  singersPerService: 3,
  minGapDays: 7,
  alwaysAssignScriptureReader: true,
  alwaysAssignTechPerson: true,
  respectExemptions: true,
};

const DEFAULT_LINEUP_RULES: LineupRules = {
  minSongs: 4,
  maxSongs: 6,
  slowModerateCount: 2,
  fastCount: 2,
  requireAdoration: true,
  requireThanksgiving: true,
  requireConfession: true,
  requireSupplication: true,
  avoidRecentlyPlayed: true,
};

export function DefaultRulesSettings({
  initialScheduleRules,
  initialLineupRules,
  onSaveScheduleRules,
  onSaveLineupRules,
}: DefaultRulesSettingsProps) {
  const [scheduleRules, setScheduleRules] = useState<ScheduleRules>(initialScheduleRules);
  const [lineupRules, setLineupRules] = useState<LineupRules>(initialLineupRules);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveScheduleRules = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveScheduleRules(scheduleRules);
      setIsSaving(false);
    }, 500);
  };

  const handleSaveLineupRules = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveLineupRules(lineupRules);
      setIsSaving(false);
    }, 500);
  };

  const handleResetScheduleRules = () => {
    setScheduleRules(DEFAULT_SCHEDULE_RULES);
  };

  const handleResetLineupRules = () => {
    setLineupRules(DEFAULT_LINEUP_RULES);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Default Rules
        </CardTitle>
        <CardDescription>
          Set default rules for schedule and lineup generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Schedule Rules</TabsTrigger>
            <TabsTrigger value="lineup">Lineup Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="singers-per-month">Singers Per Month</Label>
                <Input
                  id="singers-per-month"
                  type="number"
                  min="0"
                  value={scheduleRules.singersPerMonth}
                  onChange={(e) =>
                    setScheduleRules({ ...scheduleRules, singersPerMonth: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Maximum times a singer serves per month</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tech-per-month">Tech Per Month</Label>
                <Input
                  id="tech-per-month"
                  type="number"
                  min="0"
                  value={scheduleRules.techPerMonth}
                  onChange={(e) =>
                    setScheduleRules({ ...scheduleRules, techPerMonth: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Maximum times tech serves per month</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scripture-per-month">Scripture Readers Per Month</Label>
                <Input
                  id="scripture-per-month"
                  type="number"
                  min="0"
                  value={scheduleRules.scriptureReadersPerMonth}
                  onChange={(e) =>
                    setScheduleRules({ ...scheduleRules, scriptureReadersPerMonth: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Maximum times scripture reader serves per month</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="singers-per-service">Singers Per Service</Label>
                <Input
                  id="singers-per-service"
                  type="number"
                  min="1"
                  value={scheduleRules.singersPerService}
                  onChange={(e) =>
                    setScheduleRules({ ...scheduleRules, singersPerService: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Number of singers per service</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-gap-days">Minimum Gap Days</Label>
                <Input
                  id="min-gap-days"
                  type="number"
                  min="0"
                  value={scheduleRules.minGapDays}
                  onChange={(e) =>
                    setScheduleRules({ ...scheduleRules, minGapDays: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Minimum days between assignments</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="always-scripture">Always Assign Scripture Reader</Label>
                  <p className="text-xs text-muted-foreground">Ensure every service has a scripture reader</p>
                </div>
                <Switch
                  id="always-scripture"
                  checked={scheduleRules.alwaysAssignScriptureReader}
                  onCheckedChange={(checked) =>
                    setScheduleRules({ ...scheduleRules, alwaysAssignScriptureReader: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="always-tech">Always Assign Tech Person</Label>
                  <p className="text-xs text-muted-foreground">Ensure every service has tech support</p>
                </div>
                <Switch
                  id="always-tech"
                  checked={scheduleRules.alwaysAssignTechPerson}
                  onCheckedChange={(checked) =>
                    setScheduleRules({ ...scheduleRules, alwaysAssignTechPerson: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="respect-exemptions">Respect Exemptions</Label>
                  <p className="text-xs text-muted-foreground">Don't assign people marked as exempt</p>
                </div>
                <Switch
                  id="respect-exemptions"
                  checked={scheduleRules.respectExemptions}
                  onCheckedChange={(checked) =>
                    setScheduleRules({ ...scheduleRules, respectExemptions: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveScheduleRules} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Schedule Rules"}
              </Button>
              <Button onClick={handleResetScheduleRules} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="lineup" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-songs">Minimum Songs</Label>
                <Input
                  id="min-songs"
                  type="number"
                  min="1"
                  value={lineupRules.minSongs}
                  onChange={(e) =>
                    setLineupRules({ ...lineupRules, minSongs: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Minimum number of songs in lineup</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-songs">Maximum Songs</Label>
                <Input
                  id="max-songs"
                  type="number"
                  min="1"
                  value={lineupRules.maxSongs}
                  onChange={(e) =>
                    setLineupRules({ ...lineupRules, maxSongs: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Maximum number of songs in lineup</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slow-moderate">Slow/Moderate Songs</Label>
                <Input
                  id="slow-moderate"
                  type="number"
                  min="0"
                  value={lineupRules.slowModerateCount}
                  onChange={(e) =>
                    setLineupRules({ ...lineupRules, slowModerateCount: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Number of slow/moderate tempo songs</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fast-songs">Fast Songs</Label>
                <Input
                  id="fast-songs"
                  type="number"
                  min="0"
                  value={lineupRules.fastCount}
                  onChange={(e) =>
                    setLineupRules({ ...lineupRules, fastCount: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Number of fast tempo songs</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-adoration">Require Adoration</Label>
                  <p className="text-xs text-muted-foreground">Include at least one adoration song</p>
                </div>
                <Switch
                  id="require-adoration"
                  checked={lineupRules.requireAdoration}
                  onCheckedChange={(checked) =>
                    setLineupRules({ ...lineupRules, requireAdoration: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-thanksgiving">Require Thanksgiving</Label>
                  <p className="text-xs text-muted-foreground">Include at least one thanksgiving song</p>
                </div>
                <Switch
                  id="require-thanksgiving"
                  checked={lineupRules.requireThanksgiving}
                  onCheckedChange={(checked) =>
                    setLineupRules({ ...lineupRules, requireThanksgiving: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-confession">Require Confession</Label>
                  <p className="text-xs text-muted-foreground">Include at least one confession song</p>
                </div>
                <Switch
                  id="require-confession"
                  checked={lineupRules.requireConfession}
                  onCheckedChange={(checked) =>
                    setLineupRules({ ...lineupRules, requireConfession: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-supplication">Require Supplication</Label>
                  <p className="text-xs text-muted-foreground">Include at least one supplication song</p>
                </div>
                <Switch
                  id="require-supplication"
                  checked={lineupRules.requireSupplication}
                  onCheckedChange={(checked) =>
                    setLineupRules({ ...lineupRules, requireSupplication: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="avoid-recent">Avoid Recently Played</Label>
                  <p className="text-xs text-muted-foreground">Prefer songs not recently used</p>
                </div>
                <Switch
                  id="avoid-recent"
                  checked={lineupRules.avoidRecentlyPlayed}
                  onCheckedChange={(checked) =>
                    setLineupRules({ ...lineupRules, avoidRecentlyPlayed: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveLineupRules} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Lineup Rules"}
              </Button>
              <Button onClick={handleResetLineupRules} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

