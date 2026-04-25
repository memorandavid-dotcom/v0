"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
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
  Locate,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapPin as MapPinData, FloodZone, HeatIsland } from "@/lib/mock-data";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const useMap = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMap),
  { ssr: false }
) as any;

interface CommandMapProps {
  pins: MapPinData[];
  floodZones: FloodZone[];
  heatIslands: HeatIsland[];
}

type LayerType = "sos" | "heatmap" | "flood" | "all";

// Metro Manila center coordinates
const METRO_MANILA_CENTER: [number, number] = [14.6091, 121.0223];
const DEFAULT_ZOOM = 12;

// Custom hook component to control map
function MapController({ 
  zoom, 
  center,
  onZoomChange 
}: { 
  zoom: number; 
  center: [number, number];
  onZoomChange: (zoom: number) => void;
}) {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-leaflet").then(({ useMap }) => {
        // This is handled differently in the component
      });
    }
  }, []);

  return null;
}

export function CommandMap({ pins, floodZones, heatIslands }: CommandMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>("all");
  const [showVulnerable, setShowVulnerable] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    setMapReady(true);
    // Import Leaflet CSS
    import("leaflet/dist/leaflet.css");
  }, []);

  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomIn();
      setZoom(mapInstance.getZoom() + 1);
    }
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomOut();
      setZoom(mapInstance.getZoom() - 1);
    }
  }, [mapInstance]);

  const handleResetView = useCallback(() => {
    if (mapInstance) {
      mapInstance.setView(METRO_MANILA_CENTER, DEFAULT_ZOOM);
      setZoom(DEFAULT_ZOOM);
    }
  }, [mapInstance]);

  const handleLocate = useCallback(() => {
    if (mapInstance) {
      mapInstance.locate({ setView: true, maxZoom: 16 });
    }
  }, [mapInstance]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const getSeverityColor = (severity: number): string => {
    switch (severity) {
      case 5: return "#ef4444"; // red-500
      case 4: return "#f97316"; // orange-500
      case 3: return "#eab308"; // yellow-500
      case 2: return "#3b82f6"; // blue-500
      default: return "#22c55e"; // green-500
    }
  };

  const getRiskColor = (level: string): { fill: string; stroke: string } => {
    switch (level) {
      case "critical": return { fill: "#ef444480", stroke: "#ef4444" };
      case "high": return { fill: "#f9731680", stroke: "#f97316" };
      case "moderate": return { fill: "#eab30880", stroke: "#eab308" };
      default: return { fill: "#22c55e80", stroke: "#22c55e" };
    }
  };

  const getHeatColor = (intensity: string): { fill: string; stroke: string } => {
    switch (intensity) {
      case "extreme": return { fill: "#ef444460", stroke: "#ef4444" };
      case "high": return { fill: "#f9731660", stroke: "#f97316" };
      default: return { fill: "#eab30860", stroke: "#eab308" };
    }
  };

  const sosPins = pins.filter((pin) => pin.type === "sos");
  const evacPins = pins.filter((pin) => pin.type === "evacuation");

  return (
    <Card
      className={cn(
        "flex flex-col border-border/50 bg-card/50 backdrop-blur transition-all duration-300",
        isFullscreen ? "fixed inset-4 z-50 h-auto" : "h-full"
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
            >
              <ZoomOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
            <span className="min-w-[36px] text-center text-[10px] sm:text-xs text-muted-foreground">
              {zoom}x
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7"
            onClick={handleResetView}
            title="Reset view"
          >
            <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7"
            onClick={handleLocate}
            title="My location"
          >
            <Locate className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-[1000]">
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
              className="w-48 sm:w-56 p-3 z-[1001]"
              sideOffset={8}
            >
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Map Layers
                </p>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant={activeLayer === "all" ? "default" : "ghost"}
                    size="sm"
                    className="justify-start gap-2 h-8 text-xs"
                    onClick={() => {
                      setActiveLayer("all");
                      setLayersOpen(false);
                    }}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Show All Layers
                  </Button>
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

        {/* Map Container */}
        <div
          className={cn(
            "relative w-full",
            isFullscreen ? "h-full" : "h-full min-h-[300px] sm:min-h-[400px]"
          )}
        >
          {mapReady && (
            <MapContainerWrapper
              center={METRO_MANILA_CENTER}
              zoom={zoom}
              onMapReady={setMapInstance}
              onZoomChange={setZoom}
              activeLayer={activeLayer}
              sosPins={sosPins}
              evacPins={evacPins}
              floodZones={floodZones}
              heatIslands={heatIslands}
              getSeverityColor={getSeverityColor}
              getRiskColor={getRiskColor}
              getHeatColor={getHeatColor}
            />
          )}
        </div>

        {/* Legend - Fixed position */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-[1000] rounded-lg bg-background/95 px-2 py-1.5 sm:px-3 sm:py-2 backdrop-blur border border-border/30">
          <p className="mb-1 text-[10px] sm:text-xs font-medium">SOS Level</p>
          <div className="flex gap-1.5 sm:gap-2">
            {[5, 4, 3, 2, 1].map((level) => (
              <div key={level} className="flex items-center gap-0.5">
                <div
                  className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full"
                  style={{ backgroundColor: getSeverityColor(level) }}
                />
                <span className="text-[9px] sm:text-[10px]">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Label */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-[1000] rounded-lg bg-background/95 px-2 py-1.5 sm:px-3 sm:py-2 backdrop-blur border border-border/30">
          <p className="text-[10px] sm:text-xs text-muted-foreground">Metro Manila</p>
          <p className="text-xs sm:text-sm font-medium">Marikina - Pasig - QC</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Separate component to handle map rendering
function MapContainerWrapper({
  center,
  zoom,
  onMapReady,
  onZoomChange,
  activeLayer,
  sosPins,
  evacPins,
  floodZones,
  heatIslands,
  getSeverityColor,
  getRiskColor,
  getHeatColor,
}: {
  center: [number, number];
  zoom: number;
  onMapReady: (map: any) => void;
  onZoomChange: (zoom: number) => void;
  activeLayer: LayerType;
  sosPins: MapPinData[];
  evacPins: MapPinData[];
  floodZones: FloodZone[];
  heatIslands: HeatIsland[];
  getSeverityColor: (severity: number) => string;
  getRiskColor: (level: string) => { fill: string; stroke: string };
  getHeatColor: (intensity: string) => { fill: string; stroke: string };
}) {
  const [leaflet, setLeaflet] = useState<any>(null);
  const [icons, setIcons] = useState<any>(null);

  useEffect(() => {
    // Import Leaflet and create custom icons
    import("leaflet").then((L) => {
      // Fix default marker icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      setLeaflet(L);

      // Create custom icons
      const createSosIcon = (severity: number) => {
        const color = severity === 5 ? "#ef4444" : severity === 4 ? "#f97316" : severity === 3 ? "#eab308" : severity === 2 ? "#3b82f6" : "#22c55e";
        return L.divIcon({
          className: "custom-sos-marker",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: ${color};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 2px 8px ${color}80;
              border: 2px solid white;
              ${severity === 5 ? 'animation: pulse 1s infinite;' : ''}
            ">
              ${severity}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });
      };

      const evacIcon = L.divIcon({
        className: "custom-evac-marker",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #22c55e;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 2px 8px #22c55e80;
            border: 2px solid white;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      setIcons({ createSosIcon, evacIcon });
    });
  }, []);

  if (!leaflet || !icons) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="text-muted-foreground text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import "leaflet/dist/leaflet.css";
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .leaflet-container {
          height: 100%;
          width: 100%;
          background: #1e293b;
        }
        
        .leaflet-popup-content-wrapper {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border-radius: 8px;
        }
        
        .leaflet-popup-tip {
          background: hsl(var(--background));
        }
        
        .custom-sos-marker, .custom-evac-marker {
          background: transparent;
          border: none;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={(map: any) => {
          if (map) {
            onMapReady(map);
            map.on("zoomend", () => {
              onZoomChange(map.getZoom());
            });
          }
        }}
        zoomControl={false}
      >
        {/* Dark themed tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Flood Zones */}
        {(activeLayer === "flood" || activeLayer === "all") &&
          floodZones.map((zone) => {
            const colors = getRiskColor(zone.riskLevel);
            return (
              <Circle
                key={zone.id}
                center={[zone.coordinates.lat, zone.coordinates.lng]}
                radius={zone.radius * 1000}
                pathOptions={{
                  fillColor: colors.fill,
                  fillOpacity: 0.4,
                  color: colors.stroke,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-1">
                    <p className="font-semibold">{zone.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Risk Level: {zone.riskLevel}
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* Heat Islands */}
        {(activeLayer === "heatmap" || activeLayer === "all") &&
          heatIslands.map((island) => {
            const colors = getHeatColor(island.intensity);
            return (
              <Circle
                key={island.id}
                center={[island.coordinates.lat, island.coordinates.lng]}
                radius={island.radius * 1000}
                pathOptions={{
                  fillColor: colors.fill,
                  fillOpacity: 0.5,
                  color: colors.stroke,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-1">
                    <p className="font-semibold">{island.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Intensity: {island.intensity}
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* SOS Pins */}
        {(activeLayer === "sos" || activeLayer === "all") &&
          sosPins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.coordinates.lat, pin.coordinates.lng]}
              icon={icons.createSosIcon(pin.severity || 1)}
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getSeverityColor(pin.severity || 1) }}
                    />
                    <span className="font-semibold text-sm">SOS Level {pin.severity}</span>
                  </div>
                  <p className="text-sm">{pin.label}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Evacuation Centers */}
        {evacPins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.coordinates.lat, pin.coordinates.lng]}
            icon={icons.evacIcon}
          >
            <Popup>
              <div className="p-1">
                <p className="font-semibold text-green-600">{pin.label}</p>
                <p className="text-sm text-muted-foreground">Evacuation Center</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
