// Mock data for the Disaster Guardian & Relay System
// Philippine-based realistic data

export interface SOSAlert {
  id: string;
  type: "sos";
  location: string;
  barangay: string;
  city: string;
  coordinates: { lat: number; lng: number };
  message: string;
  headcount: number;
  urgencyLevel: 1 | 2 | 3 | 4 | 5;
  timestamp: Date;
  contactNumber?: string;
  status: "pending" | "assigned" | "in_progress" | "resolved";
}

export interface PredictiveWarning {
  id: string;
  type: "predictive";
  warningType: "flood" | "heatstroke" | "landslide" | "storm_surge";
  affectedArea: string;
  recipientCount: number;
  riskPercentage: number;
  message: string;
  timestamp: Date;
  source: "AI" | "PAGASA" | "PHIVOLCS";
}

export type AlertItem = SOSAlert | PredictiveWarning;

export interface RescueTeam {
  id: string;
  name: string;
  status: "available" | "deployed" | "on_standby";
  members: number;
  vehicle: string;
  currentLocation?: string;
}

export interface EnvironmentalMetrics {
  heatIndex: {
    current: number;
    status: "normal" | "caution" | "extreme_caution" | "danger" | "extreme_danger";
    trend: "rising" | "stable" | "falling";
  };
  precipitation: {
    last24h: number;
    forecast6h: number;
    status: "light" | "moderate" | "heavy" | "torrential";
  };
  riverLevel: {
    current: number;
    threshold: number;
    status: "normal" | "alert" | "critical";
    riverName: string;
  };
  riskForecast: {
    floodRisk: number;
    timeframe: string;
    primaryThreat: string;
  };
}

export interface VulnerableHousehold {
  id: string;
  address: string;
  barangay: string;
  coordinates: { lat: number; lng: number };
  elderly: number;
  infants: number;
  pwds: number;
  totalMembers: number;
}

// Mock SOS Alerts
export const mockSOSAlerts: SOSAlert[] = [
  {
    id: "sos-001",
    type: "sos",
    location: "123 Rizal Street",
    barangay: "Barangay Tumana",
    city: "Marikina City",
    coordinates: { lat: 14.6507, lng: 121.1029 },
    message: "Tubig na po hanggang bewang! May tatlong bata at lola ko na 78 years old. Hindi na kami makalabas ng bahay. Pls help!",
    headcount: 5,
    urgencyLevel: 5,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    contactNumber: "09171234567",
    status: "pending",
  },
  {
    id: "sos-002",
    type: "sos",
    location: "Blk 7 Lot 15 Sampaguita St",
    barangay: "Barangay Provident",
    city: "Marikina City",
    coordinates: { lat: 14.6412, lng: 121.0987 },
    message: "Stranded po kami sa rooftop. Family of 7. May gamot na kailangan ng nanay ko for diabetes. Sana po marescue agad.",
    headcount: 7,
    urgencyLevel: 4,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    contactNumber: "09281234567",
    status: "pending",
  },
  {
    id: "sos-003",
    type: "sos",
    location: "45 Gen. Luna St",
    barangay: "Barangay Bagong Silang",
    city: "Quezon City",
    coordinates: { lat: 14.7369, lng: 121.0512 },
    message: "Bumabaha na po dito. 2 seniors at 1 PWD wheelchair user. Need evacuation ASAP.",
    headcount: 4,
    urgencyLevel: 5,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    contactNumber: "09391234567",
    status: "assigned",
  },
  {
    id: "sos-004",
    type: "sos",
    location: "Unit 5B Riverside Apartments",
    barangay: "Barangay Manggahan",
    city: "Pasig City",
    coordinates: { lat: 14.5764, lng: 121.0851 },
    message: "Ground floor flooded. Trapped sa 2nd floor with pregnant wife. Water still rising po.",
    headcount: 2,
    urgencyLevel: 4,
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    contactNumber: "09451234567",
    status: "in_progress",
  },
  {
    id: "sos-005",
    type: "sos",
    location: "78 Mabini St",
    barangay: "Barangay Santolan",
    city: "Pasig City",
    coordinates: { lat: 14.6089, lng: 121.0785 },
    message: "Family of 6 stranded. May infant na 3 months old. Walang kuryente at tubig. Pls send help.",
    headcount: 6,
    urgencyLevel: 3,
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    contactNumber: "09561234567",
    status: "pending",
  },
];

