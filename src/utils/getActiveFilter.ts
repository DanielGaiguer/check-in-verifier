export function getActiveFilter(url: URL) {
  const activeParam = url.searchParams.get("active")
  return activeParam !== "false"
}