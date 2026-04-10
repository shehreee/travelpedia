/** Marketplace listing categories (tours as listings). Values match DB `listing_category`. */
export const LISTING_CATEGORIES = [
  { value: "group_tour", label: "Group tour" },
  { value: "adventure", label: "Adventure" },
  { value: "family", label: "Family" },
  { value: "weekend", label: "Weekend getaway" },
  { value: "cultural", label: "Cultural" },
  { value: "honeymoon", label: "Honeymoon" },
] as const;

export type ListingCategoryValue = (typeof LISTING_CATEGORIES)[number]["value"];

export function listingCategoryLabel(value: string | null | undefined): string {
  if (!value) return "Tour";
  const found = LISTING_CATEGORIES.find((c) => c.value === value);
  return found?.label ?? value;
}
