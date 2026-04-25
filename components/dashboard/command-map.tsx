"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Map,
  Layers,
  MapPin,
  ThermometerSun,
  Droplets,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapPin as MapPinData, FloodZone, HeatIsland } from "@/lib/mock-data";

interface CommandMapProps {
  pins: MapPinData[];
  floodZones: FloodZone[];
  heatIslands: HeatIsland[];
}

type LayerType = "sos" | "heatmap" | "flood" | "evacuation";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export function CommandMap({ pins, floodZones, heatIslands }: CommandMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>("sos");
  const [showVulnerable, setShowVulnerable] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 5:
        return "bg-red-500 shadow-red-500/50";
      case 4:
        return "bg-orange-500 shadow-orange-500/50";
      case 3:
        return "bg-yellow-500 shadow-yellow-500/50";
      case 2:
        return "bg-blue-500 shadow-blue-500/50";
      default:
        return "bg-green-500 shadow-green-500/50";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500/30 border-red-500";
      case "high":
        return "bg-orange-500/30 border-orange-500";
      case "moderate":
        return "bg-yellow-500/30 border-yellow-500";
      default:
        return "bg-green-500/30 border-green-500";
    }
  };

  const sosPins = pins.filter((pin) => pin.type === "sos");
  const evacPins = pins.filter((pin) => pin.type === "evacuation");

  const zoomPercent = Math.round(zoom * 100);

  return (
    <Card
      className={cn(
        "flex flex-col border-border/50 bg-card/50 backdrop-blur transition-all duration-300",
        isFullscreen
          ? "fixed inset-4 z-50 h-auto"
          : "h-full"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 p-4 pb-3 sm:p-6 sm:pb-3">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <CardTitle className="text-sm sm:text-lg">Command Map</CardTitle>
          <Badge variant="outline" className="ml-1 sm:ml-2 border-green-500/50 text-green-400 text-[10px] sm:text-xs">
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 rounded-md border border-border/50 bg-background/50 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
            >
              <ZoomOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
            <span className="min-w-[40px] text-center text-[10px] sm:text-xs text-muted-foreground">
              {zoomPercent}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
            >
              <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7"
            onClick={handleResetZoom}
            title="Reset zoom"
          >
            <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 hidden sm:flex"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative flex-1 p-0 overflow-hidden">
        {/* Layer Toggle Popover */}
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10">
          <Popover open={layersOpen} onOpenChange={setLayersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className={cn(
                  "gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 shadow-lg",
                  "bg-background/95 backdrop-blur border border-border/50",
                  "hover:bg-background"
                )}
              >
                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Layers</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-48 sm:w-56 p-3"
              sideOffset={8}
            >
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Map Layers
                </p>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant={activeLayer === "sos" ? "default" : "ghost"}
                    size="sm"
                    className="justify-start gap-2 h-8 text-xs"
                    onClick={() => {
                      setActiveLayer("sos");
                      setLayersOpen(false);
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Active SOS Pins
                  </Button>
                  <Button
                    variant={activeLayer === "flood" ? "default" : "ghost"}
                    size="sm"
                    className="justify-start gap-2 h-8 text-xs"
                    onClick={() => {
                      setActiveLayer("flood");
                      setLayersOpen(false);
                    }}
                  >
                    <Droplets className="h-3.5 w-3.5" />
                    Flood Risk Zones
                  </Button>
                  <Button
                    variant={activeLayer === "heatmap" ? "default" : "ghost"}
                    size="sm"
                    className="justify-start gap-2 h-8 text-xs"
                    onClick={() => {
                      setActiveLayer("heatmap");
                      setLayersOpen(false);
                    }}
                  >
                    <ThermometerSun className="h-3.5 w-3.5" />
                    Heat Islands
                  </Button>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vulnerable-pop" className="text-xs cursor-pointer">
                      Show Vulnerable
                    </Label>
                    <Switch
                      id="vulnerable-pop"
                      checked={showVulnerable}
                      onCheckedChange={setShowVulnerable}
                      className="scale-90"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Map Container with Zoom */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-slate-900",
            isFullscreen ? "h-full" : "h-full min-h-[300px] sm:min-h-[400px]"
          )}
        >
          <div
            className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom})`,
            }}
          >
            {/* Simulated map grid */}
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-slate-600"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Simulated road network */}
            <svg className="absolute inset-0 h-full w-full">
              <path
                d="M 0 200 Q 150 180, 300 220 T 600 200"
                fill="none"
                stroke="#334155"
                strokeWidth="3"
              />
              <path
                d="M 200 0 Q 220 150, 180 300 T 220 500"
                fill="none"
                stroke="#334155"
                strokeWidth="3"
              />
              <path
                d="M 400 50 Q 380 200, 420 350 T 380 500"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Marikina River simulation */}
              <path
                d="M 100 0 Q 180 100, 150 200 T 200 400 T 150 600"
                fill="none"
                stroke="#1e40af"
                strokeWidth="8"
                opacity="0.6"
              />
            </svg>

            {/* Flood Zones Overlay */}
            {activeLayer === "flood" && (
              <>
                {floodZones.map((zone, i) => (
                  <div
                    key={zone.id}
                    className={cn(
                      "absolute rounded-full border-2 opacity-40 transition-all",
                      getRiskColor(zone.riskLevel)
                    )}
                    style={{
                      width: `${zone.radius * 80}px`,
                      height: `${zone.radius * 80}px`,
                      left: `${20 + i * 25}%`,
                      top: `${30 + i * 15}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">{zone.name}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Heat Islands Overlay */}
            {activeLayer === "heatmap" && (
              <>
                {heatIslands.map((island, i) => (
                  <div
                    key={island.id}
                    className={cn(
                      "absolute rounded-full transition-all",
                      island.intensity === "extreme"
                        ? "bg-red-500/40"
                        : island.intensity === "high"
                        ? "bg-orange-500/40"
                        : "bg-yellow-500/40"
                    )}
                    style={{
                      width: `${island.radius * 100}px`,
                      height: `${island.radius * 100}px`,
                      left: `${40 + i * 30}%`,
                      top: `${35 + i * 20}%`,
                      transform: "translate(-50%, -50%)",
                      filter: "blur(20px)",
                    }}
                  />
                ))}
                {heatIslands.map((island, i) => (
                  <div
                    key={`label-${island.id}`}
                    className="absolute text-center"
                    style={{
                      left: `${40 + i * 30}%`,
                      top: `${35 + i * 20}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <ThermometerSun className="mx-auto h-5 w-5 text-orange-400" />
                    <span className="mt-1 block text-xs font-medium text-foreground">
                      {island.name}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* SOS Pins */}
            {activeLayer === "sos" && (
              <>
                {sosPins.map((pin, i) => (
                  <div
                    key={pin.id}
                    className="absolute cursor-pointer transition-transform hover:scale-110"
                    style={{
                      left: `${15 + i * 18}%`,
                      top: `${25 + (i % 3) * 20}%`,
                    }}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full shadow-lg",
                        getSeverityColor(pin.severity || 1),
                        pin.severity === 5 && "animate-pulse"
                      )}
                    >
                      <span className="text-xs font-bold text-white">{pin.severity}</span>
                    </div>
                    <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-background/90 px-2 py-1 text-xs">
                      {pin.label}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Evacuation Centers */}
            {evacPins.map((pin, i) => (
              <div
                key={pin.id}
                className="absolute"
                style={{
                  left: `${60 + i * 15}%`,
                  top: `${50 + i * 10}%`,
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 shadow-lg shadow-green-500/30">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-background/90 px-2 py-1 text-xs">
                  {pin.label}
                </div>
              </div>
            ))}
          </div>

          {/* Location Labels - Fixed position outside zoom */}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-lg bg-background/90 px-2 py-1.5 sm:px-3 sm:py-2 backdrop-blur border border-border/30">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Metro Manila</p>
            <p className="text-xs sm:text-sm font-medium">Marikina - Pasig - QC</p>
          </div>

          {/* Legend - Fixed position outside zoom */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 rounded-lg bg-background/90 px-2 py-1.5 sm:px-3 sm:py-2 backdrop-blur border border-border/30">
            <p className="mb-1 text-[10px] sm:text-xs font-medium">SOS Level</p>
            <div className="flex gap-1.5 sm:gap-2">
              {[5, 4, 3, 2, 1].map((level) => (
                <div key={level} className="flex items-center gap-0.5">
                  <div
                    className={cn("h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full", getSeverityColor(level))}
                  />
                  <span className="text-[9px] sm:text-[10px]">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
