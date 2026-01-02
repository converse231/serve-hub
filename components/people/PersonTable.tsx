"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Phone, Edit, Trash2, Ban, TrendingUp, Minus } from "lucide-react";
import type { Person } from "@/lib/types";
import { MINISTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PersonTableProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
  onToggleExemption?: (id: string) => void;
}

export function PersonTable({
  people,
  onEdit,
  onDelete,
  onToggleExemption,
}: PersonTableProps) {
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Name</TableHead>
            <TableHead className="text-zinc-400 font-medium">Contact</TableHead>
            <TableHead className="text-zinc-400 font-medium">Ministries</TableHead>
            <TableHead className="text-zinc-400 font-medium">Status</TableHead>
            <TableHead className="text-zinc-400 font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-zinc-400">
                No people found
              </TableCell>
            </TableRow>
          ) : (
            people.map((person) => (
              <TableRow
                key={person.id}
                className={cn(
                  "border-zinc-800 hover:bg-zinc-900/80 transition-colors",
                  person.isExempt && "bg-orange-500/5"
                )}
              >
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-2">
                    <span>{person.name}</span>
                    {person.priority && person.priority !== "normal" && (
                      <Badge
                        className={cn(
                          "text-xs px-1.5 py-0",
                          person.priority === "high"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                        )}
                      >
                        {getPriorityIcon(person.priority)}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {person.email && (
                      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{person.email}</span>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{person.phone}</span>
                      </div>
                    )}
                    {!person.email && !person.phone && (
                      <span className="text-sm text-zinc-500 italic">No contact info</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {person.ministries.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {person.ministries.map((ministry) => (
                        <Badge
                          key={ministry}
                          className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs"
                        >
                          {getMinistryLabel(ministry)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500 italic">No ministries</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {person.isExempt && (
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                        <Ban className="w-3 h-3 mr-1" />
                        Exempt
                      </Badge>
                    )}
                    {person.isActive === false && (
                      <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-xs">
                        Inactive
                      </Badge>
                    )}
                    {person.isActive !== false && !person.isExempt && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
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
                          <p>
                            {person.isExempt
                              ? "Remove exemption"
                              : "Exempt from auto-schedule"}
                          </p>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

