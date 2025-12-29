"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Wand2, Users, Settings2 } from "lucide-react";
import type { Person } from "@/lib/types";
import { generateMonthlySchedule, formatScheduleToText, type WeeklyAssignment, type SchedulingRules } from "@/lib/scheduler";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScheduleRulesSettings } from "./ScheduleRulesSettings";
import { ExemptionManagerDialog } from "@/components/people/ExemptionManagerDialog";

interface MonthlyScheduleGeneratorProps {
  people: Person[];
  onToggleExemption?: (id: string) => void;
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DEFAULT_RULES: SchedulingRules = {
  singersPerMonth: 1,
  techPerMonth: 2,
  scriptureReadersPerMonth: 2,
  minGapDays: 7,
  singersPerService: 4,
  requireScriptureReader: true,
  requireTech: true,
  respectExemptions: true,
};

export function MonthlyScheduleGenerator({ people, onToggleExemption }: MonthlyScheduleGeneratorProps) {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear().toString());
  const [month, setMonth] = useState((currentDate.getMonth() + 1).toString());
  const [title, setTitle] = useState("MUSIC TEAM SCHEDULE");
  const [rules, setRules] = useState<SchedulingRules>(DEFAULT_RULES);
  const [generatedSchedule, setGeneratedSchedule] = useState<WeeklyAssignment[]>([]);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  // Get stats
  const singers = people.filter((p) => p.isActive && p.ministries.includes("singer"));
  const techPeople = people.filter((p) => p.isActive && p.ministries.includes("multimedia"));
  const scriptureReaders = people.filter(
    (p) => p.isActive && p.ministries.includes("scripture_reader") && p.gender === "male"
  );

  const generateSchedule = () => {
    const schedule = generateMonthlySchedule(people, parseInt(year), parseInt(month), rules);
    setGeneratedSchedule(schedule);

    const monthName = MONTHS.find((m) => m.value === month)?.label || "";
    const scheduleTitle = `${title}\n${monthName.toUpperCase()} ${year}`;
    const text = formatScheduleToText(schedule, scheduleTitle);
    setGeneratedText(text);
  };

  const resetRulesToDefaults = () => {
    setRules(DEFAULT_RULES);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column - Settings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Auto-Generate Schedule</CardTitle>
            <CardDescription>
              Automatically create a monthly schedule with smart assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Month and Year */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="text-base"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Schedule Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="MUSIC TEAM SCHEDULE"
                className="text-base"
              />
            </div>

            {/* Generate Button */}
            <Button onClick={generateSchedule} className="w-full" size="lg">
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Monthly Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Editable Rules */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rules" className="border rounded-lg">
            <AccordionTrigger className="px-6 hover:no-underline [&[data-state=open]]:border-b">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <span className="font-semibold">Customize Rules & Exemptions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-4 space-y-4">
              {/* Exemption Manager Button */}
              {onToggleExemption && (
                <div className="flex flex-col gap-2 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">People Exemptions</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manage who should be excluded from auto-scheduling
                      </p>
                    </div>
                    <ExemptionManagerDialog
                      people={people}
                      onToggleExemption={onToggleExemption}
                    />
                  </div>
                </div>
              )}

              {/* Rules Settings */}
              <ScheduleRulesSettings
                rules={rules}
                onRulesChange={setRules}
                onResetToDefaults={resetRulesToDefaults}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Current Rules Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Rules Summary</CardTitle>
            <CardDescription>Active scheduling rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Singers: {rules.singersPerMonth}x per month</p>
                <p className="text-muted-foreground text-xs">
                  {rules.singersPerService} singers per service
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Tech: Maximum {rules.techPerMonth}x per month</p>
                <p className="text-muted-foreground text-xs">
                  {rules.requireTech ? "Required for every service" : "Optional"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Scripture: {rules.scriptureReadersPerMonth}x per month</p>
                <p className="text-muted-foreground text-xs">
                  Male readers only • {rules.requireScriptureReader ? "Required" : "Optional"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Gap: {rules.minGapDays} days minimum</p>
                <p className="text-muted-foreground text-xs">
                  {rules.respectExemptions ? "Respecting exemptions" : "Ignoring exemptions"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available People Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Available People</CardTitle>
            <CardDescription>People ready for assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Singers</span>
              </div>
              <Badge variant="secondary">{singers.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Tech/Multimedia</span>
              </div>
              <Badge variant="secondary">{techPeople.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Scripture Readers</span>
              </div>
              <Badge variant="secondary">{scriptureReaders.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Generated Schedule */}
      <div className="space-y-6">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Generated Schedule</CardTitle>
            <CardDescription>
              {generatedSchedule.length > 0
                ? `${generatedSchedule.length} Sundays scheduled`
                : "Click generate to create schedule"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedText ? (
              <>
                {/* Preview Cards */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto border rounded-lg p-3 bg-muted/20">
                  {generatedSchedule.map((week, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="font-semibold text-sm">
                          {format(week.date, "MMMM d, yyyy")}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">Singers: </span>
                            {week.singers.length > 0
                              ? week.singers.map((s) => s.name).join(", ")
                              : "None"}
                          </div>
                          {week.tech && (
                            <div>
                              <span className="text-muted-foreground">Tech: </span>
                              {week.tech.name}
                            </div>
                          )}
                          {week.scriptureReader && (
                            <div>
                              <span className="text-muted-foreground">Scripture: </span>
                              {week.scriptureReader.name}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Text Output with Copy Button */}
                <div className="relative">
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    className="absolute top-2 right-2 z-10 shadow-md"
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
                        Copy
                      </>
                    )}
                  </Button>
                  <Textarea
                    value={generatedText}
                    readOnly
                    className="min-h-[300px] font-mono text-sm resize-none pr-28"
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                <Wand2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a month and year, then click &quot;Generate Monthly Schedule&quot; to
                  automatically create assignments based on your team
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

