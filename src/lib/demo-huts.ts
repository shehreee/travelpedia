import type { HutPublicProfile } from "@/types/hut";
import { toHutSlug } from "@/lib/hut-slug";

/** Matches demo tour operator_id values in demo-tours.ts */
export const DEMO_OPERATOR_IDS = {
  summit: "00000000-0000-0000-0000-000000000001",
  northbound: "00000000-0000-0000-0000-000000000002",
  greenPeak: "00000000-0000-0000-0000-000000000003",
  riverstone: "00000000-0000-0000-0000-000000000004",
  baltistan: "00000000-0000-0000-0000-000000000005",
  snowline: "00000000-0000-0000-0000-000000000006",
  glacier: "00000000-0000-0000-0000-000000000007",
  alpineLink: "00000000-0000-0000-0000-000000000008",
  alpineArc: "00000000-0000-0000-0000-000000000009",
  glacierNest: "00000000-0000-0000-0000-000000000010",
} as const;

const demoHuts: HutPublicProfile[] = [
  {
    id: DEMO_OPERATOR_IDS.summit,
    company_name: "Summit Trails Co.",
    full_name: "Ahmed Khan",
    email: "hello@summittrails.demo",
    phone: "+92 300 1112233",
    profile_photo_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    hut_experience:
      "Operating group departures across Northern Pakistan since 2016. Specialized in Hunza and Skardu fixed-date tours with vetted hotels and transport.",
    area_of_operation: "Gilgit-Baltistan, Kaghan–Naran, Islamabad departures",
    created_at: "2016-03-01T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.northbound,
    company_name: "Northbound Escapes",
    full_name: "Sara Malik",
    email: "bookings@northbound.demo",
    phone: "+92 301 2223344",
    profile_photo_url:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop",
    hut_experience:
      "Full-service tour design for families and corporate groups. Strong focus on safety briefings and transparent pricing.",
    area_of_operation: "Skardu, Chitral, Kalash, nationwide departures",
    created_at: "2018-07-15T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.greenPeak,
    company_name: "Green Peak Adventures",
    full_name: "Omar Farooq",
    email: "ops@greenpeak.demo",
    phone: "+92 302 3334455",
    profile_photo_url:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=400&fit=crop",
    hut_experience:
      "Trekking-led itineraries and camping logistics. Team includes certified local guides for high-altitude routes.",
    area_of_operation: "Fairy Meadows, Astore, Deosai access routes",
    created_at: "2019-01-10T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.riverstone,
    company_name: "Riverstone Adventures",
    full_name: "Hina Tariq",
    email: "trips@riverstone.demo",
    phone: "+92 303 4445566",
    profile_photo_url:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop",
    hut_experience:
      "Weekend escapes and family-friendly valley tours. Known for clear communication and flexible payment plans.",
    area_of_operation: "Swat, Naran, Murree–Galiyat",
    created_at: "2017-11-20T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.baltistan,
    company_name: "Baltistan Gateways",
    full_name: "Yasir Hussain",
    email: "contact@baltistan.demo",
    phone: "+92 304 5556677",
    profile_photo_url:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
    hut_experience:
      "Heritage and culture-focused trips in Baltistan with local homestay partners where available.",
    area_of_operation: "Skardu, Khaplu, Shigar",
    created_at: "2020-05-01T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.snowline,
    company_name: "Snowline Journeys",
    full_name: "Bilal Ahmed",
    email: "info@snowline.demo",
    phone: "+92 305 6667788",
    profile_photo_url:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=400&fit=crop",
    hut_experience:
      "Camping-heavy itineraries with equipment included. Kumrat and northern camping specialists.",
    area_of_operation: "Kumrat, Dir, upper Khyber Pakhtunkhwa",
    created_at: "2021-02-14T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.glacier,
    company_name: "Glacier Routes",
    full_name: "Nadia Jamil",
    email: "routes@glacier.demo",
    phone: "+92 306 7778899",
    profile_photo_url:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop",
    hut_experience:
      "Photography-friendly departures with extra time at viewpoints. Small groups (12–16 guests).",
    area_of_operation: "Astore, Rama Meadows, Babusar",
    created_at: "2019-09-01T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.alpineLink,
    company_name: "Alpine Link",
    full_name: "Fahad Sheikh",
    email: "sales@alpinelink.demo",
    phone: "+92 307 8889900",
    profile_photo_url:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop",
    hut_experience:
      "Neelum Valley and cross-border style scenic loops from Islamabad and Lahore.",
    area_of_operation: "Azad Kashmir, Neelum, Murree",
    created_at: "2018-04-22T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.alpineArc,
    company_name: "Alpine Arc Travels",
    full_name: "Rabia Noor",
    email: "hello@alpinearc.demo",
    phone: "+92 308 9990011",
    profile_photo_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    hut_experience:
      "Short breaks and long weekends from major cities. Emphasis on comfort hotels and predictable timings.",
    area_of_operation: "Murree, Ayubia, Patriata",
    created_at: "2022-01-05T00:00:00.000Z",
  },
  {
    id: DEMO_OPERATOR_IDS.glacierNest,
    company_name: "GlacierNest Expeditions",
    full_name: "Usman Ali",
    email: "expeditions@glaciernest.demo",
    phone: "+92 309 0001122",
    profile_photo_url:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop",
    hut_experience:
      "4x4-supported remote routes for experienced travelers. Minimarg and Domel-focused logistics.",
    area_of_operation: "Astore, Deosai periphery, remote GB routes",
    created_at: "2020-08-30T00:00:00.000Z",
  },
];

export function getDemoHutByOperatorId(operatorId: string): HutPublicProfile | null {
  return demoHuts.find((h) => h.id === operatorId) ?? null;
}

export function listDemoHutOperatorIds(): string[] {
  return demoHuts.map((h) => h.id);
}

export function getDemoHutBySlug(slug: string): HutPublicProfile | null {
  const s = slug.trim().toLowerCase();
  return (
    demoHuts.find((h) => toHutSlug(h.company_name || h.full_name || "") === s) ?? null
  );
}
