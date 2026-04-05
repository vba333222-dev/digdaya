// ─────────────────────────────────────────────
// SITE CONTENT — Types & Default Data
// Extracted from the REAL public pages. This is the single source of truth.
// ─────────────────────────────────────────────

// ── Homepage Service Cards (Services.tsx) ──
export interface HomeService {
    num: string;
    title: string;
    items: string[];
    accent: string;
    description: string;
    imageId: string;
}

// ── Detailed Services (ServicesPage.tsx) ──
export interface DetailedService {
    id: string;
    title: string;
    short: string;
    tags: string[];
    body: string;
    deliverables: string[];
    duration: string;
    accent: string;
    accentLight: string;
}

// ── Projects (Projects.tsx) ──
export interface Project {
    id: string;
    title: string;
    category: string;
    tags: string[];
    year: string;
    desc: string;
    accent: string;
    accentText: string;
    featured: boolean;
}

// ── Hero Content ──
export interface HeroContent {
    lines: { text: string; style: 'outline' | 'filled' }[];
    subtitle: string;
}

// ── Site Settings ──
export interface SiteSettings {
    siteName: string;
    tagline: string;
    siteUrl: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    socialLinks: { platform: string; url: string }[];
    seoDefaults: {
        metaTitle: string;
        metaDescription: string;
        ogImage: string;
    };
    analyticsId: string;
    maintenance: boolean;
}

// ── Message (contact form submissions) ──
export interface Message {
    id: string;
    senderName: string;
    senderEmail: string;
    companyName: string;
    subject: string;
    body: string;
    priority: 'high' | 'medium' | 'low';
    status: 'unread' | 'read' | 'replied' | 'archived';
    receivedAt: string;
}

// ── Aggregate Store Type ──
export interface SiteContent {
    homeServices: HomeService[];
    services: DetailedService[];
    projects: Project[];
    hero: HeroContent;
    settings: SiteSettings;
    messages: Message[];
}

// ═══════════════════════════════════════════════
// DEFAULT DATA (extracted from actual public pages)
// ═══════════════════════════════════════════════

const ORANGE = '#F26522';

export const defaultHomeServices: HomeService[] = [
    {
        num: '01',
        title: 'HARDWARE &\nINFRA',
        items: ['Semiconductor', 'Computer Assembly', 'Special Machinery', 'Measuring Instruments'],
        accent: '#F26522',
        description: 'Building the physical backbone of modern technology infrastructure.',
        imageId: 'r9oezyka89xjs8gnnnoc',
    },
    {
        num: '02',
        title: 'CONNECTIVITY',
        items: ['Wireless & Satellite', 'IoT Consulting'],
        accent: '#FFFFFF',
        description: 'Bridging the gap between devices, networks and people.',
        imageId: 'uhhynxanvd8avfeeajj3',
    },
    {
        num: '03',
        title: 'SECURITY &\nTRUST',
        items: ['InfoSec Consulting', 'Digital Identity', 'Electronic Certificates'],
        accent: '#F26522',
        description: 'Fortifying digital ecosystems with unbreakable trust layers.',
        imageId: 'hloc1zsblucjgfchd0e9',
    },
    {
        num: '04',
        title: 'SOFTWARE &\nTECH',
        items: ['Blockchain', 'Immersive Media (VR/AR)', 'Data Processing', 'Hosting', 'Web Portals'],
        accent: '#FFFFFF',
        description: 'Crafting intelligent systems that power the next generation.',
        imageId: 'f0hps0zc22jtls7c9mz5',
    },
    {
        num: '05',
        title: 'CREATIVE\nCONSULTING',
        items: ['Engineering Consulting', 'Multimedia Services', 'Advertising'],
        accent: '#F26522',
        description: 'Where strategic vision meets creative execution.',
        imageId: 'hlj4trbjlz53ivtgyuvs',
    },
];

