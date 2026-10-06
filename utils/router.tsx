'use client';

// react-router-dom compatibility layer for the Next.js App Router port.
// Converted files import these symbols from here with the same names and
// call signatures they used in react-router, so page/component bodies stay
// untouched. Only the import specifier changed (see the port notes).
import { useEffect } from 'react';
import NextLink from 'next/link';
import {
  usePathname,
  useParams as useNextParams,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';

type NavigateOptions = { replace?: boolean; state?: any };

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, opts?: NavigateOptions) => {
    if (typeof to === 'number') {
      router.back();
      return;
    }
    if (opts?.replace) router.replace(to);
    else router.push(to);
  };
}

export { useNextParams as useParams };

export function useLocation() {
  const pathname = usePathname();
  return { pathname, search: '', hash: '' };
}

export function useSearchParams(): [
  URLSearchParams,
  (next: any, opts?: NavigateOptions) => void,
] {
  const sp = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = sp ?? new URLSearchParams();

  const setSearchParams = (next: any) => {
    let nextParams: URLSearchParams;
    if (typeof next === 'function') {
      nextParams = next(new URLSearchParams(params));
    } else if (next instanceof URLSearchParams) {
      nextParams = next;
    } else {
      nextParams = new URLSearchParams();
      Object.entries(next || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) nextParams.append(k, String(v));
      });
    }
    const qs = nextParams.toString();
    // react-router's setSearchParams never scrolls the page.
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return [params, setSearchParams];
}

function toHref(to: any): string {
  if (to && typeof to === 'object') {
    return `${to.pathname || '/'}${to.search || ''}${to.hash || ''}`;
  }
  return to;
}

export function Link({ to, replace, state, reloadDocument, preventScrollReset, relative, ...rest }: any) {
  return <NextLink href={toHref(to)} {...rest} />;
}

export function NavLink({
  to,
  end,
  className,
  style,
  children,
  replace,
  state,
  reloadDocument,
  preventScrollReset,
  relative,
  ...rest
}: any) {
  const pathname = usePathname();
  const href = toHref(to);
  const isActive = end
    ? pathname === href
    : href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(href + '/');

  const cls = typeof className === 'function' ? className({ isActive, isPending: false, isTransitioning: false }) : className;
  const st = typeof style === 'function' ? style({ isActive, isPending: false, isTransitioning: false }) : style;
  const child = typeof children === 'function' ? children({ isActive, isPending: false, isTransitioning: false }) : children;

  return (
    <NextLink href={href} className={cls} style={st} {...rest}>
      {child}
    </NextLink>
  );
}

export function Navigate({ to, replace }: any) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(toHref(to));
    else router.push(toHref(to));
  }, [to, replace]);
  return null;
}