// Mock Predictive Warnings
export const mockPredictiveWarnings: PredictiveWarning[] = [
  {
    id: "pred-001",
    type: "predictive",
    warningType: "heatstroke",
    affectedArea: "Barangay 12, Caloocan City",
    recipientCount: 456,
    riskPercentage: 85,
    message: "Automated Heatstroke Warning sent to 456 residents in Brgy 12. Heat index expected to reach 45°C by 2PM.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    source: "AI",
  },
  {
    id: "pred-002",
    type: "predictive",
    warningType: "flood",
    affectedArea: "Low-lying areas of Marikina Valley",
    recipientCount: 2340,
    riskPercentage: 70,
    message: "Flash Flood Warning: 70% probability within 48 hours. Pre-emptive evacuation advisory sent to 2,340 households.",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    source: "PAGASA",
  },
  {
    id: "pred-003",
    type: "predictive",
    warningType: "landslide",
    affectedArea: "Hillside communities, Antipolo City",
    recipientCount: 890,
    riskPercentage: 55,
    message: "Landslide Risk Alert: Soil saturation at critical levels. 890 residents in elevated risk zones notified.",
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
    source: "PHIVOLCS",
  },
  {
    id: "pred-004",
    type: "predictive",
    warningType: "storm_surge",
    affectedArea: "Coastal barangays, Navotas City",
    recipientCount: 1567,
    riskPercentage: 40,
    message: "Storm Surge Advisory: Moderate risk for coastal areas. 1,567 fisherfolk and residents alerted.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    source: "PAGASA",
  },
];