export const defaultServices: DetailedService[] = [
    {
        id: '01',
        title: 'Platform Engineering',
        short: 'Build',
        tags: ['Backend', 'API Design', 'Cloud Infra', 'DevOps'],
        body: 'We architect and engineer B2B platforms that hold under real production pressure — distributed systems, event-driven architecture, and infrastructure that scales without ceremony.',
        deliverables: ['System Architecture', 'API Development', 'CI/CD Pipelines', 'Cloud Infrastructure', 'Performance Tuning'],
        duration: '8–24 wks',
        accent: '#1a3a6b',
        accentLight: '#4f8fff',
    },
    {
        id: '02',
        title: 'Product Design',
        short: 'Design',
        tags: ['UX Research', 'UI Systems', 'Prototyping', 'Figma'],
        body: 'Brutalist by conviction — every design decision is structural, not decorative. We build design systems that scale across products and teams without losing coherence.',
        deliverables: ['Design System', 'UI/UX Flows', 'Interactive Prototypes', 'Component Library', 'Design Tokens'],
        duration: '4–12 wks',
        accent: '#3a1a00',
        accentLight: ORANGE,
    },
    {
        id: '03',
        title: 'IoT & Embedded Systems',
        short: 'Connect',
        tags: ['Firmware', 'Edge Computing', 'Protocols', 'RTOS'],
        body: 'From microcontroller firmware to cloud telemetry pipelines — we close the gap between the physical and the digital. Industrial-grade reliability, engineered from both ends.',
        deliverables: ['Firmware Development', 'Edge Infrastructure', 'Protocol Integration', 'Sensor Systems', 'OTA Updates'],
        duration: '12–32 wks',
        accent: '#001a12',
        accentLight: '#22c55e',
    },
    {
        id: '04',
        title: 'Brand Identity',
        short: 'Identity',
        tags: ['Strategy', 'Visual Identity', 'Motion', 'Print'],
        body: 'Identity as infrastructure. We construct brand systems that operate across every touchpoint — from product UI to physical signage — with structural precision.',
        deliverables: ['Brand Strategy', 'Visual Identity', 'Motion Guidelines', 'Brand Book', 'Asset Systems'],
        duration: '4–8 wks',
        accent: '#1a001a',
        accentLight: '#a855f7',
    },
    {
        id: '05',
        title: 'Data & Intelligence',
        short: 'Analyze',
        tags: ['Analytics', 'ML Systems', 'Dashboards', 'ETL'],
        body: 'Operational intelligence built into your product — not bolted on. We build data pipelines, analytics layers, and ML inference systems that inform decisions at scale.',
        deliverables: ['Data Architecture', 'Analytics Dashboards', 'ML Pipeline', 'ETL Systems', 'Reporting Layer'],
        duration: '6–16 wks',
        accent: '#001a1a',
        accentLight: '#06b6d4',
    },
];

export const defaultProjects: Project[] = [
    {
        id: '01',
        title: 'Nexus B2B Portal',
        category: 'Platform',
        tags: ['Engineering', 'React', 'Node.js'],
        year: '2024',
        desc: 'Enterprise procurement platform handling 10K+ daily transactions across distributed supply chains.',
        accent: '#1a1a2e',
        accentText: '#4f6bff',
        featured: true,
    },
    {
        id: '02',
        title: 'Krakow Design System',
        category: 'System',
        tags: ['Design System', 'Figma', 'Storybook'],
        year: '2024',
        desc: 'Unified component architecture for a 200+ product suite across SEA markets.',
        accent: '#1a0a00',
        accentText: ORANGE,
        featured: false,
    },
    {
        id: '03',
        title: 'Halcyon Dashboard',
        category: 'Interface',
        tags: ['Data Viz', 'D3.js', 'Python'],
        year: '2023',
        desc: 'Real-time logistics intelligence dashboard processing satellite and ground-sensor data.',
        accent: '#001a0a',
        accentText: '#22c55e',
        featured: true,
    },
    {
        id: '04',
        title: 'Void Brand Identity',
        category: 'Identity',
        tags: ['Branding', 'Motion', 'Print'],
        year: '2023',
        desc: 'Complete visual identity for a Jakarta-based fintech challenger brand.',
        accent: '#0a001a',
        accentText: '#a855f7',
        featured: false,
    },
    {
        id: '05',
        title: 'Akar IoT Platform',
        category: 'Platform',
        tags: ['IoT', 'Firmware', 'Cloud'],
        year: '2023',
        desc: 'Industrial sensor mesh connecting 5,000+ edge devices to a centralized monitoring layer.',
        accent: '#001a18',
        accentText: '#06b6d4',
        featured: false,
    },
    {
        id: '06',
        title: 'Fractal Commerce',
        category: 'Platform',
        tags: ['E-commerce', 'Headless', 'CMS'],
        year: '2022',
        desc: 'Headless commerce infrastructure for a multi-brand retail conglomerate across 6 countries.',
        accent: '#1a1500',
        accentText: '#eab308',
        featured: false,
    },
];

export const defaultHero: HeroContent = {
    lines: [
        { text: 'ENGINEERING', style: 'outline' },
        { text: 'THE DIGITAL &', style: 'outline' },
        { text: 'PHYSICAL', style: 'outline' },
        { text: 'FRONTIER', style: 'outline' },
    ],
    subtitle: 'Design · Build · Scale',
};

