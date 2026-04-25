"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  CloudRain,
  Wind,
  Flame,
  Mountain,
  AlertTriangle,
  Info,
  RefreshCw,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/mock-data";

interface NewsFeedProps {
  news: NewsItem[];
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getCategoryIcon(category: NewsItem["category"]) {
  switch (category) {
    case "typhoon":
      return <Wind className="h-4 w-4" />;
    case "flood":
      return <CloudRain className="h-4 w-4" />;
    case "earthquake":
      return <Mountain className="h-4 w-4" />;
    case "heatwave":
      return <Flame className="h-4 w-4" />;
    case "landslide":
      return <Mountain className="h-4 w-4" />;
    case "advisory":
      return <Info className="h-4 w-4" />;
    case "recovery":
      return <RefreshCw className="h-4 w-4" />;
    default:
      return <Newspaper className="h-4 w-4" />;
  }
}

function getCategoryColor(category: NewsItem["category"]) {
  switch (category) {
    case "typhoon":
      return "text-purple-400 bg-purple-500/20";
    case "flood":
      return "text-blue-400 bg-blue-500/20";
    case "earthquake":
      return "text-amber-400 bg-amber-500/20";
    case "heatwave":
      return "text-orange-400 bg-orange-500/20";
    case "landslide":
      return "text-yellow-400 bg-yellow-500/20";
    case "advisory":
      return "text-cyan-400 bg-cyan-500/20";
    case "recovery":
      return "text-green-400 bg-green-500/20";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function getSeverityStyles(severity: NewsItem["severity"]) {
  switch (severity) {
    case "critical":
      return "border-red-500/50 bg-red-500/5";
    case "warning":
      return "border-orange-500/50 bg-orange-500/5";
    default:
      return "border-border/50 bg-card/50";
  }
}

function NewsCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Card
        className={cn(
          "transition-all cursor-pointer hover:shadow-md active:scale-[0.99]",
          getSeverityStyles(item.severity),
          item.isBreaking && "ring-1 ring-red-500/50"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <CardContent className="p-3 sm:p-4">
          {/* Breaking News Badge */}
          {item.isBreaking && (
            <Badge
              variant="destructive"
              className="mb-2 animate-pulse text-[10px] sm:text-xs"
            >
              BREAKING
            </Badge>
          )}

          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div
              className={cn(
                "flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg",
                getCategoryColor(item.category)
              )}
            >
              {getCategoryIcon(item.category)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2">
                {item.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                <span className="font-medium">{item.source}</span>
                <span className="hidden sm:inline">-</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(item.timestamp)}
                </span>
              </div>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground transition-transform",
                expanded && "rotate-90"
              )}
            />
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3 border-t border-border/50 pt-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Affected Areas */}
                  {item.affectedAreas && item.affectedAreas.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      {item.affectedAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs w-full sm:w-auto"
                  >
                    Read Full Story
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NewsFeed({ news }: NewsFeedProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");

  const filteredNews = news.filter((item) => {
    if (filter === "all") return true;
    return item.severity === filter;
  });

  const breakingCount = news.filter((n) => n.isBreaking).length;
  const criticalCount = news.filter((n) => n.severity === "critical").length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-sm sm:text-base">News & Reports</CardTitle>
            {breakingCount > 0 && (
              <Badge variant="destructive" className="animate-pulse text-[10px]">
                {breakingCount} Breaking
              </Badge>
            )}
          </div>
        </div>

        {/* Filter Buttons - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 mt-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="shrink-0 text-xs h-8"
            onClick={() => setFilter("all")}
          >
            All ({news.length})
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            className="shrink-0 text-xs h-8 gap-1"
            onClick={() => setFilter("critical")}
          >
            <AlertTriangle className="h-3 w-3" />
            Critical ({criticalCount})
          </Button>
          <Button
            variant={filter === "warning" ? "default" : "outline"}
            size="sm"
            className="shrink-0 text-xs h-8"
            onClick={() => setFilter("warning")}
          >
            Warnings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[350px] sm:max-h-[450px] overflow-y-auto">
          <div className="space-y-3 p-4 pt-0">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </AnimatePresence>

            {filteredNews.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <Newspaper className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No news items match your filter</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
