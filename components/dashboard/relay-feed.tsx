"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Bell,
  Brain,
  Clock,
  MapPin,
  Phone,
  Users,
  Siren,
  CloudRain,
  Flame,
  Mountain,
  Waves as WavesIcon,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem, SOSAlert, PredictiveWarning, RescueTeam, FamilyMessage } from "@/lib/mock-data";
import { FamilyMessageNotification } from "./family-messaging";

interface RelayFeedProps {
  alerts: AlertItem[];
  rescueTeams: RescueTeam[];
  familyMessages?: FamilyMessage[];
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function SOSAlertCard({
  alert,
  rescueTeams,
}: {
  alert: SOSAlert;
  rescueTeams: RescueTeam[];
}) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const availableTeams = rescueTeams.filter((team) => team.status === "available");

  const handleAssign = () => {
    if (!selectedTeam) return;
    setIsAssigning(true);
    // Simulate API call
    setTimeout(() => {
      setIsAssigning(false);
    }, 1500);
  };

  const getSeverityStyles = (level: number) => {
    switch (level) {
      case 5:
        return "border-red-500 bg-red-500/10";
      case 4:
        return "border-orange-500 bg-orange-500/10";
      case 3:
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-blue-500 bg-blue-500/10";
    }
  };

  const getStatusBadge = () => {
    switch (alert.status) {
      case "assigned":
        return (
          <Badge className="bg-blue-500/20 text-blue-400">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Assigned
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-orange-500/20 text-orange-400">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-500/20 text-red-400">
            <Siren className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "border-l-4 transition-all hover:shadow-lg",
          getSeverityStyles(alert.urgencyLevel)
        )}
      >
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  alert.urgencyLevel >= 4
                    ? "bg-red-500 animate-pulse"
                    : "bg-orange-500"
                )}
              >
                <Siren className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">SOS ALERT</p>
                <p className="text-xs text-muted-foreground">
                  Level {alert.urgencyLevel} Urgency
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <div className="mb-3 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{alert.location}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.barangay}, {alert.city}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm italic text-foreground">
                &ldquo;{alert.message}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{alert.headcount} persons</span>
              </div>
              {alert.contactNumber && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{alert.contactNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeAgo(alert.timestamp)}</span>
              </div>
            </div>
          </div>

          {alert.status === "pending" && (
            <div className="flex gap-2">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select rescue team..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} ({team.members} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssign}
                disabled={!selectedTeam || isAssigning}
                className="shrink-0"
              >
                {isAssigning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Assign"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PredictiveWarningCard({ warning }: { warning: PredictiveWarning }) {
  const getWarningIcon = () => {
    switch (warning.warningType) {
      case "flood":
        return <CloudRain className="h-4 w-4 text-blue-400" />;
      case "heatstroke":
        return <Flame className="h-4 w-4 text-orange-400" />;
      case "landslide":
        return <Mountain className="h-4 w-4 text-amber-400" />;
      case "storm_surge":
        return <WavesIcon className="h-4 w-4 text-cyan-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getWarningColor = () => {
    switch (warning.warningType) {
      case "flood":
        return "border-blue-500 bg-blue-500/10";
      case "heatstroke":
        return "border-orange-500 bg-orange-500/10";
      case "landslide":
        return "border-amber-500 bg-amber-500/10";
      case "storm_surge":
        return "border-cyan-500 bg-cyan-500/10";
      default:
        return "border-yellow-500 bg-yellow-500/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("border-l-4 transition-all hover:shadow-lg", getWarningColor())}>
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">PREDICTIVE WARNING</p>
                <p className="text-xs text-muted-foreground">
                  {warning.source} Generated
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              {getWarningIcon()}
              {warning.warningType.replace("_", " ")}
            </Badge>
          </div>

          <div className="mb-3 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm">{warning.affectedArea}</p>
            </div>

            <p className="text-sm text-muted-foreground">{warning.message}</p>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{warning.recipientCount.toLocaleString()} notified</span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "border-0",
                  warning.riskPercentage >= 70
                    ? "bg-red-500/20 text-red-400"
                    : warning.riskPercentage >= 40
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-yellow-500/20 text-yellow-400"
                )}
              >
                {warning.riskPercentage}% Risk
              </Badge>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeAgo(warning.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function RelayFeed({ alerts, rescueTeams, familyMessages = [] }: RelayFeedProps) {
  const [filter, setFilter] = useState<"all" | "sos" | "predictive" | "family">("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all" || filter === "family") return true;
    return alert.type === filter;
  });

  const sosCount = alerts.filter((a) => a.type === "sos").length;
  const predictiveCount = alerts.filter((a) => a.type === "predictive").length;
  const familyCount = familyMessages.filter((m) => !m.isRead).length;
  
  // Show family messages in "all" and "family" filters
  const showFamilyMessages = filter === "all" || filter === "family";

  return (
    <Card className="flex h-full flex-col border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50 p-4 sm:p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-sm sm:text-lg">Relay Feed</CardTitle>
          </div>
          <Badge variant="outline" className="animate-pulse border-red-500/50 text-red-400 text-xs">
            {alerts.length} Active
          </Badge>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto -mx-1 px-1">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="shrink-0 text-xs h-8"
          >
            All ({alerts.length})
          </Button>
          <Button
            variant={filter === "sos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("sos")}
            className="gap-1 shrink-0 text-xs h-8"
          >
            <Siren className="h-3 w-3" />
            SOS ({sosCount})
          </Button>
          <Button
            variant={filter === "predictive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("predictive")}
            className="gap-1 shrink-0 text-xs h-8"
          >
            <Brain className="h-3 w-3" />
            AI ({predictiveCount})
          </Button>
          {familyMessages.length > 0 && (
            <Button
              variant={filter === "family" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("family")}
              className="gap-1 shrink-0 text-xs h-8"
            >
              <Users className="h-3 w-3" />
              Family {familyCount > 0 && `(${familyCount})`}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-[350px] sm:h-[400px] lg:h-[calc(100vh-380px)] lg:max-h-[500px] overflow-y-auto">
          <div className="space-y-3 p-4">
            <AnimatePresence mode="popLayout">
              {/* Family Messages (shown first if filter is "all" or "family") */}
              {showFamilyMessages && familyMessages.filter(m => !m.isRead).map((message) => (
                <FamilyMessageNotification key={message.id} message={message} />
              ))}
              
              {/* Regular Alerts */}
              {filter !== "family" && filteredAlerts.map((alert) =>
                alert.type === "sos" ? (
                  <SOSAlertCard
                    key={alert.id}
                    alert={alert as SOSAlert}
                    rescueTeams={rescueTeams}
                  />
                ) : (
                  <PredictiveWarningCard
                    key={alert.id}
                    warning={alert as PredictiveWarning}
                  />
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