export const defaultSettings: SiteSettings = {
    siteName: 'Digdaya Teknokraf',
    tagline: 'Engineering the Digital & Physical Frontier',
    siteUrl: 'https://digdaya.id',
    contactEmail: 'hello@digdaya.id',
    phoneNumber: '+62 21 5555 7890',
    address: 'Menara Astra Lt. 45, Jl. Jend. Sudirman Kav. 5-6, Jakarta Pusat 10220',
    socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/digdaya' },
        { platform: 'Instagram', url: 'https://instagram.com/digdaya.id' },
        { platform: 'GitHub', url: 'https://github.com/digdaya' },
    ],
    seoDefaults: {
        metaTitle: 'Digdaya Teknokraf | Engineering the Digital & Physical Frontier',
        metaDescription: 'Indonesia\'s premier engineering collective — hardware, connectivity, security, software, and creative consulting for enterprises that build the future.',
        ogImage: '',
    },
    analyticsId: '',
    maintenance: false,
};

export const defaultMessages: Message[] = [
    {
        id: 'msg-001',
        senderName: 'Budi Santoso',
        senderEmail: 'budi.s@astra.co.id',
        companyName: 'PT Astra International',
        subject: 'Partnership Inquiry — IoT Fleet Management',
        body: 'Dear Digdaya Team,\n\nWe are exploring IoT-based fleet management solutions for our automotive division. We have a fleet of 12,000+ vehicles across Kalimantan and Sumatra that currently lack real-time telemetry.\n\nWould you be available for an initial discovery call next week?\n\nBest regards,\nBudi Santoso\nVP Digital Transformation',
        priority: 'high',
        status: 'unread',
        receivedAt: '2026-04-05T09:30:00Z',
    },
    {
        id: 'msg-002',
        senderName: 'Sarah Chen',
        senderEmail: 'sarah.chen@grab.com',
        companyName: 'Grab Indonesia',
        subject: 'RFP: Driver Verification System',
        body: 'Hi Digdaya,\n\nWe are looking for a partner to build a biometric driver verification system for our Indonesian operations. The system needs to handle 50K+ daily verifications with sub-second response times.\n\nPlease find our RFP attached. Deadline for proposals is April 30.\n\nRegards,\nSarah Chen\nEngineering Manager',
        priority: 'high',
        status: 'unread',
        receivedAt: '2026-04-04T14:15:00Z',
    },
    {
        id: 'msg-003',
        senderName: 'Andi Pratama',
        senderEmail: 'andi@pertamina.com',
        companyName: 'PT Pertamina',
        subject: 'Maintenance Dashboard Proposal',
        body: 'Good morning,\n\nFollowing our meeting at the Jakarta Tech Summit, I want to follow up on your predictive maintenance dashboard solution. Our refineries in Cilacap and Balikpapan need real-time monitoring.\n\nCould you share a detailed proposal and timeline?\n\nThank you,\nAndi Pratama\nHead of Digital Operations',
        priority: 'medium',
        status: 'read',
        receivedAt: '2026-04-03T11:00:00Z',
    },
    {
        id: 'msg-004',
        senderName: 'Maya Wijaya',
        senderEmail: 'maya.w@bri.co.id',
        companyName: 'Bank BRI',
        subject: 'Digital Identity Consulting',
        body: 'Dear Team,\n\nBRI is modernizing our customer identity verification flow for 60M+ accounts. We need consulting on electronic certificates and digital identity infrastructure.\n\nPlease let us know your availability.\n\nBest,\nMaya Wijaya',
        priority: 'medium',
        status: 'unread',
        receivedAt: '2026-04-02T16:45:00Z',
    },
    {
        id: 'msg-005',
        senderName: 'Reza Mahendra',
        senderEmail: 'reza@telkomsel.com',
        companyName: 'Telkomsel',
        subject: 'Brand Refresh Collaboration',
        body: 'Hello Digdaya,\n\nTelkomsel is undergoing a brand evolution for our 5G services. We admire your brutalist design aesthetic and would love to discuss a potential collaboration.\n\nAvailable for a call this Friday?\n\nBest,\nReza Mahendra\nCreative Director',
        priority: 'low',
        status: 'replied',
        receivedAt: '2026-04-01T10:20:00Z',
    },
];

// ── Full default store ──
export const defaultSiteContent: SiteContent = {
    homeServices: defaultHomeServices,
    services: defaultServices,
    projects: defaultProjects,
    hero: defaultHero,
    settings: defaultSettings,
    messages: defaultMessages,
};
