const out = document.getElementById('out')

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const mb = (bytes) => `${(bytes / 1048576).toFixed(0)} MB`

function fail(text) {
  out.innerHTML = `<div class="msg">${text} You can also read the notes on <a href="${GH}/releases">GitHub</a>.</div>`
}

function render(list) {
  const releases = list.filter((r) => !r.draft)
  if (!releases.length) return fail('No releases have been published yet.')

  out.innerHTML = releases
    .map((r, i) => {
      const exe = (r.assets || []).find((a) => /\.exe$/i.test(a.name))
      const date = new Date(r.published_at || r.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      const tag = r.prerelease
        ? '<span class="tag pre">Pre-release</span>'
        : i === 0
          ? '<span class="tag">Latest</span>'
          : ''
      const download = exe
        ? `<a class="dlink" href="${esc(exe.browser_download_url)}">Download installer (${mb(exe.size)})</a>`
        : ''
      return `<article class="rel" id="${esc(r.tag_name)}">
      <div class="ver">${esc(r.tag_name)}<time datetime="${esc(r.published_at || '')}">${date}</time>${tag}</div>
      <div><div class="notes">${r.body_html || '<p>No notes for this release.</p>'}</div>${download}</div>
    </article>`
    })
    .join('')

  out.querySelectorAll('.notes a').forEach((a) => {
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
  })
}

getReleases()
  .then(render)
  .catch((e) =>
    fail(
      e.status === 403 || e.status === 429
        ? "GitHub is limiting requests right now, so the releases can't load. Try again in a few minutes."
        : "The releases couldn't be loaded. Check your connection and refresh.",
    ),
  )
