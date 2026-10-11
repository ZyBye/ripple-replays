const heights = [
  34, 46, 40, 58, 44, 36, 52, 60, 42, 38, 55, 48, 34, 50, 62, 44, 40, 56, 46, 38, 52, 58, 42, 36, 48, 54, 40,
  60, 44, 50, 38, 56,
]

const bars = heights.map((h) => `<i style="height:${h}px"></i>`).join('')
document.getElementById('track').innerHTML = bars + bars

const isInstaller = (a) => /\.exe$/i.test(a.name)

getReleases()
  .then((list) => {
    const withExe = list.filter((r) => !r.draft && (r.assets || []).some(isInstaller))
    const rel = withExe.find((r) => !r.prerelease) || withExe[0]
    if (!rel) return
    const exe = rel.assets.find(isInstaller)
    document.querySelectorAll('[data-release]').forEach((a) => (a.href = exe.browser_download_url))
    const mb = (exe.size / 1048576).toFixed(0)
    document.getElementById('meta').textContent =
      `Version ${rel.tag_name.replace(/^v/, '')}, ${mb} MB, Windows 10 or 11 (64-bit)`
  })
  .catch(() => {})
