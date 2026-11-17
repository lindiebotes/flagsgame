import localFallbacks from '../data/flagLocalFallbacks.json';

export function getFlagSources(url: string) {
  const thumbnail = url.replace(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f]\/.[0-9a-f]{1}\/)([^/]+\.svg)$/i, (_match, base, path, name) => `${base}thumb/${path}${name}/960px-${name}.png`);
  const smaller = thumbnail.replace('/960px-', '/640px-');
  const local = (localFallbacks as Record<string, string>)[url];
  return [...new Set([thumbnail, smaller, url, ...(local ? [local] : [])])];
}
