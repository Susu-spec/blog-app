export function shouldUseCache(cacheArray) {
  return Array.isArray(cacheArray) && cacheArray.length > 0;
}

export function shouldUseDetailsCache(cacheObj, slug) {
  return cacheObj?.[slug];
}