// Combine and sort alerts by timestamp
export const mockAlerts: AlertItem[] = [...mockSOSAlerts, ...mockPredictiveWarnings].sort(
  (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
);

// Environmental Metrics
export const mockEnvironmentalMetrics: EnvironmentalMetrics = {
  heatIndex: {
    current: 42,
    status: "danger",
    trend: "rising",
  },
  precipitation: {
    last24h: 87.5,
    forecast6h: 45,
    status: "heavy",
  },
  riverLevel: {
    current: 18.5,
    threshold: 21,
    status: "alert",
    riverName: "Marikina River",
  },
  riskForecast: {
    floodRisk: 70,
    timeframe: "48h",
    primaryThreat: "Flash Flooding",
  },
};

// Hourly Data for Interactive Cards
export interface HourlyDataPoint {
  hour: string;
  value: number;
  label?: string;
}

export interface RiskForecastData {
  timeframe: "24h" | "48h" | "72h";
  floodRisk: number;
  primaryThreat: string;
  secondaryThreats: string[];
  confidence: number;
  details: string;
}

// Heat Index hourly data (24 hours)
export const mockHeatIndexHourly: HourlyDataPoint[] = [
  { hour: "12AM", value: 28, label: "Normal" },
  { hour: "1AM", value: 27, label: "Normal" },
  { hour: "2AM", value: 26, label: "Normal" },
  { hour: "3AM", value: 26, label: "Normal" },
  { hour: "4AM", value: 25, label: "Normal" },
  { hour: "5AM", value: 26, label: "Normal" },
  { hour: "6AM", value: 28, label: "Normal" },
  { hour: "7AM", value: 31, label: "Caution" },
  { hour: "8AM", value: 34, label: "Caution" },
  { hour: "9AM", value: 37, label: "Extreme Caution" },
  { hour: "10AM", value: 39, label: "Danger" },
  { hour: "11AM", value: 41, label: "Danger" },
  { hour: "12PM", value: 42, label: "Danger" },
  { hour: "1PM", value: 44, label: "Danger" },
  { hour: "2PM", value: 45, label: "Extreme Danger" },
  { hour: "3PM", value: 44, label: "Danger" },
  { hour: "4PM", value: 42, label: "Danger" },
  { hour: "5PM", value: 40, label: "Danger" },
  { hour: "6PM", value: 37, label: "Extreme Caution" },
  { hour: "7PM", value: 34, label: "Caution" },
  { hour: "8PM", value: 32, label: "Caution" },
  { hour: "9PM", value: 30, label: "Normal" },
  { hour: "10PM", value: 29, label: "Normal" },
  { hour: "11PM", value: 28, label: "Normal" },
];

// Precipitation hourly data (24 hours)
export const mockPrecipitationHourly: HourlyDataPoint[] = [
  { hour: "12AM", value: 0 },
  { hour: "1AM", value: 0.5 },
  { hour: "2AM", value: 2 },
  { hour: "3AM", value: 5 },
  { hour: "4AM", value: 8 },
  { hour: "5AM", value: 12 },
  { hour: "6AM", value: 15 },
  { hour: "7AM", value: 10 },
  { hour: "8AM", value: 5 },
  { hour: "9AM", value: 2 },
  { hour: "10AM", value: 0 },
  { hour: "11AM", value: 0 },
  { hour: "12PM", value: 0 },
  { hour: "1PM", value: 3 },
  { hour: "2PM", value: 8 },
  { hour: "3PM", value: 12 },
  { hour: "4PM", value: 5 },
  { hour: "5PM", value: 0 },
  { hour: "6PM", value: 0 },
  { hour: "7PM", value: 0 },
  { hour: "8PM", value: 0 },
  { hour: "9PM", value: 0 },
  { hour: "10PM", value: 0 },
  { hour: "11PM", value: 0 },
];

// River Level hourly data (24 hours)
export const mockRiverLevelHourly: HourlyDataPoint[] = [
  { hour: "12AM", value: 15.2 },
  { hour: "1AM", value: 15.0 },
  { hour: "2AM", value: 14.8 },
  { hour: "3AM", value: 14.5 },
  { hour: "4AM", value: 14.8 },
  { hour: "5AM", value: 15.5 },
  { hour: "6AM", value: 16.2 },
  { hour: "7AM", value: 16.8 },
  { hour: "8AM", value: 17.2 },
  { hour: "9AM", value: 17.5 },
  { hour: "10AM", value: 17.8 },
  { hour: "11AM", value: 18.0 },
  { hour: "12PM", value: 18.2 },
  { hour: "1PM", value: 18.3 },
  { hour: "2PM", value: 18.5 },
  { hour: "3PM", value: 18.5 },
  { hour: "4PM", value: 18.4 },
  { hour: "5PM", value: 18.3 },
  { hour: "6PM", value: 18.2 },
  { hour: "7PM", value: 18.0 },
  { hour: "8PM", value: 17.8 },
  { hour: "9PM", value: 17.5 },
  { hour: "10PM", value: 17.2 },
  { hour: "11PM", value: 17.0 },
];

// Risk Forecast data for different timeframes
export const mockRiskForecasts: RiskForecastData[] = [
  {
    timeframe: "24h",
    floodRisk: 45,
    primaryThreat: "Localized Flooding",
    secondaryThreats: ["Road Closures", "Power Outages"],
    confidence: 85,
    details: "Moderate risk of localized flooding in low-lying areas. Expected rainfall of 30-50mm. Marikina River expected to remain below alert level.",
  },
  {
    timeframe: "48h",
    floodRisk: 70,
    primaryThreat: "Flash Flooding",
    secondaryThreats: ["Landslides", "Evacuation Required", "Infrastructure Damage"],
    confidence: 75,
    details: "High risk of flash flooding as Typhoon Kristine approaches. Expected rainfall of 100-150mm. Marikina River may reach alert level. Pre-emptive evacuation recommended for riverside communities.",
  },
  {
    timeframe: "72h",
    floodRisk: 85,
    primaryThreat: "Major Flooding",
    secondaryThreats: ["Widespread Evacuation", "Bridge Closures", "Landslides", "Extended Power Outages"],
    confidence: 65,
    details: "Very high risk of major flooding. Typhoon Kristine expected to make landfall. Total rainfall may exceed 200mm. Multiple rivers may breach critical levels. Mandatory evacuation for all flood-prone areas.",
  },
];

// Rescue Teams
export const mockRescueTeams: RescueTeam[] = [
  {
    id: "team-001",
    name: "Alpha Response Unit",
    status: "available",
    members: 6,
    vehicle: "Rescue Boat RB-01",
    currentLocation: "Marikina Sports Center",
  },
  {
    id: "team-002",
    name: "Bravo Medical Team",
    status: "deployed",
    members: 4,
    vehicle: "Ambulance AMB-03",
    currentLocation: "En route to Barangay Tumana",
  },
  {
    id: "team-003",
    name: "Charlie Swift Response",
    status: "available",
    members: 5,
    vehicle: "4x4 Rescue Vehicle RV-02",
    currentLocation: "Pasig City Hall",
  },
  {
    id: "team-004",
    name: "Delta Water Rescue",
    status: "on_standby",
    members: 8,
    vehicle: "Heavy Rescue Boat RB-05",
    currentLocation: "Manggahan Floodway",
  },
  {
    id: "team-005",
    name: "Red Cross Mobile Unit",
    status: "deployed",
    members: 6,
    vehicle: "Mobile Command Center",
    currentLocation: "Quezon City Evacuation Center",
  },
];

// Vulnerable Households
export const mockVulnerableHouseholds: VulnerableHousehold[] = [
  {
    id: "vh-001",
    address: "15 Sampaguita St",
    barangay: "Barangay Tumana",
    coordinates: { lat: 14.6521, lng: 121.1045 },
    elderly: 2,
    infants: 0,
    pwds: 1,
    totalMembers: 5,
  },
  {
    id: "vh-002",
    address: "89 Orchid Lane",
    barangay: "Barangay Concepcion",
    coordinates: { lat: 14.6378, lng: 121.0912 },
    elderly: 1,
    infants: 2,
    pwds: 0,
    totalMembers: 6,
  },
  {
    id: "vh-003",
    address: "234 Jasmine Rd",
    barangay: "Barangay Malanday",
    coordinates: { lat: 14.6645, lng: 121.1123 },
    elderly: 3,
    infants: 1,
    pwds: 0,
    totalMembers: 7,
  },
];

// Map Layer Data
export interface MapPin {
  id: string;
  coordinates: { lat: number; lng: number };
  type: "sos" | "vulnerable" | "evacuation" | "rescue_team";
  severity?: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export const mockMapPins: MapPin[] = [
  ...mockSOSAlerts.map((sos) => ({
    id: sos.id,
    coordinates: sos.coordinates,
    type: "sos" as const,
    severity: sos.urgencyLevel,
    label: `${sos.barangay} - ${sos.headcount} persons`,
  })),
  {
    id: "evac-001",
    coordinates: { lat: 14.6298, lng: 121.0834 },
    type: "evacuation",
    label: "Marikina Sports Center",
  },
  {
    id: "evac-002",
    coordinates: { lat: 14.6512, lng: 121.0456 },
    type: "evacuation",
    label: "Quezon City Evacuation Hub",
  },
];

export interface FloodZone {
  id: string;
  name: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  coordinates: { lat: number; lng: number };
  radius: number;
}

export const mockFloodZones: FloodZone[] = [
  {
    id: "fz-001",
    name: "Marikina River Basin",
    riskLevel: "critical",
    coordinates: { lat: 14.6507, lng: 121.1029 },
    radius: 2.5,
  },
  {
    id: "fz-002",
    name: "Manggahan Floodway",
    riskLevel: "high",
    coordinates: { lat: 14.5764, lng: 121.0851 },
    radius: 3,
  },
  {
    id: "fz-003",
    name: "Pasig River Corridor",
    riskLevel: "moderate",
    coordinates: { lat: 14.5896, lng: 121.0654 },
    radius: 2,
  },
];

export interface HeatIsland {
  id: string;
  name: string;
  intensity: "moderate" | "high" | "extreme";
  coordinates: { lat: number; lng: number };
  radius: number;
}

export const mockHeatIslands: HeatIsland[] = [
  {
    id: "hi-001",
    name: "Cubao Commercial District",
    intensity: "extreme",
    coordinates: { lat: 14.6195, lng: 121.0512 },
    radius: 1.5,
  },
  {
    id: "hi-002",
    name: "Divisoria Market Area",
    intensity: "high",
    coordinates: { lat: 14.6012, lng: 120.9734 },
    radius: 1,
  },
];

// Family Circle Types and Data
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  status: "safe" | "at_risk" | "offline";
  connectionMode: "fiber" | "4g" | "sms";
  location: string;
  coordinates: { lat: number; lng: number };
  lastSeen: Date;
  distance: number; // km from user
  phone: string;
}

export interface EvacuationCenter {
  id: string;
  name: string;
  address: string;
  distance: number; // km
  currentCapacity: number;
  maxCapacity: number;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  isOpen: boolean;
}

export interface PersonalWeather {
  temperature: number;
  humidity: number;
  heatIndex: number;
  condition: string;
  pressureStatus: string;
  uvIndex: number;
}

export interface TravelRisk {
  isMoving: boolean;
  currentLocation: string;
  destinationRisk: "low" | "moderate" | "high";
  hazardAhead?: string;
  nearestEvacuation?: string;
}

// Mock Family Members (Family of 4 with 1 at risk)
export const mockFamilyMembers: FamilyMember[] = [
  {
    id: "fam-001",
    name: "Mama",
    relationship: "Mother",
    status: "safe",
    connectionMode: "fiber",
    location: "Home - Quezon City",
    coordinates: { lat: 14.6760, lng: 121.0437 },
    lastSeen: new Date(),
    distance: 0,
    phone: "09171234567",
  },
  {
    id: "fam-002",
    name: "Papa",
    relationship: "Father",
    status: "safe",
    connectionMode: "4g",
    location: "Makati Office",
    coordinates: { lat: 14.5547, lng: 121.0244 },
    lastSeen: new Date(Date.now() - 2 * 60 * 1000),
    distance: 8.5,
    phone: "09181234567",
  },
  {
    id: "fam-003",
    name: "Kuya Miguel",
    relationship: "Elder Brother",
    status: "at_risk",
    connectionMode: "sms",
    location: "Marikina - Near Flood Zone",
    coordinates: { lat: 14.6507, lng: 121.1029 },
    lastSeen: new Date(Date.now() - 10 * 60 * 1000),
    distance: 12.3,
    phone: "09191234567",
  },
  {
    id: "fam-004",
    name: "Ate Sofia",
    relationship: "Elder Sister",
    status: "offline",
    connectionMode: "sms",
    location: "Last seen: BGC, Taguig",
    coordinates: { lat: 14.5509, lng: 121.0454 },
    lastSeen: new Date(Date.now() - 15 * 60 * 1000),
    distance: 10.2,
    phone: "09201234567",
  },
];

// Mock Evacuation Centers
export const mockEvacuationCenters: EvacuationCenter[] = [
  {
    id: "ec-001",
    name: "Quezon City Sports Center",
    address: "E. Rodriguez Sr. Ave, Quezon City",
    distance: 1.2,
    currentCapacity: 234,
    maxCapacity: 500,
    coordinates: { lat: 14.6298, lng: 121.0834 },
    amenities: ["Medical Station", "Food Supply", "WiFi", "Charging Stations"],
    isOpen: true,
  },
  {
    id: "ec-002",
    name: "Marikina Sports Complex",
    address: "Shoe Ave, Marikina City",
    distance: 3.8,
    currentCapacity: 456,
    maxCapacity: 800,
    coordinates: { lat: 14.6512, lng: 121.0982 },
    amenities: ["Medical Station", "Food Supply", "Pet Shelter"],
    isOpen: true,
  },
  {
    id: "ec-003",
    name: "Barangay Hall - Brgy 12",
    address: "Main St, Brgy 12, Caloocan City",
    distance: 5.5,
    currentCapacity: 89,
    maxCapacity: 150,
    coordinates: { lat: 14.7312, lng: 121.0456 },
    amenities: ["Basic Medical", "Food Supply"],
    isOpen: true,
  },
];

// Mock Personal Weather
export const mockPersonalWeather: PersonalWeather = {
  temperature: 34,
  humidity: 78,
  heatIndex: 42,
  condition: "Partly Cloudy",
  pressureStatus: "Dropping - Storm likely",
  uvIndex: 8,
};

// Mock Travel Risk
export const mockTravelRisk: TravelRisk = {
  isMoving: false,
  currentLocation: "Quezon City - Home",
  destinationRisk: "low",
};

// 3-Day Forecast Data
export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
  rainChance: number;
  warning?: string;
}

