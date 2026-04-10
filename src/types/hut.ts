/** Public fields shown on an operator HUT page */
export type HutPublicProfile = {
  id: string;
  company_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  profile_photo_url: string | null;
  hut_experience: string | null;
  area_of_operation: string | null;
  created_at: string;
};
