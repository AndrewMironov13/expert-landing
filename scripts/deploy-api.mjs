/* Деплой dist/ в ветку gh-pages через Git Data API (git push с этой машины виснет).
   Загружаются только блобы, которых нет в текущем дереве gh-pages по тому же пути и sha. */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { createHash } from 'node:crypto'

const OWNER = 'AndrewMironov13', REPO = 'expert-landing', BRANCH = 'gh-pages'
const DIST = process.argv[2] || 'dist'
const TOKEN = process.env.GH_TOKEN
if (!TOKEN) throw new Error('GH_TOKEN не задан')
const API = `https://api.github.com/repos/${OWNER}/${REPO}`
const gh = async (path, init = {}) => {
  const r = await fetch(API + path, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path}: ${r.status} ${await r.text()}`)
  return r.json()
}
const blobSha = (buf) => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex')
const walk = (dir) => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p] })

const head = await gh(`/branches/${BRANCH}`)
const parent = head.commit.sha
const oldTree = await gh(`/git/trees/${head.commit.commit.tree.sha}?recursive=1`)
const existing = new Map(oldTree.tree.filter((t) => t.type === 'blob').map((t) => [t.path, t.sha]))
console.log(`gh-pages: ${parent.slice(0, 7)}, в дереве ${existing.size} файлов`)

const files = walk(DIST).map((p) => relative(DIST, p)).sort()
const tree = []
let uploaded = 0, reused = 0, bytes = 0
for (const path of files) {
  const buf = readFileSync(join(DIST, path))
  const sha = blobSha(buf)
  if (existing.get(path) === sha || [...existing.values()].includes(sha)) {
    reused++
  } else {
    const b = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: buf.toString('base64'), encoding: 'base64' }) })
    if (b.sha !== sha) throw new Error(`sha mismatch ${path}`)
    uploaded++; bytes += buf.length
    console.log(`  ↑ ${path} (${(buf.length / 1024).toFixed(0)} КБ)`)
  }
  tree.push({ path, mode: '100644', type: 'blob', sha })
}
/* .nojekyll сохраняем, если был */
if (existing.has('.nojekyll') && !files.includes('.nojekyll')) tree.push({ path: '.nojekyll', mode: '100644', type: 'blob', sha: existing.get('.nojekyll') })

const newTree = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ tree }) })
const msg = `Deploy dist to GitHub Pages (via API): ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`
const commit = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message: msg, tree: newTree.sha, parents: [parent] }) })
await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) })
console.log(`коммит ${commit.sha.slice(0, 7)}: загружено ${uploaded} файлов (${(bytes / 1024).toFixed(0)} КБ), переиспользовано ${reused}`)
await gh('/pages/builds', { method: 'POST' })
console.log('сборка Pages запущена')
