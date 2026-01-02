"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Phone, Edit, Trash2, Ban, TrendingUp, Minus, Star } from "lucide-react";
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
        return null;
    }
  };

  return (
    <div className={cn(
      "rounded-xl border bg-zinc-900/50 p-4 transition-all duration-200 hover:bg-zinc-900/80",
      person.isExempt 
        ? "border-orange-500/30 bg-orange-500/5" 
        : "border-zinc-800"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white truncate">{person.name}</h3>
            {person.isExempt && (
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                <Ban className="w-3 h-3 mr-1" />
                Exempt
              </Badge>
            )}
            {person.priority && person.priority !== "normal" && (
              <Badge className={cn(
                "text-xs",
                person.priority === "high" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
              )}>
                {getPriorityIcon(person.priority)}
                {person.priority === "high" ? "High Priority" : "Low Priority"}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-0.5">
          {onToggleExemption && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800",
                    person.isExempt && "text-orange-400 hover:text-orange-300"
                  )}
                  onClick={() => onToggleExemption(person.id)}
                >
                  <Ban className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{person.isExempt ? "Remove exemption" : "Exempt from auto-schedule"}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={() => onEdit(person)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit person</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => onDelete(person.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete person</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 mb-4">
        {person.email && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Mail className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
            <span className="truncate">{person.email}</span>
          </div>
        )}
        {person.phone && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
            <span>{person.phone}</span>
          </div>
        )}
        {!person.email && !person.phone && (
          <p className="text-sm text-zinc-500 italic">No contact info</p>
        )}
      </div>

      {/* Ministries */}
      <div className="pt-3 border-t border-zinc-800">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Ministries
        </p>
        {person.ministries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {person.ministries.map((ministry) => (
              <Badge 
                key={ministry} 
                className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
              >
                {getMinistryLabel(ministry)}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">No ministries assigned</p>
        )}
      </div>
    </div>
  );
}
