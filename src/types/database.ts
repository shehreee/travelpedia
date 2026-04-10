export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: "operator" | "admin";
  approval_status: "pending" | "approved" | "rejected";
  company_name: string | null;
  /** Public HUT logo / profile image URL */
  profile_photo_url?: string | null;
  /** Short bio / experience text for HUT */
  hut_experience?: string | null;
  /** Regions served, shown on HUT */
  area_of_operation?: string | null;
  created_at: string;
};

export type Tour = {
  id: string;
  operator_id: string;
  listing_company: string;
  destination: string;
  departure_city: string;
  departure_date: string;
  return_date: string;
  duration: string;
  price: number;
  seats_total: number | null;
  seats_remaining: number | null;
  itinerary: string | null;
  itinerary_pdf_path: string | null;
  inclusions: string | null;
  exclusions: string | null;
  cancellation_policy: string | null;
  whatsapp_contact: string | null;
  status: "pending" | "active" | "closed";
  created_at: string;
};

export type TourWithOperator = Tour;

export type Inquiry = {
  id: string;
  tour_id: string;
  operator_id: string;
  name: string;
  phone: string;
  message: string | null;
  seats_requested: number;
  created_at: string;
};
