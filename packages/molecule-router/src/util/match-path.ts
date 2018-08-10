import pathToRegexp from './path-to-regexp';

export interface Match {
  path: string;
  url: string;
  isExact: boolean;
  params: { [key: string]: any };
}

export interface MatchOptions {
  path?: string;
  strict?: boolean;
  exact?: boolean;
  sensitive?: boolean;
}

export interface CompiledPattern {
  re: RegExp;
  keys: any[];
}

const patternCache: { [key: string]: { [key: string]: CompiledPattern } } = {};
const cacheLimit = 10000;
let cacheCount = 0;

const compilePath = (
  pattern: string,
  options: { end: boolean; strict: boolean; sensitive: boolean },
) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  const keys: any[] = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 */
const matchPath = (
  pathname: string,
  options: MatchOptions = {},
  parent: Match,
): Match | null => {
  if (typeof options === 'string') options = { path: options };

  const { path, exact = false, strict = false, sensitive = false } = options;

  if (path == null) return parent;

  const { re, keys } = compilePath(path, { strict, sensitive, end: exact });
  const match = re.exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path, // the path pattern used to match
    isExact, // whether or not we matched exactly
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    params: keys.reduce(
      (memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      },
      //
      {},
    ),
  };
};

export default matchPath;
