"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Copy, CheckCircle2, Wand2, Settings2, Music, Calendar } from "lucide-react";
import type { Song } from "@/lib/types";
import { generateLineup, formatLineupToText, DEFAULT_LINEUP_RULES, type LineupRules } from "@/lib/lineupGenerator";
import { LineupRulesSettings } from "./LineupRulesSettings";
import { SONG_GENRES } from "@/lib/constants";
import { format } from "date-fns";

interface GenerateLineupDialogProps {
  songs: Song[];
}

export function GenerateLineupDialog({ songs }: GenerateLineupDialogProps) {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<LineupRules>(DEFAULT_LINEUP_RULES);
  const [generatedLineup, setGeneratedLineup] = useState<ReturnType<typeof generateLineup>>([]);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const resetRulesToDefaults = () => {
    setRules(DEFAULT_LINEUP_RULES);
  };

  const handleGenerate = () => {
    const lineup = generateLineup(songs, rules);
    setGeneratedLineup(lineup);

    const text = formatLineupToText(lineup, `WORSHIP LINEUP - ${format(new Date(), "MMMM d, yyyy")}`);
    setGeneratedText(text);
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

  const getGenreLabel = (value?: string) => {
    if (!value) return null;
    return SONG_GENRES.find((g) => g.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="lg">
          <Wand2 className="w-4 h-4" />
          Generate Lineup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl">Generate Song Lineup</DialogTitle>
          <DialogDescription>
            Automatically create a balanced worship song lineup
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Settings */}
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold">Song Database</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Available Songs</span>
                      <Badge variant="secondary">{songs.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">With Tempo Set</span>
                      <Badge variant="secondary">
                        {songs.filter((s) => s.tempo).length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">With Genre Set</span>
                      <Badge variant="secondary">
                        {songs.filter((s) => s.genre).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button onClick={handleGenerate} className="w-full" size="lg">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Lineup
              </Button>

              {/* Rules Settings */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="rules" className="border rounded-lg">
                  <AccordionTrigger className="px-6 hover:no-underline [&[data-state=open]]:border-b">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-5 h-5" />
                      <span className="font-semibold">Customize Rules</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-4 space-y-4">
                    <LineupRulesSettings
                      rules={rules}
                      onRulesChange={setRules}
                      onResetToDefaults={resetRulesToDefaults}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Current Rules Summary */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold">Current Rules Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{rules.minSongs}-{rules.maxSongs} songs</p>
                        <p className="text-muted-foreground text-xs">
                          Lineup will have {rules.minSongs} to {rules.maxSongs} songs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Tempo: {rules.slowModerateCount} slow, {rules.fastCount} fast</p>
                        <p className="text-muted-foreground text-xs">
                          Balanced energy throughout service
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Required types</p>
                        <p className="text-muted-foreground text-xs">
                          {[
                            rules.requireAdoration && "Adoration",
                            rules.requireThanksgiving && "Thanksgiving",
                            rules.requireConfession && "Confession",
                            rules.requireSupplication && "Supplication",
                          ]
                            .filter(Boolean)
                            .join(", ") || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Generated Lineup */}
            <div className="space-y-6">
              {generatedLineup.length > 0 ? (
                <>
                  {/* Song Cards */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Generated Lineup ({generatedLineup.length} songs)</h3>
                    {generatedLineup.map((item, index) => (
                      <Card key={item.song.id}>
                        <CardContent className="pt-4 space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                              <span className="font-bold text-primary">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{item.song.title}</h4>
                              {item.song.artist && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {item.song.artist}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {item.song.key && (
                                  <Badge variant="outline" className="text-xs">
                                    Key: {item.song.key}
                                  </Badge>
                                )}
                                {item.song.tempo && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.song.tempo}
                                  </Badge>
                                )}
                                {item.song.genre && (
                                  <Badge className="text-xs bg-primary/10 text-primary">
                                    {getGenreLabel(item.song.genre)}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {item.reason}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Text Output */}
                  <div className="relative">
                    <Button
                      onClick={copyToClipboard}
                      size="default"
                      className="absolute top-2 right-2 z-10 shadow-lg"
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
                <div className="flex flex-col items-center justify-center h-full py-20 text-center border-2 border-dashed rounded-lg">
                  <Music className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Lineup Generated Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Click &quot;Generate Lineup&quot; to create a balanced worship song lineup based on your rules
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

