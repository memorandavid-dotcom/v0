"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  MapPin,
  Wifi,
  Signal,
  MessageSquare,
  AlertTriangle,
  Phone,
  Navigation,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { FamilyMember } from "@/lib/mock-data";

interface FamilyCircleProps {
  members: FamilyMember[];
  onEmergencyPing: () => void;
}

function getStatusColor(status: FamilyMember["status"]) {
  switch (status) {
    case "safe":
      return "border-green-500 bg-green-500/10 text-green-400";
    case "at_risk":
      return "border-red-500 bg-red-500/10 text-red-400";
    case "offline":
      return "border-orange-500 bg-orange-500/10 text-orange-400";
    default:
      return "border-muted";
  }
}

function getStatusLabel(status: FamilyMember["status"]) {
  switch (status) {
    case "safe":
      return "Safe";
    case "at_risk":
      return "In Hazard Zone";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
}

function getConnectionIcon(mode: FamilyMember["connectionMode"]) {
  switch (mode) {
    case "fiber":
      return <Wifi className="h-3 w-3 text-green-400" />;
    case "4g":
      return <Signal className="h-3 w-3 text-green-400" />;
    case "sms":
      return <MessageSquare className="h-3 w-3 text-orange-400" />;
    default:
      return null;
  }
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function FamilyCircle({ members, onEmergencyPing }: FamilyCircleProps) {
  const [isPinging, setIsPinging] = useState(false);
  const [pingSent, setPingSent] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [locationPinging, setLocationPinging] = useState<string | null>(null);

  const handleEmergencyPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingSent(true);
      setTimeout(() => setPingSent(false), 3000);
      onEmergencyPing();
    }, 2000);
  };

  const handlePingLocation = (memberId: string) => {
    setLocationPinging(memberId);
    setTimeout(() => setLocationPinging(null), 2000);
  };

  const atRiskMembers = members.filter((m) => m.status === "at_risk");

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Family Circle
          </CardTitle>
          <Badge variant="secondary" className="text-xs">{members.length} members</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        {/* At Risk Warning */}
        <AnimatePresence>
          {atRiskMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 border border-red-500/30"
            >
              <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
              <span className="text-sm text-red-400">
                {atRiskMembers.length} family member{atRiskMembers.length > 1 ? "s" : ""} in hazard zone
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Family Members List */}
        <div className="space-y-3">
          {members.map((member) => (
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                    getStatusColor(member.status)
                  )}
                  onClick={() => setSelectedMember(member)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-foreground">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      {getConnectionIcon(member.connectionMode)}
                      {member.connectionMode === "sms" && (
                        <span className="text-[10px] text-orange-400">SMS Mode</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{member.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        member.status === "safe" && "border-green-500/50 text-green-400",
                        member.status === "at_risk" && "border-red-500/50 text-red-400",
                        member.status === "offline" && "border-orange-500/50 text-orange-400"
                      )}
                    >
                      {getStatusLabel(member.status)}
                    </Badge>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatTimeSince(member.lastSeen)}
                    </p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {member.name}
                    <Badge variant="outline" className="ml-2">
                      {member.relationship}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Last seen: {formatTimeSince(member.lastSeen)} - {member.distance.toFixed(1)} km away
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.location}</span>
                    </div>
                    {member.status === "at_risk" && (
                      <Badge variant="destructive" className="animate-pulse">
                        Hazard Zone
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getConnectionIcon(member.connectionMode)}
                    <span>
                      {member.connectionMode === "fiber" && "Fiber/WiFi Connection"}
                      {member.connectionMode === "4g" && "4G Mobile Connection"}
                      {member.connectionMode === "sms" && "SMS Mode Active (Offline)"}
                    </span>
                  </div>
                  {member.status === "offline" && (
                    <p className="text-xs text-orange-400">
                      This member appears to be offline. SMS fallback will be used for communication.
                    </p>
                  )}
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handlePingLocation(member.id)}
                    disabled={locationPinging === member.id}
                  >
                    {locationPinging === member.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    Ping Location
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={`tel:${member.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                  </Button>
                  <Button variant="default" className="gap-2" asChild>
                    <a href={`sms:${member.phone}`}>
                      <MessageSquare className="h-4 w-4" />
                      Send Message
                    </a>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Emergency Ping Button */}
        <Button
          variant="destructive"
          className="w-full gap-2 h-12 text-base"
          onClick={handleEmergencyPing}
          disabled={isPinging || pingSent}
        >
          {pingSent ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Emergency Ping Sent!
            </>
          ) : isPinging ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending Emergency Ping...
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5" />
              Send Emergency Ping to All
            </>
          )}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">
          Sends SMS if family members are offline
        </p>
      </CardContent>
    </Card>
  );
}