export const mock3DayForecast: ForecastDay[] = [
  {
    day: "Today",
    high: 35,
    low: 27,
    condition: "cloudy",
    rainChance: 40,
    warning: "Heat advisory",
  },
  {
    day: "Tomorrow",
    high: 33,
    low: 26,
    condition: "rainy",
    rainChance: 80,
    warning: "Heavy rainfall expected",
  },
  {
    day: "Day 3",
    high: 29,
    low: 24,
    condition: "stormy",
    rainChance: 95,
    warning: "Typhoon warning",
  },
];

// Family Messaging System
export interface FamilyMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "location" | "status" | "emergency";
  isRead: boolean;
  location?: { lat: number; lng: number; address: string };
}

export const mockFamilyMessages: FamilyMessage[] = [
  {
    id: "msg-001",
    senderId: "fam-003",
    senderName: "Kuya Miguel",
    content: "Ang taas na ng tubig dito sa Marikina. Nasa 2nd floor na kami ng bahay ni tita.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "emergency",
    isRead: false,
  },
  {
    id: "msg-002",
    senderId: "fam-002",
    senderName: "Papa",
    content: "Okay ako dito sa office. Traffic pero safe naman. Ingat kayo lahat.",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "msg-003",
    senderId: "fam-001",
    senderName: "Mama",
    content: "Nandito ako sa bahay. May kuryente pa. Inaayos ko na mga gamit just in case.",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "msg-004",
    senderId: "fam-004",
    senderName: "Ate Sofia",
    content: "Last location: BGC, Taguig",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: "location",
    isRead: false,
    location: { lat: 14.5509, lng: 121.0454, address: "BGC, Taguig" },
  },
  {
    id: "msg-005",
    senderId: "fam-003",
    senderName: "Kuya Miguel",
    content: "Need help! Stranded sa Marikina near flood zone. Signal weak.",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: "emergency",
    isRead: false,
  },
];

