import { useState } from 'react';
import { destinationFlag } from '../../utils/imageAssets';

/**
 * Country flag with an ISO-code text fallback.
 *
 * Replaces the flag emoji used previously: Windows ships no flag glyphs, so
 * browsers fall back to drawing the two regional-indicator letters as plain
 * text — you get "AU" and "CA" instead of flags. A real image with a code
 * fallback renders correctly on every platform.
 *
 * Pass `className` for size/shape (e.g. `h-6 w-9`); the radius and object-fit
 * are applied here.
 */
export default function CountryFlag({ slug, code, className = '', label }) {
  const [failed, setFailed] = useState(false);
  const src = destinationFlag(slug);

  if (!src || failed) {
    return (
      <span
        className={`flex items-center justify-center overflow-hidden rounded bg-dark-100 text-[10px] font-semibold uppercase text-dark-500 ${className}`}
        aria-hidden="true"
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={label ? `${label} flag` : ''}
      aria-hidden={label ? undefined : 'true'}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded object-cover ring-1 ring-inset ring-black/5 ${className}`}
    />
  );
}
