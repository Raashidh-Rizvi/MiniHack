export interface EmergencyContact {
  id: string;
  number: string;
  displayNumber: string;
  shortLabel: string;
  title: string;
  agency: string;
  category: 'POLICE' | 'MEDICAL' | 'DISASTER' | 'UTILITY' | 'GENERAL';
  description: string;
  whenToCall: string;
  isTollFree: boolean;
  availableHours: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export const GOVERNMENT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'police',
    number: '119',
    displayNumber: '119',
    shortLabel: 'Police',
    title: 'Sri Lanka Police Emergency Hotline',
    agency: 'Sri Lanka Police Department',
    category: 'POLICE',
    description: 'Immediate response for crimes in progress, severe road accidents, public disorder, or threats to personal safety.',
    whenToCall: 'Call immediately when lives are threatened, violent crimes occur, or urgent police intervention is needed on public roads.',
    isTollFree: true,
    availableHours: '24/7 Nationwide',
    accentColor: '#3B82F6',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'suwa-seriya',
    number: '1990',
    displayNumber: '1990',
    shortLabel: 'Ambulance',
    title: '1990 Suwa Seriya Emergency Ambulance',
    agency: 'Ministry of Health / Suwa Seriya Foundation',
    category: 'MEDICAL',
    description: 'Free nationwide pre-hospital emergency medical service with GPS-equipped rapid response ambulances and trained EMTs.',
    whenToCall: 'Call immediately for heart attacks, severe trauma, unconsciousness, severe bleeding, or critical health emergencies before reaching hospital.',
    isTollFree: true,
    availableHours: '24/7 Nationwide (Free Service)',
    accentColor: '#EF4444',
    badgeBg: 'bg-red-500/10 dark:bg-red-500/20',
    badgeText: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'dmc',
    number: '117',
    displayNumber: '117',
    shortLabel: 'Disaster DMC',
    title: 'Disaster Management Centre (DMC)',
    agency: 'Ministry of Defence / National Emergency Operation Centre',
    category: 'DISASTER',
    description: 'National coordinating authority for natural disasters, extreme weather, reservoir alerts, and flood evacuation warnings.',
    whenToCall: 'Call during flash floods, earth slips/landslides, severe cyclonic storms, dam or reservoir overflows, or fallen tree blockages affecting entire communities.',
    isTollFree: true,
    availableHours: '24/7 Emergency Operation',
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'fire',
    number: '110',
    displayNumber: '110',
    shortLabel: 'Fire & Rescue',
    title: 'Fire & Rescue Service',
    agency: 'Municipal Fire Service Departments',
    category: 'DISASTER',
    description: 'Emergency fire suppression, structural collapse rescue, industrial chemical spills, and high-risk vehicular extraction.',
    whenToCall: 'Call immediately for building fires, commercial flammable gas leaks, explosion hazards, or people trapped under collapsed debris.',
    isTollFree: true,
    availableHours: '24/7 Municipal Coverage',
    accentColor: '#F97316',
    badgeBg: 'bg-orange-500/10 dark:bg-orange-500/20',
    badgeText: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 'ceb-electricity',
    number: '1987',
    displayNumber: '1987',
    shortLabel: 'CEB Electricity',
    title: 'Ceylon Electricity Board (CEB) Emergency Breakdown',
    agency: 'Ceylon Electricity Board',
    category: 'UTILITY',
    description: 'Immediate reporting of high-voltage electrical hazards, severed power lines, transformer bursts, and power grid failures.',
    whenToCall: 'Call immediately if live high-voltage power lines have fallen onto roads or water, transformer sparks are visible, or there is an imminent electrocution hazard.',
    isTollFree: true,
    availableHours: '24/7 Breakdown Response',
    accentColor: '#EAB308',
    badgeBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    badgeText: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    id: 'nwsdb-water',
    number: '1939',
    displayNumber: '1939',
    shortLabel: 'Water Board',
    title: 'National Water Supply & Drainage Board (NWSDB)',
    agency: 'National Water Supply & Drainage Board',
    category: 'UTILITY',
    description: 'Emergency line for burst municipal water distribution mains, contaminated public drinking supplies, and critical drainage failures.',
    whenToCall: 'Call when major municipal water supply mains rupture causing severe road erosion, deep localized flooding, or dangerous contamination of drinking lines.',
    isTollFree: true,
    availableHours: '24/7 Call Centre',
    accentColor: '#06B6D4',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'leco',
    number: '1910',
    displayNumber: '1910',
    shortLabel: 'LECO',
    title: 'LECO Electricity Emergency Helpline',
    agency: 'Lanka Electricity Company (LECO)',
    category: 'UTILITY',
    description: 'Helpline for electrical emergencies and breakdowns in LECO coastal and urban franchise zones.',
    whenToCall: 'Call for snapped electric wires, burning service wires, or meter explosion hazards in LECO distribution zones (Western & Southern coastal belt).',
    isTollFree: true,
    availableHours: '24/7 Support',
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'gic',
    number: '1919',
    displayNumber: '1919',
    shortLabel: 'Govt Info',
    title: 'Government Information Centre (GIC)',
    agency: 'Information and Communication Technology Agency (ICTA)',
    category: 'GENERAL',
    description: 'National hub for official government services, municipal jurisdiction inquiries, and citizen escalations across Sri Lanka.',
    whenToCall: 'Call for general civic guidance, directory information on local councils (Pradeshiya Sabha / Municipal Councils), or to verify government departments.',
    isTollFree: true,
    availableHours: '8:00 AM – 8:00 PM (365 Days)',
    accentColor: '#8B5CF6',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'colombo-nh-accident',
    number: '0112691111',
    displayNumber: '011-2691111',
    shortLabel: 'Accident Hospital',
    title: 'National Hospital Accident Service (Colombo)',
    agency: 'National Hospital of Sri Lanka (NHSL)',
    category: 'MEDICAL',
    description: 'Direct line to Sri Lanka’s premier trauma and accident emergency triage centre in Colombo.',
    whenToCall: 'Direct coordination for severe polytrauma, major road collisions, and mass casualty admissions in the Western Province.',
    isTollFree: false,
    availableHours: '24/7 Trauma Unit',
    accentColor: '#EC4899',
    badgeBg: 'bg-pink-500/10 dark:bg-pink-500/20',
    badgeText: 'text-pink-600 dark:text-pink-400',
  },
];

