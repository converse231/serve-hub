"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import type { SchedulingRules } from "@/lib/scheduler";

interface ScheduleRulesSettingsProps {
  rules: SchedulingRules;
  onRulesChange: (rules: SchedulingRules) => void;
  onResetToDefaults: () => void;
}

export function ScheduleRulesSettings({
  rules,
  onRulesChange,
  onResetToDefaults,
}: ScheduleRulesSettingsProps) {
  const updateRule = <K extends keyof SchedulingRules>(
    key: K,
    value: SchedulingRules[K]
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
              <CardTitle>Schedule Rules</CardTitle>
              <CardDescription>Customize assignment rules</CardDescription>
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
        {/* Singers per month */}
        <div className="space-y-2">
          <Label htmlFor="singersPerMonth">
            Singers per month (max times)
          </Label>
          <Input
            id="singersPerMonth"
            type="number"
            min="1"
            max="5"
            value={rules.singersPerMonth}
            onChange={(e) =>
              updateRule("singersPerMonth", parseInt(e.target.value))
            }
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Maximum times a singer can be assigned per month
          </p>
        </div>

        {/* Tech per month */}
        <div className="space-y-2">
          <Label htmlFor="techPerMonth">
            Tech/Multimedia per month (max times)
          </Label>
          <Input
            id="techPerMonth"
            type="number"
            min="1"
            max="5"
            value={rules.techPerMonth}
            onChange={(e) => updateRule("techPerMonth", parseInt(e.target.value))}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Maximum times a tech person can serve per month
          </p>
        </div>

        {/* Scripture readers per month */}
        <div className="space-y-2">
          <Label htmlFor="scriptureReadersPerMonth">
            Scripture readers per month (max times)
          </Label>
          <Input
            id="scriptureReadersPerMonth"
            type="number"
            min="1"
            max="5"
            value={rules.scriptureReadersPerMonth}
            onChange={(e) =>
              updateRule("scriptureReadersPerMonth", parseInt(e.target.value))
            }
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Maximum times a scripture reader can serve per month
          </p>
        </div>

        {/* Singers per service */}
        <div className="space-y-2">
          <Label htmlFor="singersPerService">
            Singers per service
          </Label>
          <Input
            id="singersPerService"
            type="number"
            min="1"
            max="10"
            value={rules.singersPerService}
            onChange={(e) =>
              updateRule("singersPerService", parseInt(e.target.value))
            }
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            How many singers to assign per service (3-4 is typical)
          </p>
        </div>

        {/* Minimum gap days */}
        <div className="space-y-2">
          <Label htmlFor="minGapDays">
            Minimum gap between assignments (days)
          </Label>
          <Input
            id="minGapDays"
            type="number"
            min="0"
            max="21"
            value={rules.minGapDays}
            onChange={(e) => updateRule("minGapDays", parseInt(e.target.value))}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Minimum days between assignments for the same person
          </p>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="requireScriptureReader"
              checked={rules.requireScriptureReader}
              onCheckedChange={(checked) =>
                updateRule("requireScriptureReader", checked as boolean)
              }
            />
            <div className="space-y-0.5">
              <label
                htmlFor="requireScriptureReader"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Always assign scripture reader
              </label>
              <p className="text-xs text-muted-foreground">
                Ensure every service has a scripture reader assigned
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="requireTech"
              checked={rules.requireTech}
              onCheckedChange={(checked) =>
                updateRule("requireTech", checked as boolean)
              }
            />
            <div className="space-y-0.5">
              <label
                htmlFor="requireTech"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Always assign tech person
              </label>
              <p className="text-xs text-muted-foreground">
                Ensure every service has a multimedia person assigned
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="respectExemptions"
              checked={rules.respectExemptions}
              onCheckedChange={(checked) =>
                updateRule("respectExemptions", checked as boolean)
              }
            />
            <div className="space-y-0.5">
              <label
                htmlFor="respectExemptions"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Respect people exemptions
              </label>
              <p className="text-xs text-muted-foreground">
                Don&apos;t auto-assign people marked as exempt
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