// News and Disaster Reports
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  category: "typhoon" | "flood" | "earthquake" | "heatwave" | "landslide" | "advisory" | "recovery";
  severity: "info" | "warning" | "critical";
  imageUrl?: string;
  isBreaking?: boolean;
  affectedAreas?: string[];
}

export const mockNewsItems: NewsItem[] = [
  {
    id: "news-001",
    title: "Typhoon Kristine makes landfall in Aurora",
    summary: "Typhoon Kristine (International name: Toraji) made landfall in Aurora province at 4:30 AM with sustained winds of 150 kph and gustiness of up to 185 kph. PAGASA has raised Signal No. 4 over Aurora and Isabela.",
    source: "PAGASA",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    category: "typhoon",
    severity: "critical",
    isBreaking: true,
    affectedAreas: ["Aurora", "Isabela", "Cagayan Valley", "Cordillera"],
  },
  {
    id: "news-002",
    title: "Flash flood warning issued for Metro Manila",
    summary: "MMDA and PAGASA have issued a flash flood warning for low-lying areas in Metro Manila. Residents in Marikina, Pasig, and Cainta are advised to prepare for possible evacuation.",
    source: "MMDA",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    category: "flood",
    severity: "warning",
    affectedAreas: ["Marikina", "Pasig", "Cainta", "Rizal"],
  },
  {
    id: "news-003",
    title: "Marikina River water level reaches 18.5 meters",
    summary: "The Marikina River water level has reached 18.5 meters, nearing the critical level of 21 meters. Authorities are monitoring the situation and preparing evacuation centers.",
    source: "Marikina DRRMO",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: "flood",
    severity: "warning",
    affectedAreas: ["Marikina City"],
  },
  {
    id: "news-004",
    title: "Heat index to reach 45°C in NCR today",
    summary: "PAGASA warns of dangerous heat index levels reaching up to 45°C in Metro Manila. The public is advised to stay hydrated, avoid prolonged sun exposure, and check on elderly neighbors.",
    source: "PAGASA",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "heatwave",
    severity: "warning",
    affectedAreas: ["Metro Manila", "Bulacan", "Cavite", "Laguna"],
  },
  {
    id: "news-005",
    title: "DSWD activates quick response teams in Luzon",
    summary: "The Department of Social Welfare and Development (DSWD) has activated its quick response teams and prepositioned relief goods in strategic areas across Luzon in anticipation of Typhoon Kristine.",
    source: "DSWD",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: "advisory",
    severity: "info",
    affectedAreas: ["Luzon"],
  },
  {
    id: "news-006",
    title: "Red Cross deploys rescue teams to Cagayan",
    summary: "Philippine Red Cross has deployed additional rescue boats and medical teams to Cagayan Valley as floodwaters continue to rise in several municipalities.",
    source: "Philippine Red Cross",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: "recovery",
    severity: "info",
    affectedAreas: ["Cagayan Valley"],
  },
  {
    id: "news-007",
    title: "Landslide alert raised for Rizal mountain barangays",
    summary: "MGB has issued a landslide alert for mountainous barangays in Rizal province due to saturated soil conditions. Pre-emptive evacuation is recommended for high-risk areas.",
    source: "MGB",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: "landslide",
    severity: "warning",
    affectedAreas: ["Rizal", "Antipolo"],
  },
];

