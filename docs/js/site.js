// only place the repo is set
const REPO = 'ZyBye/ripple-replays'
const GH = `https://github.com/${REPO}`
// cache so visitors dont burn githubs rate limit
const CACHE_KEY = 'ripple-releases'
const CACHE_TTL = 10 * 60 * 1000

document.querySelectorAll('[data-gh]').forEach((a) => {
  a.href = `${GH}/${a.dataset.gh}`.replace(/\/$/, '')
})

async function getReleases() {
  try {
    const hit = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (hit && Date.now() - hit.t < CACHE_TTL) return hit.data
  } catch {}
  // html media type returns notes already rendered and sanitized
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=30`, {
    headers: { Accept: 'application/vnd.github.html+json' },
  })
  if (!res.ok) throw Object.assign(new Error('github'), { status: res.status })
  const data = await res.json()
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }))
  } catch {}
  return data
}
