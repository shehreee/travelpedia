import { TourCard } from "@/components/TourCard";
import { HutProfilePhoto } from "@/components/HutProfilePhoto";
import { formatDate } from "@/lib/format";
import { fetchHutByIdentifier } from "@/lib/hut-query";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { profile } = await fetchHutByIdentifier(id);
  const name = profile?.company_name?.trim() || profile?.full_name?.trim() || "Operator";
  return {
    title: `${name} — HUT | Travelpedia`,
    description: profile?.hut_experience?.slice(0, 155) || `View trips and contact ${name} on Travelpedia.`,
  };
}

export default async function HutPage({ params }: Props) {
  const { id } = await params;
  const { profile, tours, error } = await fetchHutByIdentifier(id);

  if (!profile) {
    notFound();
  }

  const displayName = profile.company_name?.trim() || profile.full_name?.trim() || "Tour operator";
  const wa = profile.phone?.replace(/\D/g, "");
  const waHref = wa && wa.length >= 10 ? `https://wa.me/${wa}` : null;
  const memberSince = profile.created_at ? formatDate(profile.created_at.slice(0, 10)) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="text-sm text-tp-muted">
        <Link href="/tours" className="font-medium text-tp-blue hover:underline">
          Browse tours
        </Link>
        <span className="mx-2">/</span>
        <span className="text-tp-text">HUT</span>
      </nav>

      {error && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Some data could not be loaded: {error}
        </p>
      )}

      <header className="mt-6 overflow-hidden rounded-2xl border border-tp-border bg-white shadow-sm">
        <div className="bg-gradient-to-r from-tp-navy to-tp-blue px-6 py-8 text-white sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/75">Travelpedia HUT</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{displayName}</h1>
          {memberSince && (
            <p className="mt-2 text-sm text-white/85">Member since {memberSince}</p>
          )}
        </div>
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:gap-10 sm:p-8">
          <HutProfilePhoto src={profile.profile_photo_url} alt={displayName} />
          <div className="min-w-0 flex-1 space-y-4">
            {profile.area_of_operation?.trim() && (
              <div>
                <h2 className="text-xs font-semibold uppercase text-tp-muted">Area of operation</h2>
                <p className="mt-1 text-sm text-tp-text">{profile.area_of_operation.trim()}</p>
              </div>
            )}
            {profile.hut_experience?.trim() && (
              <div>
                <h2 className="text-xs font-semibold uppercase text-tp-muted">Experience &amp; story</h2>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-tp-text">
                  {profile.hut_experience.trim()}
                </p>
              </div>
            )}
            {!profile.hut_experience?.trim() && !profile.area_of_operation?.trim() && (
              <p className="text-sm text-tp-muted">
                This operator has not added a full HUT description yet. You can still browse their trips
                below.
              </p>
            )}
            <div>
              <h2 className="text-xs font-semibold uppercase text-tp-muted">Contact</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {profile.email?.trim() && (
                  <li>
                    <a
                      href={`mailto:${profile.email.trim()}`}
                      className="font-medium text-tp-blue hover:underline"
                    >
                      {profile.email.trim()}
                    </a>
                  </li>
                )}
                {profile.phone?.trim() && (
                  <li>
                    <a href={`tel:${profile.phone.trim()}`} className="text-tp-text hover:text-tp-blue">
                      {profile.phone.trim()}
                    </a>
                  </li>
                )}
                {!profile.email?.trim() && !profile.phone?.trim() && (
                  <li className="text-tp-muted">Contact details not listed.</li>
                )}
              </ul>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-tp-navy sm:text-2xl">Current trips</h2>
        <p className="mt-1 text-sm text-tp-muted">Live listings and upcoming departures.</p>
        {tours.live.length === 0 ? (
          <p className="mt-6 text-sm text-tp-muted">No active trips right now.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {tours.live.map((t) => (
              <TourCard key={t.id} tour={t} hideHutLink />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-tp-border pt-12">
        <h2 className="text-xl font-bold text-tp-navy sm:text-2xl">Past trips</h2>
        <p className="mt-1 text-sm text-tp-muted">Archived or completed departures.</p>
        {tours.past.length === 0 ? (
          <p className="mt-6 text-sm text-tp-muted">No past trips listed yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {tours.past.map((t) => (
              <TourCard key={t.id} tour={t} hideHutLink />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
