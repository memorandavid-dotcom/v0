"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Thermometer,
  CloudRain,
  Waves,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  EnvironmentalMetrics,
  HourlyDataPoint,
  RiskForecastData,
} from "@/lib/mock-data";
import {
  mockHeatIndexHourly,
  mockPrecipitationHourly,
  mockRiverLevelHourly,
  mockRiskForecasts,
} from "@/lib/mock-data";

interface GuardianCardsProps {
  metrics: EnvironmentalMetrics;
}

// Mini Chart Component for hourly data
function MiniChart({
  data,
  maxValue,
  color,
  showThreshold,
  threshold,
}: {
  data: HourlyDataPoint[];
  maxValue: number;
  color: string;
  showThreshold?: boolean;
  threshold?: number;
}) {
  const height = 80;
  const width = "100%";

  return (
    <div className="relative h-20 w-full">
      <svg viewBox={`0 0 ${data.length * 12} ${height}`} className="w-full h-full">
        {/* Threshold line */}
        {showThreshold && threshold && (
          <line
            x1="0"
            y1={height - (threshold / maxValue) * height}
            x2={data.length * 12}
            y2={height - (threshold / maxValue) * height}
            stroke="red"
            strokeDasharray="4 2"
            strokeWidth="1"
            opacity="0.5"
          />
        )}
        {/* Bars */}
        {data.map((point, i) => {
          const barHeight = (point.value / maxValue) * height;
          return (
            <rect
              key={i}
              x={i * 12 + 1}
              y={height - barHeight}
              width="10"
              height={barHeight}
              className={cn("transition-all", color)}
              rx="2"
            />
          );
        })}
      </svg>
    </div>
  );
}

