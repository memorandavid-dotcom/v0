"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  Navigation,
  Users,
  Wifi,
  Utensils,
  Heart,
  PawPrint,
  Zap,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvacuationCenter } from "@/lib/mock-data";

interface EvacuationToolProps {
  centers: EvacuationCenter[];
}

function getCapacityStatus(current: number, max: number) {
  const percentage = (current / max) * 100;
  if (percentage < 50) return { label: "Available", color: "text-green-400", bgColor: "bg-green-500" };
  if (percentage < 80) return { label: "Filling Up", color: "text-yellow-400", bgColor: "bg-yellow-500" };
  return { label: "Near Full", color: "text-red-400", bgColor: "bg-red-500" };
}

function getAmenityIcon(amenity: string) {
  if (amenity.includes("Medical")) return <Heart className="h-3 w-3" />;
  if (amenity.includes("Food")) return <Utensils className="h-3 w-3" />;
  if (amenity.includes("WiFi")) return <Wifi className="h-3 w-3" />;
  if (amenity.includes("Pet")) return <PawPrint className="h-3 w-3" />;
  if (amenity.includes("Charging")) return <Zap className="h-3 w-3" />;
  return <CheckCircle2 className="h-3 w-3" />;
}

export function EvacuationTool({ centers }: EvacuationToolProps) {
  const [navigating, setNavigating] = useState<string | null>(null);
  const [lguNotified, setLguNotified] = useState(false);

  const handleNavigate = (centerId: string) => {
    setNavigating(centerId);
    // Simulate navigation start and LGU notification
    setTimeout(() => {
      setLguNotified(true);
    }, 1500);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Safe Evacuation
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "gap-1 text-xs",
              lguNotified
                ? "border-green-500/50 text-green-400"
                : "border-muted text-muted-foreground"
            )}
          >
            <Shield className="h-3 w-3" />
            {lguNotified ? "LGU Notified" : "LGU Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        <p className="text-xs text-muted-foreground">
          Nearest evacuation centers sorted by distance. Routes avoid flood-prone streets.
        </p>

        {/* Evacuation Centers List */}
        <div className="space-y-3">
          {centers.slice(0, 3).map((center, index) => {
            const capacityStatus = getCapacityStatus(center.currentCapacity, center.maxCapacity);
            const capacityPercentage = (center.currentCapacity / center.maxCapacity) * 100;
            const isNavigating = navigating === center.id;

            return (
              <div
                key={center.id}
                className={cn(
                  "rounded-lg border border-border/50 p-3 space-y-3 transition-colors",
                  isNavigating && "border-primary/50 bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{center.name}</h4>
                      <p className="text-xs text-muted-foreground">{center.address}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {center.distance} km
                  </Badge>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <Users className="inline h-3 w-3 mr-1" />
                      {center.currentCapacity}/{center.maxCapacity}
                    </span>
                    <span className={capacityStatus.color}>{capacityStatus.label}</span>
                  </div>
                  <Progress value={capacityPercentage} className="h-1.5" />
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1">
                  {center.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="gap-1 text-[10px] px-1.5 py-0"
                    >
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>

                {/* Navigate Button */}
                <Button
                  variant={isNavigating ? "secondary" : "default"}
                  className="w-full gap-2"
                  onClick={() => handleNavigate(center.id)}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Navigating...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4" />
                      Navigate (Safe Route)
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* LGU Sync Status */}
        {lguNotified && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 border border-green-500/30">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">
              LGU has been notified of your evacuation status
            </span>
          </div>
        )}

        <Button variant="outline" className="w-full gap-2" asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View All Evacuation Centers
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
