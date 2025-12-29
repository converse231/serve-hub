"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit, Trash2, Ban, Star, TrendingUp, Minus } from "lucide-react";
import type { Person } from "@/lib/types";
import { MINISTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
  onToggleExemption?: (id: string) => void;
}

export function PersonCard({ person, onEdit, onDelete, onToggleExemption }: PersonCardProps) {
  const getMinistryLabel = (value: string) => {
    return MINISTRIES.find((m) => m.value === value)?.label || value;
  };

  const getPriorityIcon = (priority?: "high" | "normal" | "low") => {
    switch (priority) {
      case "high":
        return <TrendingUp className="w-3 h-3" />;
      case "low":
        return <Minus className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority?: "high" | "normal" | "low") => {
    switch (priority) {
      case "high":
        return "text-green-600 dark:text-green-400";
      case "low":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <Card className={cn(person.isExemptFromAutoSchedule && "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/10")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg truncate">{person.name}</h3>
              {person.isExemptFromAutoSchedule && (
                <Badge variant="outline" className="gap-1 border-orange-500 text-orange-600 dark:text-orange-400">
                  <Ban className="w-3 h-3" />
                  Exempt
                </Badge>
              )}
              {person.priority && person.priority !== "normal" && (
                <Badge variant="outline" className={cn("gap-1", getPriorityColor(person.priority))}>
                  {getPriorityIcon(person.priority)}
                  {person.priority}
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-1.5">
              {person.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{person.email}</span>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{person.phone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {onToggleExemption && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  person.isExemptFromAutoSchedule
                    ? "text-orange-600 hover:text-orange-700 dark:text-orange-400"
                    : ""
                )}
                onClick={() => onToggleExemption(person.id)}
                title={person.isExemptFromAutoSchedule ? "Remove exemption" : "Exempt from auto-schedule"}
              >
                <Ban className="w-4 h-4" />
                <span className="sr-only">Toggle exemption</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(person)}
            >
              <Edit className="w-4 h-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(person.id)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Ministries
          </p>
          {person.ministries.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {person.ministries.map((ministry) => (
                <Badge key={ministry} variant="secondary">
                  {getMinistryLabel(ministry)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No ministries assigned</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