// Detailed Chart for Dialog
function DetailedChart({
  data,
  maxValue,
  unit,
  colorFn,
  showThreshold,
  threshold,
  thresholdLabel,
}: {
  data: HourlyDataPoint[];
  maxValue: number;
  unit: string;
  colorFn: (value: number) => string;
  showThreshold?: boolean;
  threshold?: number;
  thresholdLabel?: string;
}) {
  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative h-48 w-full bg-muted/30 rounded-lg p-4">
        <div className="flex items-end justify-between h-full gap-1">
          {data.map((point, i) => {
            const barHeight = (point.value / maxValue) * 100;
            return (
              <div key={i} className="flex flex-col items-center flex-1 h-full">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      colorFn(point.value)
                    )}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground mt-1 rotate-45 sm:rotate-0">
                  {point.hour.replace("AM", "").replace("PM", "")}
                </span>
              </div>
            );
          })}
        </div>
        {/* Threshold line overlay */}
        {showThreshold && threshold && (
          <div
            className="absolute left-4 right-4 border-t-2 border-dashed border-red-500"
            style={{ bottom: `${(threshold / maxValue) * 100 * 0.85 + 15}%` }}
          >
            <span className="absolute -top-5 right-0 text-[10px] text-red-400">
              {thresholdLabel || `${threshold}${unit}`}
            </span>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-xs">
        {data.filter((_, i) => i % 2 === 0).map((point, i) => (
          <div
            key={i}
            className={cn(
              "p-2 rounded text-center",
              colorFn(point.value).replace("bg-", "bg-opacity-20 bg-")
            )}
          >
            <div className="font-medium">{point.value}{unit}</div>
            <div className="text-muted-foreground text-[10px]">{point.hour}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuardianCards({ metrics }: GuardianCardsProps) {
  const [activeDialog, setActiveDialog] = useState<
    "heat" | "precipitation" | "river" | "risk" | null
  >(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "48h" | "72h">("48h");

  const getHeatIndexColor = (temp: number) => {
    if (temp >= 52) return "bg-rose-600";
    if (temp >= 42) return "bg-red-500";
    if (temp >= 33) return "bg-orange-500";
    if (temp >= 27) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getHeatIndexProgress = (temp: number) => {
    return Math.min(100, Math.max(0, ((temp - 20) / 35) * 100));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />;
      case "falling":
        return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />;
      default:
        return <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />;
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

  const getPrecipitationBarColor = (mm: number) => {
    if (mm >= 15) return "bg-red-500";
    if (mm >= 10) return "bg-orange-500";
    if (mm >= 5) return "bg-yellow-500";
    if (mm > 0) return "bg-blue-400";
    return "bg-muted";
  };

  const getRiverLevelColor = (level: number) => {
    const threshold = metrics.riverLevel.threshold;
    if (level >= threshold) return "bg-red-500";
    if (level >= threshold * 0.85) return "bg-orange-500";
    if (level >= threshold * 0.7) return "bg-yellow-500";
    return "bg-cyan-500";
  };

  const precipStatus = getPrecipitationStatus(metrics.precipitation.last24h);
  const selectedRisk = mockRiskForecasts.find((r) => r.timeframe === selectedTimeframe);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Heat Index Card - Clickable */}
        <Card
          className="border-border/50 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 transition-colors active:scale-[0.98]"
          onClick={() => setActiveDialog("heat")}
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Heat Index
            </CardTitle>
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <Thermometer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-3xl font-bold text-foreground">
                {metrics.heatIndex.current}°C
              </span>
              {getTrendIcon(metrics.heatIndex.trend)}
            </div>
            <div className="mt-2">
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
                "mt-2 border-0 text-[10px] sm:text-xs",
                metrics.heatIndex.status === "danger" ||
                  metrics.heatIndex.status === "extreme_danger"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-orange-500/20 text-orange-400"
              )}
            >
              {metrics.heatIndex.status.replace("_", " ").toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Precipitation Card - Clickable */}
        <Card
          className="border-border/50 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 transition-colors active:scale-[0.98]"
          onClick={() => setActiveDialog("precipitation")}
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              <span className="hidden sm:inline">Precipitation</span>
              <span className="sm:hidden">Rain</span>
            </CardTitle>
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <CloudRain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-3xl font-bold text-foreground">
                {metrics.precipitation.last24h}
              </span>
              <span className="text-sm sm:text-lg text-muted-foreground">mm</span>
            </div>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
              +{metrics.precipitation.forecast6h}mm in 6h
            </p>
            <Progress
              value={Math.min(100, (metrics.precipitation.last24h / 150) * 100)}
              className="mt-2 h-2"
            />
            <Badge
              variant="outline"
              className={cn("mt-2 border-0 text-[10px] sm:text-xs bg-blue-500/20", precipStatus.color)}
            >
              {precipStatus.label.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* River Level Card - Clickable */}
        <Card
          className="border-border/50 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 transition-colors active:scale-[0.98]"
          onClick={() => setActiveDialog("river")}
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              River Level
            </CardTitle>
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <Waves className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-3xl font-bold text-foreground">
                {metrics.riverLevel.current}m
              </span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">
                / {metrics.riverLevel.threshold}m
              </span>
            </div>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground truncate">
              {metrics.riverLevel.riverName}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={cn("h-2.5 w-2.5 rounded-full", getRiverStatusColor(metrics.riverLevel.status))}
              />
              <span
                className={cn(
                  "text-xs font-medium capitalize",
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
          </CardContent>
        </Card>

        {/* Risk Forecast Card - Interactive Timeframes */}
        <Card
          className="border-border/50 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 transition-colors active:scale-[0.98]"
          onClick={() => setActiveDialog("risk")}
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Risk Forecast
            </CardTitle>
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-3xl font-bold text-foreground">
                {selectedRisk?.floodRisk || metrics.riskForecast.floodRisk}%
              </span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">
                risk
              </span>
            </div>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground truncate">
              {selectedRisk?.primaryThreat || metrics.riskForecast.primaryThreat}
            </p>
            {/* Timeframe Buttons */}
            <div className="mt-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
              {(["24h", "48h", "72h"] as const).map((time) => (
                <Button
                  key={time}
                  variant={selectedTimeframe === time ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex-1 h-6 sm:h-7 text-[10px] sm:text-xs px-1 sm:px-2",
                    selectedTimeframe === time
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "hover:bg-amber-500/20"
                  )}
                  onClick={() => setSelectedTimeframe(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heat Index Dialog */}
      <Dialog open={activeDialog === "heat"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-400" />
              Heat Index - 24 Hour Trend
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Current Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">{metrics.heatIndex.current}°C</div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">
                  {Math.max(...mockHeatIndexHourly.map((d) => d.value))}°C
                </div>
                <div className="text-xs text-muted-foreground">Peak Today</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">
                  {Math.min(...mockHeatIndexHourly.map((d) => d.value))}°C
                </div>
                <div className="text-xs text-muted-foreground">Low Today</div>
              </div>
            </div>

            {/* Chart */}
            <DetailedChart
              data={mockHeatIndexHourly}
              maxValue={55}
              unit="°C"
              colorFn={getHeatIndexColor}
              showThreshold
              threshold={42}
              thresholdLabel="Danger Zone"
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" /> Normal
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500" /> Caution
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500" /> Extreme Caution
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500" /> Danger
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-rose-600" /> Extreme Danger
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Precipitation Dialog */}
      <Dialog open={activeDialog === "precipitation"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-400" />
              Precipitation - 24 Hour History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Current Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">{metrics.precipitation.last24h}mm</div>
                <div className="text-xs text-muted-foreground">Last 24h</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">+{metrics.precipitation.forecast6h}mm</div>
                <div className="text-xs text-muted-foreground">Next 6h</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">
                  {Math.max(...mockPrecipitationHourly.map((d) => d.value))}mm
                </div>
                <div className="text-xs text-muted-foreground">Peak Hourly</div>
              </div>
            </div>

            {/* Chart */}
            <DetailedChart
              data={mockPrecipitationHourly}
              maxValue={20}
              unit="mm"
              colorFn={getPrecipitationBarColor}
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" /> None
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-400" /> Light
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500" /> Moderate
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500" /> Heavy
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500" /> Torrential
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* River Level Dialog */}
      <Dialog open={activeDialog === "river"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-cyan-400" />
              {metrics.riverLevel.riverName} - 24 Hour Level
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Current Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">{metrics.riverLevel.current}m</div>
                <div className="text-xs text-muted-foreground">Current Level</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold text-red-400">{metrics.riverLevel.threshold}m</div>
                <div className="text-xs text-muted-foreground">Critical Level</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">
                  {(metrics.riverLevel.threshold - metrics.riverLevel.current).toFixed(1)}m
                </div>
                <div className="text-xs text-muted-foreground">Until Critical</div>
              </div>
            </div>

            {/* Chart */}
            <DetailedChart
              data={mockRiverLevelHourly}
              maxValue={25}
              unit="m"
              colorFn={getRiverLevelColor}
              showThreshold
              threshold={metrics.riverLevel.threshold}
              thresholdLabel="Critical Level"
            />

            {/* Status Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-cyan-500" /> Normal
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500" /> Watch
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500" /> Alert
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500" /> Critical
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Risk Forecast Dialog */}
      <Dialog open={activeDialog === "risk"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Risk Forecast Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Timeframe Selector */}
            <div className="flex gap-2">
              {(["24h", "48h", "72h"] as const).map((time) => {
                const risk = mockRiskForecasts.find((r) => r.timeframe === time);
                return (
                  <Button
                    key={time}
                    variant={selectedTimeframe === time ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      selectedTimeframe === time
                        ? "bg-amber-500 hover:bg-amber-600"
                        : ""
                    )}
                    onClick={() => setSelectedTimeframe(time)}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{risk?.floodRisk}%</div>
                      <div className="text-xs opacity-80">{time}</div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Selected Forecast Details */}
            {selectedRisk && (
              <>
                {/* Risk Gauge */}
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Flood Risk Level</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-0",
                        selectedRisk.floodRisk >= 70
                          ? "bg-red-500/20 text-red-400"
                          : selectedRisk.floodRisk >= 40
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-green-500/20 text-green-400"
                      )}
                    >
                      {selectedRisk.floodRisk >= 70
                        ? "HIGH"
                        : selectedRisk.floodRisk >= 40
                        ? "MODERATE"
                        : "LOW"}
                    </Badge>
                  </div>
                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        selectedRisk.floodRisk >= 70
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : selectedRisk.floodRisk >= 40
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-yellow-500"
                      )}
                      style={{ width: `${selectedRisk.floodRisk}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Primary Threat */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <h4 className="font-medium text-amber-400 mb-1">Primary Threat</h4>
                  <p className="text-lg font-bold">{selectedRisk.primaryThreat}</p>
                </div>

                {/* Secondary Threats */}
                <div>
                  <h4 className="font-medium mb-2">Secondary Threats</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRisk.secondaryThreats.map((threat, i) => (
                      <Badge key={i} variant="secondary">
                        {threat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Forecast Details
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedRisk.details}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Confidence:</span>
                    <Progress value={selectedRisk.confidence} className="flex-1 h-2" />
                    <span>{selectedRisk.confidence}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
