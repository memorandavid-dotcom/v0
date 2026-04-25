"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MessageSquare,
  Send,
  MapPin,
  AlertTriangle,
  Clock,
  ChevronRight,
  Users,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FamilyMessage, FamilyMember } from "@/lib/mock-data";

interface FamilyMessagingProps {
  messages: FamilyMessage[];
  members: FamilyMember[];
  onSendMessage?: (content: string) => void;
  onNewMessage?: (message: FamilyMessage) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function getMessageStyle(type: FamilyMessage["type"]) {
  switch (type) {
    case "emergency":
      return "bg-red-500/10 border-red-500/30 border";
    case "location":
      return "bg-blue-500/10 border-blue-500/30 border";
    case "status":
      return "bg-green-500/10 border-green-500/30 border";
    default:
      return "bg-muted/50";
  }
}

function MessageBubble({ message, isCurrentUser = false }: { message: FamilyMessage; isCurrentUser?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
          <AvatarFallback className="text-xs bg-primary/20 text-primary">
            {message.senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[75%]", isCurrentUser && "text-right")}>
        {!isCurrentUser && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 px-1">
            {message.senderName}
          </p>
        )}
        <div
          className={cn(
            "rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : cn(getMessageStyle(message.type), "rounded-tl-sm")
          )}
        >
          {message.type === "emergency" && !isCurrentUser && (
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-[10px] font-medium text-red-400">EMERGENCY</span>
            </div>
          )}
          {message.type === "location" && message.location && (
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-blue-400" />
              <span className="text-[10px] text-blue-400">Shared location</span>
            </div>
          )}
          <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
        </div>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 px-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

export function FamilyMessaging({
  messages,
  members,
  onSendMessage,
}: FamilyMessagingProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const emergencyMessages = messages.filter((m) => m.type === "emergency" && !m.isRead);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage?.(newMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Preview card for the dashboard
  const MessagePreviewCard = () => (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Messages
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
        {/* Emergency Alert */}
        <AnimatePresence>
          {emergencyMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 p-2 border border-red-500/30"
            >
              <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
              <span className="text-xs text-red-400">
                {emergencyMessages.length} emergency message{emergencyMessages.length > 1 ? "s" : ""}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Messages Preview */}
        <div className="space-y-2">
          {messages.slice(0, 3).map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-2 rounded-lg p-2 transition-colors",
                !msg.isRead && "bg-primary/5"
              )}
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-[10px] bg-muted">
                  {msg.senderName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">{msg.senderName}</span>
                  {msg.type === "emergency" && (
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                  )}
                  {!msg.isRead && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {msg.content}
                </p>
              </div>
              <span className="text-[9px] text-muted-foreground shrink-0">
                {formatTimeSince(msg.timestamp)}
              </span>
            </div>
          ))}
        </div>

        {/* Open Chat Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2 h-9 text-xs sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Open Family Chat
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-auto" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 flex flex-col"
          >
            <SheetHeader className="p-4 border-b border-border/50 shrink-0">
              <SheetTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                Family Group Chat
                <Badge variant="secondary" className="ml-auto text-xs">
                  {members.length} members
                </Badge>
              </SheetTitle>
            </SheetHeader>

            {/* Online Members */}
            <div className="px-4 py-2 border-b border-border/50 shrink-0">
              <div className="flex gap-2 overflow-x-auto scrollbar-hidden py-1">
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col items-center shrink-0">
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-muted">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                          member.status === "safe" && "bg-green-500",
                          member.status === "at_risk" && "bg-red-500 animate-pulse",
                          member.status === "offline" && "bg-orange-500"
                        )}
                      />
                    </div>
                    <span className="text-[9px] mt-1 text-muted-foreground truncate max-w-[50px]">
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isCurrentUser={msg.senderId === "me"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-border/50 shrink-0 bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-10 text-sm"
                />
                <Button
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Messages are sent via SMS if family members are offline
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );

  return <MessagePreviewCard />;
}

// Export a component for relay feed notifications
export function FamilyMessageNotification({ message }: { message: FamilyMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "border-l-4 transition-all hover:shadow-lg",
          message.type === "emergency"
            ? "border-red-500 bg-red-500/10"
            : "border-blue-500 bg-blue-500/10"
        )}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {message.senderName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{message.senderName}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    message.type === "emergency"
                      ? "border-red-500/50 text-red-400"
                      : "border-blue-500/50 text-blue-400"
                  )}
                >
                  <Bell className="h-2.5 w-2.5 mr-1" />
                  Family Message
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-foreground line-clamp-2">
                {message.content}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[10px] sm:text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeSince(message.timestamp)}</span>
                {message.type === "location" && message.location && (
                  <>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>{message.location.address}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
