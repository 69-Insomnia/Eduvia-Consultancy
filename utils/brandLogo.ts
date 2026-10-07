import logoAsset from '../assets/logo.png';

/**
 * URL of the logo bundled with the app — the fallback whenever CMS settings
 * have no logo (or point at one that never got uploaded).
 *
 * Depending on the bundler a static image import arrives either as a plain URL
 * string or as Next's structured image object (`{ src, height, width }`).
 * Rendering the object straight into `src` yields the literal string
 * "[object Object]", which the browser then fails to load — so every consumer
 * needs the string form.
 */
const bundledLogo: string =
  typeof logoAsset === 'string' ? logoAsset : ((logoAsset as any)?.src ?? '/logo.png');

export default bundledLogo;
