"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  Zap,
  Droplets,
  Package,
  Car,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Heart,
  Utensils,
  Truck,
  Wrench,
  Pill,
  Home,
  AlertCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DamageReport, RecoveryProgress, BayanihanItem } from "@/lib/mock-data";

interface RecoveryDashboardProps {
  damageReports: DamageReport[];
  progress: RecoveryProgress;
  bayanihanItems: BayanihanItem[];
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function getCategoryIcon(category: DamageReport["category"]) {
  switch (category) {
    case "electricity":
      return <Zap className="h-4 w-4" />;
    case "water":
      return <Droplets className="h-4 w-4" />;
    case "road":
      return <Car className="h-4 w-4" />;
    case "structure":
      return <Home className="h-4 w-4" />;
    case "bridge":
      return <Car className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

function getBayanihanIcon(category: BayanihanItem["category"]) {
  switch (category) {
    case "food":
      return <Utensils className="h-4 w-4" />;
    case "water":
      return <Droplets className="h-4 w-4" />;
    case "medicine":
      return <Pill className="h-4 w-4" />;
    case "shelter":
      return <Home className="h-4 w-4" />;
    case "transport":
      return <Truck className="h-4 w-4" />;
    case "skills":
      return <Wrench className="h-4 w-4" />;
    case "supplies":
      return <Package className="h-4 w-4" />;
    default:
      return <Heart className="h-4 w-4" />;
  }
}

function ProgressGauge({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16 sm:h-20 sm:w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", color)} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg sm:text-xl font-bold">{value}%</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{label}</p>
      </div>
    </div>
  );
}

function DamageReportCard({ report }: { report: DamageReport }) {
  const statusColor = {
    reported: "text-yellow-400 bg-yellow-500/20",
    verified: "text-blue-400 bg-blue-500/20",
    in_progress: "text-orange-400 bg-orange-500/20",
    resolved: "text-green-400 bg-green-500/20",
  };

  return (
    <Card className="border-border/50 bg-card/30">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            {getCategoryIcon(report.category)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm line-clamp-1">{report.description}</h4>
              <Badge className={cn("shrink-0 text-[10px]", statusColor[report.status])}>
                {report.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{report.location}, {report.barangay}</span>
            </div>
            {report.aiTags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {report.aiTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(report.timestamp)} by {report.reportedBy}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BayanihanCard({ item, allItems }: { item: BayanihanItem; allItems: BayanihanItem[] }) {
  const matchedItem = item.matchedWith
    ? allItems.find((i) => i.id === item.matchedWith)
    : null;

  return (
    <Card
      className={cn(
        "border-border/50",
        item.type === "need" ? "bg-orange-500/5" : "bg-green-500/5",
        item.isMatched && "ring-1 ring-green-500/50"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              item.type === "need" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"
            )}
          >
            {getBayanihanIcon(item.category)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  item.type === "need"
                    ? "border-orange-500/50 text-orange-400"
                    : "border-green-500/50 text-green-400"
                )}
              >
                {item.type === "need" ? "NEED" : "OFFER"}
              </Badge>
              {item.isMatched && (
                <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Matched
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm font-medium line-clamp-2">{item.description}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.location}
            </div>
            
            {item.isMatched && matchedItem && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-md p-2">
                <ArrowRight className="h-3 w-3" />
                <span className="truncate">Matched with: {matchedItem.contactName}</span>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {formatTimeAgo(item.timestamp)}
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" asChild>
                <a href={`tel:${item.contactNumber}`}>
                  <Phone className="h-3 w-3" />
                  Contact
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecoveryDashboard({
  damageReports,
  progress,
  bayanihanItems,
}: RecoveryDashboardProps) {
  const [activeTab, setActiveTab] = useState("progress");

  const needs = bayanihanItems.filter((i) => i.type === "need");
  const offers = bayanihanItems.filter((i) => i.type === "offer");
  const matchedCount = bayanihanItems.filter((i) => i.isMatched).length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
          <CardTitle className="text-sm sm:text-base">Recovery Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 sm:px-6">
            <TabsList className="w-full grid grid-cols-3 h-9">
              <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
              <TabsTrigger value="damage" className="text-xs">Damage</TabsTrigger>
              <TabsTrigger value="bayanihan" className="text-xs">Bayanihan</TabsTrigger>
            </TabsList>
          </div>

          {/* Progress Tab */}
          <TabsContent value="progress" className="mt-0 p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ProgressGauge
                label="Power Restored"
                value={progress.powerRestored}
                icon={Zap}
                color="text-yellow-400"
              />
              <ProgressGauge
                label="Water Supply"
                value={progress.waterSupply}
                icon={Droplets}
                color="text-blue-400"
              />
              <ProgressGauge
                label="Aid Distributed"
                value={progress.aidDistributed}
                icon={Package}
                color="text-green-400"
              />
              <ProgressGauge
                label="Roads Cleared"
                value={progress.roadsCleared}
                icon={Car}
                color="text-orange-400"
              />
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground text-center">
                Recovery data updated in real-time from LGU and utility company reports
              </p>
            </div>
          </TabsContent>

          {/* Damage Reports Tab */}
          <TabsContent value="damage" className="mt-0">
            <div className="max-h-[350px] overflow-y-auto">
              <div className="space-y-2 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">
                    {damageReports.length} community reports
                  </p>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                    <Camera className="h-3 w-3" />
                    Submit Report
                  </Button>
                </div>
                {damageReports.map((report) => (
                  <DamageReportCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Bayanihan Exchange Tab */}
          <TabsContent value="bayanihan" className="mt-0">
            <div className="max-h-[350px] overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-3">
                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-3">
                    <span className="text-orange-400">{needs.length} Needs</span>
                    <span className="text-green-400">{offers.length} Offers</span>
                    <span className="text-primary">{matchedCount / 2} Matches</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                    Post
                  </Button>
                </div>

                {/* Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Needs Column */}
                  <div>
                    <p className="text-xs font-medium text-orange-400 mb-2">Needs</p>
                    <div className="space-y-2">
                      {needs.map((item) => (
                        <BayanihanCard key={item.id} item={item} allItems={bayanihanItems} />
                      ))}
                    </div>
                  </div>

                  {/* Offers Column */}
                  <div>
                    <p className="text-xs font-medium text-green-400 mb-2">Offers</p>
                    <div className="space-y-2">
                      {offers.map((item) => (
                        <BayanihanCard key={item.id} item={item} allItems={bayanihanItems} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
