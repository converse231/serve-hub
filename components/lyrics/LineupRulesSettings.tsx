"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import type { LineupRules } from "@/lib/lineupGenerator";

interface LineupRulesSettingsProps {
  rules: LineupRules;
  onRulesChange: (rules: LineupRules) => void;
  onResetToDefaults: () => void;
}

export function LineupRulesSettings({
  rules,
  onRulesChange,
  onResetToDefaults,
}: LineupRulesSettingsProps) {
  const updateRule = <K extends keyof LineupRules>(
    key: K,
    value: LineupRules[K]
  ) => {
    onRulesChange({ ...rules, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <div>
              <CardTitle>Lineup Rules</CardTitle>
              <CardDescription>Customize song selection criteria</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetToDefaults}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Song Count */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minSongs">Minimum Songs</Label>
            <Input
              id="minSongs"
              type="number"
              min="1"
              max="15"
              value={rules.minSongs}
              onChange={(e) =>
                updateRule("minSongs", parseInt(e.target.value))
              }
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSongs">Maximum Songs</Label>
            <Input
              id="maxSongs"
              type="number"
              min="1"
              max="15"
              value={rules.maxSongs}
              onChange={(e) =>
                updateRule("maxSongs", parseInt(e.target.value))
              }
              className="text-base"
            />
          </div>
        </div>

        {/* Tempo Requirements */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slowModerateCount">
              Slow/Moderate Songs
            </Label>
            <Input
              id="slowModerateCount"
              type="number"
              min="0"
              max="10"
              value={rules.slowModerateCount}
              onChange={(e) =>
                updateRule("slowModerateCount", parseInt(e.target.value))
              }
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Number of slower tempo songs
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fastCount">Fast Songs</Label>
            <Input
              id="fastCount"
              type="number"
              min="0"
              max="10"
              value={rules.fastCount}
              onChange={(e) =>
                updateRule("fastCount", parseInt(e.target.value))
              }
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Number of faster tempo songs
            </p>
          </div>
        </div>

        {/* Required Genres */}
        <div className="space-y-3 pt-2">
          <Label>Required Song Types</Label>
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="requireAdoration"
                checked={rules.requireAdoration}
                onCheckedChange={(checked) =>
                  updateRule("requireAdoration", checked as boolean)
                }
              />
              <div className="space-y-0.5">
                <label
                  htmlFor="requireAdoration"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Adoration
                </label>
                <p className="text-xs text-muted-foreground">
                  Include at least one adoration song
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="requireThanksgiving"
                checked={rules.requireThanksgiving}
                onCheckedChange={(checked) =>
                  updateRule("requireThanksgiving", checked as boolean)
                }
              />
              <div className="space-y-0.5">
                <label
                  htmlFor="requireThanksgiving"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Thanksgiving
                </label>
                <p className="text-xs text-muted-foreground">
                  Include at least one thanksgiving song
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="requireConfession"
                checked={rules.requireConfession}
                onCheckedChange={(checked) =>
                  updateRule("requireConfession", checked as boolean)
                }
              />
              <div className="space-y-0.5">
                <label
                  htmlFor="requireConfession"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Confession
                </label>
                <p className="text-xs text-muted-foreground">
                  Include at least one confession song
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="requireSupplication"
                checked={rules.requireSupplication}
                onCheckedChange={(checked) =>
                  updateRule("requireSupplication", checked as boolean)
                }
              />
              <div className="space-y-0.5">
                <label
                  htmlFor="requireSupplication"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Supplication
                </label>
                <p className="text-xs text-muted-foreground">
                  Include at least one supplication song
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Options */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="avoidRecentlyPlayed"
              checked={rules.avoidRecentlyPlayed}
              onCheckedChange={(checked) =>
                updateRule("avoidRecentlyPlayed", checked as boolean)
              }
            />
            <div className="space-y-0.5">
              <label
                htmlFor="avoidRecentlyPlayed"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Avoid recently played songs
              </label>
              <p className="text-xs text-muted-foreground">
                Don&apos;t include songs played within the last 30 days
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

