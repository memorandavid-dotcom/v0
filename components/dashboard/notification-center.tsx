"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  Siren,
  Brain,
  Users,
  Newspaper,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronRight,
  Phone,
  CloudRain,
  Flame,
  Mountain,
  Waves,
  MessageSquare,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AlertItem,
  SOSAlert,
  PredictiveWarning,
  FamilyMessage,
  NewsItem,
} from "@/lib/mock-data";

interface NotificationCenterProps {
  alerts: AlertItem[];
  familyMessages: FamilyMessage[];
  newsItems: NewsItem[];
}

interface UnifiedNotification {
  id: string;
  type: "sos" | "predictive" | "family" | "news";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "critical" | "high" | "medium" | "low";
  icon: React.ReactNode;
  data: SOSAlert | PredictiveWarning | FamilyMessage | NewsItem;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: UnifiedNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const priorityStyles = {
    critical: "border-l-red-500 bg-red-500/5",
    high: "border-l-orange-500 bg-orange-500/5",
    medium: "border-l-yellow-500 bg-yellow-500/5",
    low: "border-l-blue-500 bg-blue-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "relative border-l-4 rounded-lg p-3 transition-all hover:bg-muted/50",
        priorityStyles[notification.priority],
        !notification.isRead && "bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            notification.priority === "critical"
              ? "bg-red-500/20 text-red-400"
              : notification.priority === "high"
              ? "bg-orange-500/20 text-orange-400"
              : notification.priority === "medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-blue-500/20 text-blue-400"
          )}
        >
          {notification.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className={cn("text-sm font-medium", !notification.isRead && "font-semibold")}>
                {notification.title}
              </p>
              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
              onClick={() => onDismiss(notification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(notification.timestamp)}
            </span>
            <Badge variant="outline" className="text-[10px] h-5 px-1.5">
              {notification.type.toUpperCase()}
            </Badge>
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[10px] px-2"
                onClick={() => onMarkRead(notification.id)}
              >
                Mark read
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationCenter({
  alerts,
  familyMessages,
  newsItems,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

  // Transform all data into unified notifications
  const notifications: UnifiedNotification[] = [
    // SOS Alerts
    ...alerts
      .filter((a) => a.type === "sos")
      .map((alert) => {
        const sos = alert as SOSAlert;
        return {
          id: `sos-${sos.id}`,
          type: "sos" as const,
          title: `SOS Alert - Level ${sos.urgencyLevel}`,
          message: `${sos.message} - ${sos.location}, ${sos.barangay}`,
          timestamp: sos.timestamp,
          isRead: readNotifications.has(`sos-${sos.id}`),
          priority: sos.urgencyLevel >= 4 ? "critical" as const : "high" as const,
          icon: <Siren className="h-4 w-4" />,
          data: sos,
        };
      }),
    // Predictive Warnings
    ...alerts
      .filter((a) => a.type === "predictive")
      .map((alert) => {
        const warning = alert as PredictiveWarning;
        const getIcon = () => {
          switch (warning.warningType) {
            case "flood":
              return <CloudRain className="h-4 w-4" />;
            case "heatstroke":
              return <Flame className="h-4 w-4" />;
            case "landslide":
              return <Mountain className="h-4 w-4" />;
            case "storm_surge":
              return <Waves className="h-4 w-4" />;
            default:
              return <AlertTriangle className="h-4 w-4" />;
          }
        };
        return {
          id: `pred-${warning.id}`,
          type: "predictive" as const,
          title: `AI Warning: ${warning.warningType.replace("_", " ")}`,
          message: `${warning.message} - ${warning.affectedArea}`,
          timestamp: warning.timestamp,
          isRead: readNotifications.has(`pred-${warning.id}`),
          priority: warning.riskPercentage >= 70 ? "high" as const : "medium" as const,
          icon: getIcon(),
          data: warning,
        };
      }),
    // Family Messages
    ...familyMessages.map((msg) => ({
      id: `fam-${msg.id}`,
      type: "family" as const,
      title: `${msg.senderName}`,
      message: msg.content,
      timestamp: msg.timestamp,
      isRead: msg.isRead || readNotifications.has(`fam-${msg.id}`),
      priority: msg.type === "emergency" ? "critical" as const : "low" as const,
      icon: msg.type === "emergency" ? <AlertTriangle className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />,
      data: msg,
    })),
    // Breaking News
    ...newsItems
      .filter((n) => n.isBreaking || n.severity === "critical")
      .map((news) => ({
        id: `news-${news.id}`,
        type: "news" as const,
        title: news.title,
        message: news.summary,
        timestamp: news.timestamp,
        isRead: readNotifications.has(`news-${news.id}`),
        priority: news.severity === "critical" ? "high" as const : "medium" as const,
        icon: <Newspaper className="h-4 w-4" />,
        data: news,
      })),
  ]
    .filter((n) => !dismissedNotifications.has(n.id))
    .sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const sosCount = notifications.filter((n) => n.type === "sos").length;
  const predictiveCount = notifications.filter((n) => n.type === "predictive").length;
  const familyCount = notifications.filter((n) => n.type === "family" && !n.isRead).length;
  const newsCount = notifications.filter((n) => n.type === "news").length;

  const handleMarkRead = (id: string) => {
    setReadNotifications((prev) => new Set([...prev, id]));
  };

  const handleDismiss = (id: string) => {
    setDismissedNotifications((prev) => new Set([...prev, id]));
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(new Set(allIds));
  };

  const handleClearAll = () => {
    const allIds = notifications.map((n) => n.id);
    setDismissedNotifications(new Set(allIds));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white",
                notifications.some((n) => n.priority === "critical" && !n.isRead)
                  ? "bg-red-500 animate-pulse"
                  : "bg-primary"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base">Notifications</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread alerts
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted-foreground"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Clear all
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-border/50">
            <TabsList className="w-full grid grid-cols-5 h-9">
              <TabsTrigger value="all" className="text-xs gap-1 px-2">
                All
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sos" className="text-xs gap-1 px-2">
                <Siren className="h-3 w-3" />
                {sosCount > 0 && (
                  <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                    {sosCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="predictive" className="text-xs gap-1 px-2">
                <Brain className="h-3 w-3" />
                {predictiveCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {predictiveCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="family" className="text-xs gap-1 px-2">
                <Users className="h-3 w-3" />
                {familyCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {familyCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs gap-1 px-2">
                <Newspaper className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value={activeTab} className="mt-0 h-full">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Bell className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">No notifications</p>
                  <p className="text-xs">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={handleMarkRead}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Quick Actions Footer */}
        <div className="border-t border-border/50 p-3 bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Phone className="h-3.5 w-3.5" />
              Emergency Call
            </Button>
            <Button variant="default" size="sm" className="gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Find Shelter
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
