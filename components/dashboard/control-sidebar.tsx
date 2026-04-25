"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Radio,
  Users,
  Baby,
  Accessibility,
  PersonStanding,
  FileDown,
  ExternalLink,
  Megaphone,
  Send,
  CheckCircle2,
  Loader2,
  Settings,
  Sun,
  Moon,
  Contrast,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlSidebarProps {
  onHighContrastToggle: (enabled: boolean) => void;
  highContrastEnabled: boolean;
}

export function ControlSidebar({
  onHighContrastToggle,
  highContrastEnabled,
}: ControlSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [vulnerabilityFilters, setVulnerabilityFilters] = useState({
    elderly: false,
    infants: false,
    pwds: false,
  });
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isDarkMode = theme === "dark";

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setIsBroadcasting(true);
    // Simulate API call
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
      setTimeout(() => {
        setBroadcastSent(false);
        setBroadcastMessage("");
        setDialogOpen(false);
      }, 2000);
    }, 2000);
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  const activeFiltersCount = Object.values(vulnerabilityFilters).filter(Boolean).length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Disaster Control */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Disaster Control</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Global Broadcast */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2" variant="destructive">
                <Megaphone className="h-4 w-4" />
                Global Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Global Emergency Broadcast
                </DialogTitle>
                <DialogDescription>
                  Send a mass notification via ChatSDK (Messenger/Telegram) to all
                  registered residents in affected areas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Messenger
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Send className="h-3 w-3" />
                    Telegram
                  </Badge>
                  <Badge variant="secondary">12,456 recipients</Badge>
                </div>
                <Textarea
                  placeholder="Type your emergency broadcast message..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> This message will be sent to all
                    registered residents in the currently affected zones. Use
                    responsibly for genuine emergencies only.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage.trim() || isBroadcasting || broadcastSent}
                  className="gap-2"
                >
                  {broadcastSent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Sent!
                    </>
                  ) : isBroadcasting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Broadcast
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Data Export */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Export to Master Map
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Syncs to Airtable/Google Sheets</span>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerability Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Vulnerability Filter</CardTitle>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Highlight households on the map with vulnerable members
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="elderly"
                className="flex cursor-pointer items-center gap-2"
              >
                <PersonStanding className="h-4 w-4 text-muted-foreground" />
                <span>Elderly (60+)</span>
              </Label>
              <Switch
                id="elderly"
                checked={vulnerabilityFilters.elderly}
                onCheckedChange={(checked) =>
                  setVulnerabilityFilters((prev) => ({ ...prev, elderly: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="infants"
                className="flex cursor-pointer items-center gap-2"
              >
                <Baby className="h-4 w-4 text-muted-foreground" />
                <span>Infants (0-2 yrs)</span>
              </Label>
              <Switch
                id="infants"
                checked={vulnerabilityFilters.infants}
                onCheckedChange={(checked) =>
                  setVulnerabilityFilters((prev) => ({ ...prev, infants: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="pwds"
                className="flex cursor-pointer items-center gap-2"
              >
                <Accessibility className="h-4 w-4 text-muted-foreground" />
                <span>PWDs</span>
              </Label>
              <Switch
                id="pwds"
                checked={vulnerabilityFilters.pwds}
                onCheckedChange={(checked) =>
                  setVulnerabilityFilters((prev) => ({ ...prev, pwds: checked }))
                }
              />
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-xs text-primary">
                Showing {activeFiltersCount} vulnerability layer(s) on map
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Display Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <Label
              htmlFor="dark-mode"
              className="flex cursor-pointer items-center gap-2"
            >
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <span>Dark Mode</span>
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <Label
              htmlFor="high-contrast"
              className="flex cursor-pointer items-center gap-2"
            >
              <Contrast className="h-4 w-4 text-muted-foreground" />
              <span>High Contrast</span>
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrastEnabled}
              onCheckedChange={onHighContrastToggle}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enhanced visibility for field operations
          </p>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="mt-auto border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-400">5</p>
              <p className="text-xs text-muted-foreground">Pending SOS</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">3</p>
              <p className="text-xs text-muted-foreground">Teams Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">2</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">4</p>
              <p className="text-xs text-muted-foreground">AI Warnings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
