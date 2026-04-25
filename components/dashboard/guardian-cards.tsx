"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  CloudRain,
  Waves,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnvironmentalMetrics } from "@/lib/mock-data";

interface GuardianCardsProps {
  metrics: EnvironmentalMetrics;
}

export function GuardianCards({ metrics }: GuardianCardsProps) {
  const getHeatIndexColor = (temp: number) => {
    if (temp >= 52) return "bg-rose-600";
    if (temp >= 42) return "bg-red-500";
    if (temp >= 33) return "bg-orange-500";
    if (temp >= 27) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getHeatIndexProgress = (temp: number) => {
    // Scale: 20°C = 0%, 55°C = 100%
    return Math.min(100, Math.max(0, ((temp - 20) / 35) * 100));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-red-400" />;
      case "falling":
        return <TrendingDown className="h-4 w-4 text-green-400" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiverStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500 animate-pulse";
      case "alert":
        return "bg-orange-500 animate-pulse";
      default:
        return "bg-green-500";
    }
  };

  const getPrecipitationStatus = (mm: number) => {
    if (mm >= 100) return { label: "Torrential", color: "text-red-400" };
    if (mm >= 50) return { label: "Heavy", color: "text-orange-400" };
    if (mm >= 20) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "Light", color: "text-green-400" };
  };

  const precipStatus = getPrecipitationStatus(metrics.precipitation.last24h);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Heat Index Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Heat Index
          </CardTitle>
          <Thermometer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-bold text-foreground">
              {metrics.heatIndex.current}°C
            </span>
            {getTrendIcon(metrics.heatIndex.trend)}
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground">Caution</span>
              <span className="text-muted-foreground">Danger</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"
                style={{ width: "100%" }}
              />
              <div
                className="absolute inset-y-0 h-full w-1 bg-foreground"
                style={{ left: `${getHeatIndexProgress(metrics.heatIndex.current)}%` }}
              />
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "mt-3 border-0",
              metrics.heatIndex.status === "danger" || metrics.heatIndex.status === "extreme_danger"
                ? "bg-red-500/20 text-red-400"
                : "bg-orange-500/20 text-orange-400"
            )}
          >
            {metrics.heatIndex.status.replace("_", " ").toUpperCase()}
          </Badge>
        </CardContent>
      </Card>

      {/* Precipitation Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline">Precipitation (24h)</span>
            <span className="sm:hidden">Rain (24h)</span>
          </CardTitle>
          <CloudRain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-bold text-foreground">
              {metrics.precipitation.last24h}
            </span>
            <span className="text-sm sm:text-lg text-muted-foreground">mm</span>
          </div>
          <p className="mt-1 text-[10px] sm:text-sm text-muted-foreground">
            +{metrics.precipitation.forecast6h}mm in 6h
          </p>
          <div className="mt-3">
            <Progress
              value={Math.min(100, (metrics.precipitation.last24h / 150) * 100)}
              className="h-2"
            />
          </div>
          <Badge
            variant="outline"
            className={cn("mt-3 border-0 bg-blue-500/20", precipStatus.color)}
          >
            {precipStatus.label.toUpperCase()}
          </Badge>
        </CardContent>
      </Card>

      {/* River Level Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            River Level
          </CardTitle>
          <Waves className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-bold text-foreground">
              {metrics.riverLevel.current}m
            </span>
            <span className="text-[10px] sm:text-sm text-muted-foreground">
              / {metrics.riverLevel.threshold}m
            </span>
          </div>
          <p className="mt-1 text-[10px] sm:text-sm text-muted-foreground truncate">
            {metrics.riverLevel.riverName}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div
              className={cn("h-3 w-3 rounded-full", getRiverStatusColor(metrics.riverLevel.status))}
            />
            <span
              className={cn(
                "text-sm font-medium capitalize",
                metrics.riverLevel.status === "critical"
                  ? "text-red-400"
                  : metrics.riverLevel.status === "alert"
                  ? "text-orange-400"
                  : "text-green-400"
              )}
            >
              {metrics.riverLevel.status}
            </span>
          </div>
          <Progress
            value={(metrics.riverLevel.current / metrics.riverLevel.threshold) * 100}
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>

      {/* Risk Forecast Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline">Risk Forecast</span>
            <span className="sm:hidden">Risk</span>
          </CardTitle>
          <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-bold text-foreground">
              {metrics.riskForecast.floodRisk}%
            </span>
            <span className="text-[10px] sm:text-sm text-muted-foreground">
              in {metrics.riskForecast.timeframe}
            </span>
          </div>
          <p className="mt-1 text-[10px] sm:text-sm text-muted-foreground truncate">
            {metrics.riskForecast.primaryThreat}
          </p>
          <div className="mt-3">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  metrics.riskForecast.floodRisk >= 70
                    ? "bg-red-500"
                    : metrics.riskForecast.floodRisk >= 40
                    ? "bg-orange-500"
                    : "bg-green-500"
                )}
                style={{ width: `${metrics.riskForecast.floodRisk}%` }}
              />
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            {["24h", "48h", "72h"].map((time, i) => (
              <Badge
                key={time}
                variant="outline"
                className={cn(
                  "border-0 text-xs",
                  time === metrics.riskForecast.timeframe
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {time}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
