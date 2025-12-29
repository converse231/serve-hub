"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Music, Plus, Clock, TrendingUp } from "lucide-react";
import { mockPeople, mockSchedules, mockSongs } from "@/lib/data/mock";
import { calculatePersonStats, calculateMinistryStats, calculateSongStats } from "@/lib/analytics";
import { getAllConflicts } from "@/lib/conflictDetection";
import { PersonStatsCard } from "@/components/analytics/PersonStatsCard";
import { MinistryStatsCard } from "@/components/analytics/MinistryStatsCard";
import { SongStatsCard } from "@/components/analytics/SongStatsCard";
import { ConflictDetectionCard } from "@/components/analytics/ConflictDetectionCard";
import Link from "next/link";

export default function DashboardPage() {
  const activePeople = mockPeople.filter(p => p.isActive);
  const upcomingSchedules = mockSchedules.filter(s => s.date >= new Date());
  
  // Get next upcoming schedule
  const nextSchedule = upcomingSchedules.sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  )[0];

  // Calculate analytics
  const personStats = calculatePersonStats(mockSchedules, mockPeople);
  const ministryStats = calculateMinistryStats(mockSchedules);
  const songStats = calculateSongStats(mockSongs);
  const conflicts = getAllConflicts(mockSchedules);

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your ministry.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active People
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePeople.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for ministry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Schedules
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSchedules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Song Library
              </CardTitle>
              <Music className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSongs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Songs available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextSchedule ? "1" : "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Services scheduled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Service Card */}
      {nextSchedule ? (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Next Service</CardTitle>
                <CardDescription className="mt-1.5">
                  {nextSchedule.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                {nextSchedule.serviceType.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Assignments</h4>
              <div className="space-y-2">
                {nextSchedule.assignments.slice(0, 3).map((assignment) => {
                  const person = mockPeople.find(p => p.id === assignment.personId);
                  return (
                    <div 
                      key={assignment.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {assignment.ministry.replace("_", " ")}
                      </span>
                      <span className="font-medium">{person?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard/calendar">
                View Full Schedule
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Upcoming Services</CardTitle>
            <CardDescription>
              Create a new schedule to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/calendar">
                <Plus className="w-4 h-4 mr-2" />
                Create Schedule
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/dashboard/people">
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Manage People</div>
                <div className="text-xs text-muted-foreground">
                  Add or edit ministry members
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/dashboard/calendar">
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Create Schedule</div>
                <div className="text-xs text-muted-foreground">
                  Plan upcoming services
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/dashboard/lyrics">
              <Music className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Song Lyrics</div>
                <div className="text-xs text-muted-foreground">
                  Browse lyrics database
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/dashboard/calendar">
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Quick Schedule</div>
                <div className="text-xs text-muted-foreground">
                  Generate text schedule
                </div>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Analytics & Insights</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Track performance, identify conflicts, and balance ministry workload
        </p>
      </div>

      {/* Conflict Detection - Priority */}
      <ConflictDetectionCard conflicts={conflicts} people={mockPeople} />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PersonStatsCard
          stats={personStats.slice(0, 5)}
          title="Top Performers"
          description="People who serve most often"
        />
        
        <MinistryStatsCard stats={ministryStats} />
      </div>

      <SongStatsCard
        stats={songStats}
        title="Recently Used Songs"
        description="Songs used in recent services"
      />

      {/* Least Active - Helps balance workload */}
      <PersonStatsCard
        stats={personStats.slice().reverse().slice(0, 5)}
        title="Least Active Members"
        description="People who could serve more often"
      />
    </div>
  );
}

