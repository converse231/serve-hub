import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Music,
  Plus,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Person, Song } from "@/lib/types";

async function getDashboardData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: churches } = await supabase.rpc("get_my_churches");
  if (!churches || churches.length === 0) return null;

  const churchId = churches[0].church_id;
  const churchName = churches[0].church_name;

  const [peopleRes, schedulesRes, songsRes] = await Promise.all([
    supabase.from("people").select("*").eq("church_id", churchId),
    supabase
      .from("schedules")
      .select(
        `
        *,
        assignments (
          id,
          schedule_id,
          person_id,
          ministry,
          confirmed
        )
      `
      )
      .eq("church_id", churchId)
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(5),
    supabase.from("songs").select("*").eq("church_id", churchId),
  ]);

  return {
    churchName,
    people: (peopleRes.data || []).map((p) => ({
      ...p,
      isActive: p.is_active,
      isExempt: p.is_exempt,
      createdAt: new Date(p.created_at),
    })) as Person[],
    schedules: (schedulesRes.data || []).map((s) => ({
      ...s,
      date: new Date(s.date),
      serviceType: s.service_type,
      createdAt: new Date(s.created_at),
      assignments: (s.assignments || []).map(
        (a: { person_id: string; ministry: string }) => ({
          ...a,
          personId: a.person_id,
        })
      ),
    })),
    songs: (songsRes.data || []).map((s) => ({
      ...s,
      createdAt: new Date(s.created_at),
      lastSang: s.last_sang ? new Date(s.last_sang) : undefined,
    })) as Song[],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-400">Error loading dashboard</p>
      </div>
    );
  }

  const { people, schedules, songs } = data;
  const activePeople = people.filter((p) => p.isActive !== false);
  const nextSchedule = schedules[0];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 text-sm font-medium">
            Welcome back
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Here&apos;s what&apos;s happening with your ministry
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value={activePeople.length}
          label="Active People"
          color="blue"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          value={schedules.length}
          label="Upcoming"
          color="emerald"
        />
        <StatCard
          icon={<Music className="w-5 h-5" />}
          value={songs.length}
          label="Songs"
          color="violet"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          value={nextSchedule ? "1" : "0"}
          label="This Week"
          color="amber"
        />
      </div>

      {/* Next Service Card */}
      {nextSchedule ? (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-amber-400 text-sm font-medium mb-1">
                Next Service
              </p>
              <h2 className="text-xl font-bold text-white">
                {nextSchedule.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium uppercase">
              {nextSchedule.serviceType.replace("_", " ")}
            </span>
          </div>

          {nextSchedule.assignments && nextSchedule.assignments.length > 0 ? (
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-zinc-400">Assignments</p>
              <div className="space-y-2">
                {nextSchedule.assignments
                  .slice(0, 3)
                  .map(
                    (assignment: {
                      id: string;
                      personId: string;
                      ministry: string;
                    }) => {
                      const person = people.find(
                        (p) => p.id === assignment.personId
                      );
                      return (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-zinc-400 capitalize">
                            {assignment.ministry.replace("_", " ")}
                          </span>
                          <span className="text-white font-medium">
                            {person?.name || "Unassigned"}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          ) : (
            <p className="text-zinc-400 text-sm mb-4">No assignments yet</p>
          )}

          <Button
            asChild
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold"
          >
            <Link href="/dashboard/calendar">
              View Schedule
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            No Upcoming Services
          </h3>
          <p className="text-zinc-400 text-sm mb-6">
            Create your first schedule to get started
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold"
          >
            <Link href="/dashboard/calendar">
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Link>
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            href="/dashboard/people"
            icon={<Users className="w-5 h-5" />}
            title="Manage People"
            description="Add or edit members"
            color="blue"
          />
          <QuickActionCard
            href="/dashboard/calendar"
            icon={<Calendar className="w-5 h-5" />}
            title="Create Schedule"
            description="Plan services"
            color="emerald"
          />
          <QuickActionCard
            href="/dashboard/lyrics"
            icon={<Music className="w-5 h-5" />}
            title="Song Library"
            description="Browse songs"
            color="violet"
          />
          <QuickActionCard
            href="/dashboard/settings"
            icon={<Sparkles className="w-5 h-5" />}
            title="Settings"
            description="Configure app"
            color="amber"
          />
        </div>
      </div>

      {/* Getting Started Guide (show when empty) */}
      {people.length === 0 && songs.length === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Getting Started
          </h2>
          <div className="space-y-4">
            <GettingStartedStep
              number={1}
              title="Add your ministry team"
              description="Start by adding the people who serve in your church"
              href="/dashboard/people"
              completed={people.length > 0}
            />
            <GettingStartedStep
              number={2}
              title="Add worship songs"
              description="Build your song library with lyrics and chords"
              href="/dashboard/lyrics"
              completed={songs.length > 0}
            />
            <GettingStartedStep
              number={3}
              title="Create your first schedule"
              description="Plan your upcoming service with assignments"
              href="/dashboard/calendar"
              completed={schedules.length > 0}
            />
          </div>
        </div>
      )}
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
  value: number | string;
  label: string;
  color: "blue" | "emerald" | "violet" | "amber";
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    violet: "bg-violet-500/10 text-violet-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "emerald" | "violet" | "amber";
}) {
  const colorClasses = {
    blue: "group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/30",
    emerald:
      "group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30",
    violet:
      "group-hover:bg-violet-500/10 group-hover:text-violet-400 group-hover:border-violet-500/30",
    amber:
      "group-hover:bg-amber-500/10 group-hover:text-amber-400 group-hover:border-amber-500/30",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-200"
    >
      <div
        className={`p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 transition-all duration-200 ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </Link>
  );
}

function GettingStartedStep({
  number,
  title,
  description,
  href,
  completed,
}: {
  number: number;
  title: string;
  description: string;
  href: string;
  completed: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
        completed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-zinc-800 hover:border-amber-500/30 hover:bg-amber-500/5"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          completed
            ? "bg-emerald-500 text-zinc-900"
            : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {completed ? "✓" : number}
      </div>
      <div className="flex-1">
        <p
          className={`font-medium ${
            completed ? "text-emerald-400" : "text-white"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <ArrowRight
        className={`w-4 h-4 ${
          completed ? "text-emerald-400" : "text-zinc-600"
        }`}
      />
    </Link>
  );
}
