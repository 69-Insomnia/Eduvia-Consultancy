'use client';

import { useState } from 'react';

/**
 * An `<img>` that walks a candidate list and degrades to `fallback`.
 *
 * Seeded records store media under a dead `/images/` prefix, so a stored URL is
 * not trustworthy on its own — see `blogImageCandidates` / `teamImageCandidates`
 * in `utils/imageAssets.js`. This is the list-friendly form of the chain that
 * CountryCard and UniversityCard each hand-roll: pass every URL worth trying,
 * most-trusted first, and a node to render once they are all exhausted.
 */
export default function SmartImage({
  candidates,
  alt = '',
  className,
  fallback = null,
  ...rest
}: any) {
  const list = (candidates || []).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const src = list[index];
  if (!src || failed) return fallback;

  const handleError = () => {
    if (index + 1 < list.length) setIndex(index + 1);
    else setFailed(true);
  };

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}