/**
 * Returns prioritized emergency hotlines relevant to a specific category or hazard
 */
export function getRelevantEmergencyContacts(category?: string, severity?: string): EmergencyContact[] {
  const contacts = [...GOVERNMENT_EMERGENCY_CONTACTS];

  if (category === 'WATER') {
    return [
      contacts.find((c) => c.id === 'nwsdb-water')!,
      contacts.find((c) => c.id === 'dmc')!,
      contacts.find((c) => c.id === 'police')!,
    ].filter(Boolean);
  }

  if (category === 'STREETLIGHT') {
    return [
      contacts.find((c) => c.id === 'ceb-electricity')!,
      contacts.find((c) => c.id === 'leco')!,
      contacts.find((c) => c.id === 'police')!,
    ].filter(Boolean);
  }

  if (category === 'DRAINAGE') {
    return [
      contacts.find((c) => c.id === 'dmc')!,
      contacts.find((c) => c.id === 'fire')!,
      contacts.find((c) => c.id === 'nwsdb-water')!,
    ].filter(Boolean);
  }

  if (category === 'TRAFFIC' || category === 'ROAD') {
    return [
      contacts.find((c) => c.id === 'police')!,
      contacts.find((c) => c.id === 'suwa-seriya')!,
      contacts.find((c) => c.id === 'dmc')!,
    ].filter(Boolean);
  }

  if (category === 'ACCIDENT') {
    return [
      contacts.find((c) => c.id === 'suwa-seriya')!,
      contacts.find((c) => c.id === 'police')!,
      contacts.find((c) => c.id === 'colombo-nh-accident')!,
    ].filter(Boolean);
  }

  if (severity === 'CRITICAL') {
    return [
      contacts.find((c) => c.id === 'police')!,
      contacts.find((c) => c.id === 'suwa-seriya')!,
      contacts.find((c) => c.id === 'dmc')!,
      contacts.find((c) => c.id === 'fire')!,
    ].filter(Boolean);
  }

  return [
    contacts.find((c) => c.id === 'police')!,
    contacts.find((c) => c.id === 'suwa-seriya')!,
    contacts.find((c) => c.id === 'dmc')!,
  ].filter(Boolean);
}
