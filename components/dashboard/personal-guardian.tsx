"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  TrendingDown,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonalWeather, TravelRisk, ForecastDay } from "@/lib/mock-data";

interface PersonalGuardianProps {
  weather: PersonalWeather;
  travelRisk: TravelRisk;
  forecast: ForecastDay[];
}

function getConditionIcon(condition: ForecastDay["condition"]) {
  switch (condition) {
    case "sunny":
      return <Sun className="h-4 w-4 text-yellow-400" />;
    case "cloudy":
      return <Cloud className="h-4 w-4 text-muted-foreground" />;
    case "rainy":
      return <CloudRain className="h-4 w-4 text-blue-400" />;
    case "stormy":
      return <CloudLightning className="h-4 w-4 text-red-400" />;
    default:
      return <Sun className="h-4 w-4" />;
  }
}

function getHeatIndexColor(index: number): string {
  if (index < 27) return "text-green-400";
  if (index < 32) return "text-yellow-400";
  if (index < 41) return "text-orange-400";
  return "text-red-400";
}

function getHeatIndexStatus(index: number): string {
  if (index < 27) return "Normal";
  if (index < 32) return "Caution";
  if (index < 41) return "Extreme Caution";
  if (index < 54) return "Danger";
  return "Extreme Danger";
}

export function PersonalGuardian({ weather, travelRisk, forecast }: PersonalGuardianProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span>Personal Guardian</span>
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "gap-1",
              travelRisk.isMoving
                ? "border-blue-500/50 text-blue-400"
                : "border-green-500/50 text-green-400"
            )}
          >
            {travelRisk.isMoving ? "Moving" : "Stable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        {/* Current Location */}
        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Current Location</p>
          <p className="font-medium">{travelRisk.currentLocation}</p>
          {travelRisk.isMoving && (
            <p className="mt-1 text-xs">
              Destination Risk:{" "}
              <span
                className={cn(
                  "font-medium",
                  travelRisk.destinationRisk === "low" && "text-green-400",
                  travelRisk.destinationRisk === "moderate" && "text-yellow-400",
                  travelRisk.destinationRisk === "high" && "text-red-400"
                )}
              >
                {travelRisk.destinationRisk.charAt(0).toUpperCase() + travelRisk.destinationRisk.slice(1)}
              </span>
            </p>
          )}
        </div>

        {/* Weather Widget */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2 sm:p-3">
            <Thermometer className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            <span className="text-sm sm:text-lg font-bold">{weather.temperature}°C</span>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground">Temp</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2 sm:p-3">
            <Droplets className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            <span className="text-sm sm:text-lg font-bold">{weather.humidity}%</span>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground">Humidity</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2 sm:p-3">
            <Wind className={cn("mb-1 h-4 w-4 sm:h-5 sm:w-5", getHeatIndexColor(weather.heatIndex))} />
            <span className={cn("text-sm sm:text-lg font-bold", getHeatIndexColor(weather.heatIndex))}>
              {weather.heatIndex}°C
            </span>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground">Heat Idx</span>
          </div>
        </div>

        {/* Heat Index Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Heat Index Status</span>
            <span className={cn("font-medium", getHeatIndexColor(weather.heatIndex))}>
              {getHeatIndexStatus(weather.heatIndex)}
            </span>
          </div>
          <Progress
            value={Math.min((weather.heatIndex / 54) * 100, 100)}
            className="h-2"
          />
        </div>

        {/* Pressure Status */}
        <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 p-3">
          <TrendingDown className="h-4 w-4 text-orange-400" />
          <span className="text-sm text-orange-400">{weather.pressureStatus}</span>
        </div>

        {/* 3-Day Forecast */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">3-Day Forecast</h4>
          <div className="grid grid-cols-3 gap-2">
            {forecast.map((day) => (
              <div
                key={day.day}
                className="flex flex-col items-center rounded-lg bg-muted/30 p-2"
              >
                <span className="text-[10px] font-medium">{day.day}</span>
                {getConditionIcon(day.condition)}
                <span className="mt-1 text-xs">
                  {day.high}° / {day.low}°
                </span>
                <span className="text-[10px] text-blue-400">{day.rainChance}%</span>
                {day.warning && (
                  <AlertTriangle className="mt-1 h-3 w-3 text-orange-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
