"use client";

type Props = {
  packId: string;
};

/** Lightweight CSS 3D stub hub — not AgentVerse office fidelity. */
export function StubScene({ packId }: Props) {
  return (
    <section aria-label="Stub scene" className="pd-rise">
      <p className="mb-4 text-sm text-[var(--pd-mist)]">
        Scene pack <code className="text-[var(--pd-lime)]">{packId}</code> — stub hub only.
      </p>
      <div className="pd-stub-stage">
        <div className="pd-stub-room">
          <div className="pd-stub-floor" />
          <div className="pd-stub-wall pd-stub-wall-back" />
          <div className="pd-stub-desk" />
          <div className="pd-stub-screen" />
          <div className="pd-stub-glow" />
        </div>
      </div>
      <p className="mt-4 text-sm text-[var(--pd-mist)]">
        Launch apps from Catalog. Full themed scenes land in a later pack swap.
      </p>
    </section>
  );
}
