"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/dashboard/header";
import { GuardianCards } from "@/components/dashboard/guardian-cards";
import { CommandMap } from "@/components/dashboard/command-map";
import { RelayFeed } from "@/components/dashboard/relay-feed";
import { ControlSidebar } from "@/components/dashboard/control-sidebar";
import { PersonalGuardian } from "@/components/dashboard/personal-guardian";
import { FamilyCircle } from "@/components/dashboard/family-circle";
import { FamilyMessaging } from "@/components/dashboard/family-messaging";
import { EvacuationTool } from "@/components/dashboard/evacuation-tool";
import { CriticalAlert } from "@/components/dashboard/critical-alert";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { RecoveryDashboard } from "@/components/dashboard/recovery-dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PanelRight,
  Map,
  Users,
  AlertTriangle,
  Home,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import {
  mockEnvironmentalMetrics,
  mockAlerts,
  mockRescueTeams,
  mockMapPins,
  mockFloodZones,
  mockHeatIslands,
  mockFamilyMembers,
  mockEvacuationCenters,
  mockPersonalWeather,
  mockTravelRisk,
  mock3DayForecast,
  mockNewsItems,
  mockDamageReports,
  mockRecoveryProgress,
  mockBayanihanItems,
  mockFamilyMessages,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const [highContrast, setHighContrast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);

  const handleEmergencyPing = () => {
    console.log("Emergency ping sent to all family members");
  };

  const triggerCriticalAlert = () => {
    setShowCriticalAlert(true);
  };

  return (
    <div
      className={cn(
        "min-h-screen overflow-x-hidden",
        highContrast && "high-contrast"
      )}
    >
      <Header
        onMenuToggle={() => setSidebarOpen(true)}
        alerts={mockAlerts}
        familyMessages={mockFamilyMessages}
        newsItems={mockNewsItems}
      />

      <main className="px-4 py-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Guardian Cards - Top Bar */}
        <section className="mb-5 sm:mb-6">
          <GuardianCards metrics={mockEnvironmentalMetrics} />
        </section>

        {/* Main Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-5 sm:space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Scrollable Tabs on Mobile - Cleaner layout */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex w-auto gap-1 sm:gap-0 sm:grid sm:w-full sm:max-w-xl sm:grid-cols-6 h-10 sm:h-11 p-1">
                <TabsTrigger value="map" className="gap-2 px-4 sm:px-3 text-xs sm:text-sm rounded-md">
                  <Map className="h-4 w-4" />
                  <span>Map</span>
                </TabsTrigger>
                <TabsTrigger value="news" className="gap-2 px-4 sm:px-3 text-xs sm:text-sm rounded-md">
                  <Newspaper className="h-4 w-4" />
                  <span>News</span>
                </TabsTrigger>
                <TabsTrigger value="family" className="gap-2 px-4 sm:px-3 text-xs sm:text-sm rounded-md">
                  <Users className="h-4 w-4" />
                  <span>Family</span>
                </TabsTrigger>
                <TabsTrigger value="evacuate" className="gap-2 px-4 sm:px-3 text-xs sm:text-sm rounded-md">
                  <Home className="h-4 w-4" />
                  <span>Shelter</span>
                </TabsTrigger>
                <TabsTrigger value="recovery" className="gap-2 px-4 sm:px-3 text-xs sm:text-sm rounded-md">
                  <RefreshCw className="h-4 w-4" />
                  <span>Recovery</span>
                </TabsTrigger>
                <TabsTrigger value="emergency" className="gap-2 px-4 sm:px-3 text-xs sm:text-sm rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  <span>SOS</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Demo Alert Trigger - Hidden on small mobile */}
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 hidden sm:flex"
              onClick={triggerCriticalAlert}
            >
              <AlertTriangle className="h-4 w-4" />
              Demo Alert
            </Button>
          </div>

          {/* Map View Tab */}
          <TabsContent value="map" className="space-y-5 sm:space-y-6 mt-0">
            <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row">
              {/* Command Map - Left Panel */}
              <section className="lg:w-[65%]">
                <CommandMap
                  pins={mockMapPins}
                  floodZones={mockFloodZones}
                  heatIslands={mockHeatIslands}
                />
              </section>

              {/* Right Side - Relay Feed + Controls */}
              <div className="flex flex-col gap-5 sm:gap-6 lg:w-[35%]">
                <section className="flex-1">
                  <RelayFeed alerts={mockAlerts} rescueTeams={mockRescueTeams} familyMessages={mockFamilyMessages} />
                </section>

                <aside className="hidden xl:block">
                  <ControlSidebar
                    onHighContrastToggle={setHighContrast}
                    highContrastEnabled={highContrast}
                  />
                </aside>
              </div>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-5 sm:space-y-6 mt-0">
            <div className="flex flex-col gap-5 sm:gap-6 lg:grid lg:grid-cols-2">
              <NewsFeed news={mockNewsItems} />
              <div className="flex flex-col gap-5 sm:gap-6">
                <PersonalGuardian
                  weather={mockPersonalWeather}
                  travelRisk={mockTravelRisk}
                  forecast={mock3DayForecast}
                />
                <RelayFeed alerts={mockAlerts} rescueTeams={mockRescueTeams} familyMessages={mockFamilyMessages} />
              </div>
            </div>
          </TabsContent>

          {/* Family View Tab */}
          <TabsContent value="family" className="space-y-5 sm:space-y-6 mt-0">
            <div className="flex flex-col gap-5 sm:gap-6 lg:grid lg:grid-cols-3">
              <PersonalGuardian
                weather={mockPersonalWeather}
                travelRisk={mockTravelRisk}
                forecast={mock3DayForecast}
              />
              <FamilyCircle
                members={mockFamilyMembers}
                onEmergencyPing={handleEmergencyPing}
              />
              <FamilyMessaging
                messages={mockFamilyMessages}
                members={mockFamilyMembers}
                onSendMessage={(msg) => console.log("Sending message:", msg)}
              />
            </div>
          </TabsContent>

          {/* Evacuation Tab */}
          <TabsContent value="evacuate" className="space-y-5 sm:space-y-6 mt-0">
            <div className="flex flex-col gap-5 sm:gap-6 lg:grid lg:grid-cols-2">
              <EvacuationTool centers={mockEvacuationCenters} />
              <PersonalGuardian
                weather={mockPersonalWeather}
                travelRisk={mockTravelRisk}
                forecast={mock3DayForecast}
              />
            </div>
          </TabsContent>

          {/* Recovery Tab */}
          <TabsContent value="recovery" className="space-y-5 sm:space-y-6 mt-0">
            <div className="flex flex-col gap-5 sm:gap-6 lg:grid lg:grid-cols-2">
              <RecoveryDashboard
                damageReports={mockDamageReports}
                progress={mockRecoveryProgress}
                bayanihanItems={mockBayanihanItems}
              />
              <div className="flex flex-col gap-5 sm:gap-6">
                <NewsFeed
                  news={mockNewsItems.filter(
                    (n) => n.category === "recovery" || n.category === "advisory"
                  )}
                />
                <EvacuationTool centers={mockEvacuationCenters} />
              </div>
            </div>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-5 sm:space-y-6 mt-0">
            <div className="flex flex-col gap-5 sm:gap-6 lg:grid lg:grid-cols-3">
              <div className="lg:col-span-2">
                <FamilyCircle
                  members={mockFamilyMembers}
                  onEmergencyPing={handleEmergencyPing}
                />
              </div>
              <EvacuationTool centers={mockEvacuationCenters} />
            </div>
            <RelayFeed alerts={mockAlerts} rescueTeams={mockRescueTeams} familyMessages={mockFamilyMessages} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile/Tablet Control Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[350px] overflow-y-auto p-4"
        >
          <ControlSidebar
            onHighContrastToggle={setHighContrast}
            highContrastEnabled={highContrast}
          />
        </SheetContent>
      </Sheet>

      {/* Floating Action Button for Control Panel */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 xl:hidden z-40">
        <Button
          size="lg"
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <PanelRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Critical Alert Overlay */}
      <CriticalAlert
        isOpen={showCriticalAlert}
        onClose={() => setShowCriticalAlert(false)}
        alertType="typhoon"
        timeToImpact="20 mins"
        message="Typhoon Warning - Evacuation recommended. Proceed to nearest shelter immediately."
      />
    </div>
  );
}
