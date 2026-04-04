import { TourForm } from "@/components/operator/TourForm";

export default function NewTourPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">New tour</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Submit structured details. After admin approval your tour goes live for travelers.
      </p>
      <div className="mt-6">
        <TourForm />
      </div>
    </div>
  );
}
