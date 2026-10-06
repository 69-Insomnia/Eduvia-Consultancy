import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import defaultLogo from '../../assets/logo.png';

/**
 * Brand mark.
 *
 * `src` normally comes from CMS settings, which may point at a file that has
 * not been uploaded yet. When that URL fails we fall back to the logo bundled
 * with the app (src/assets/logo.png) before giving up on the icon placeholder.
 */
export default function Logo({
  src = defaultLogo,
  className = '',
  imageClassName = 'h-11 w-auto max-w-[190px] object-contain',
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  // Settings load asynchronously, so `src` can change after mount.
  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== defaultLogo) {
      setCurrentSrc(defaultLogo);
      return;
    }
    setFailed(true);
  };

  return (
    <span className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      {!failed ? (
        <img
          src={currentSrc}
          alt="Eduvia Consultancy Pvt. Ltd."
          className={imageClassName}
          onError={handleError}
        />
      ) : (
        <>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600">
            <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-bold tracking-tight text-primary-500">
              Eduvia
            </span>
            <span className="mt-1 block text-[10px] tracking-wide text-dark-400">
              Consultancy Pvt. Ltd.
            </span>
          </span>
        </>
      )}
    </span>
  );
}