// Recovery Dashboard Data
export interface DamageReport {
  id: string;
  imageUrl?: string;
  category: "electricity" | "water" | "road" | "structure" | "bridge";
  description: string;
  location: string;
  barangay: string;
  city: string;
  coordinates: { lat: number; lng: number };
  reportedBy: string;
  timestamp: Date;
  status: "reported" | "verified" | "in_progress" | "resolved";
  aiTags?: string[];
}

export interface RecoveryProgress {
  powerRestored: number;
  waterSupply: number;
  aidDistributed: number;
  roadsCleared: number;
}

export interface BayanihanItem {
  id: string;
  type: "need" | "offer";
  category: "food" | "water" | "medicine" | "shelter" | "transport" | "skills" | "supplies";
  description: string;
  location: string;
  contactName: string;
  contactNumber: string;
  timestamp: Date;
  isMatched?: boolean;
  matchedWith?: string;
}

export const mockDamageReports: DamageReport[] = [
  {
    id: "dmg-001",
    category: "electricity",
    description: "Fallen power lines blocking main road",
    location: "J.P. Rizal Street",
    barangay: "Barangay Tumana",
    city: "Marikina City",
    coordinates: { lat: 14.6521, lng: 121.1045 },
    reportedBy: "Juan dela Cruz",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "verified",
    aiTags: ["Power Outage", "Road Hazard", "High Priority"],
  },
  {
    id: "dmg-002",
    category: "road",
    description: "Road flooded and impassable - water level at 2 feet",
    location: "Sumulong Highway",
    barangay: "Barangay Concepcion",
    city: "Marikina City",
    coordinates: { lat: 14.6378, lng: 121.0912 },
    reportedBy: "Maria Santos",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "in_progress",
    aiTags: ["Flooded Road", "Traffic Reroute"],
  },
  {
    id: "dmg-003",
    category: "structure",
    description: "Partial roof collapse on residential building",
    location: "45 Mabini St",
    barangay: "Barangay Santolan",
    city: "Pasig City",
    coordinates: { lat: 14.6089, lng: 121.0785 },
    reportedBy: "Pedro Reyes",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "reported",
    aiTags: ["Structural Damage", "Shelter Needed"],
  },
];

export const mockRecoveryProgress: RecoveryProgress = {
  powerRestored: 68,
  waterSupply: 82,
  aidDistributed: 45,
  roadsCleared: 55,
};

export const mockBayanihanItems: BayanihanItem[] = [
  {
    id: "bay-001",
    type: "need",
    category: "medicine",
    description: "Need insulin and diabetes medication for 3 seniors",
    location: "Barangay Tumana, Marikina",
    contactName: "Rosa Martinez",
    contactNumber: "09171234567",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isMatched: true,
    matchedWith: "bay-004",
  },
  {
    id: "bay-002",
    type: "need",
    category: "water",
    description: "Clean drinking water for 15 families",
    location: "Barangay Provident, Marikina",
    contactName: "Jose Garcia",
    contactNumber: "09281234567",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "bay-003",
    type: "offer",
    category: "transport",
    description: "I have a truck available for hauling relief goods",
    location: "Quezon City",
    contactName: "Miguel Santos",
    contactNumber: "09391234567",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "bay-004",
    type: "offer",
    category: "medicine",
    description: "Pharmacist - can provide insulin and basic meds",
    location: "Marikina City",
    contactName: "Dr. Ana Reyes",
    contactNumber: "09451234567",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    isMatched: true,
    matchedWith: "bay-001",
  },
  {
    id: "bay-005",
    type: "offer",
    category: "skills",
    description: "Carpenter - can help repair damaged roofs",
    location: "Pasig City",
    contactName: "Roberto Cruz",
    contactNumber: "09561234567",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: "bay-006",
    type: "need",
    category: "food",
    description: "Canned goods and rice for evacuation center (200 families)",
    location: "Marikina Sports Center",
    contactName: "Evacuation Manager",
    contactNumber: "09671234567",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];
