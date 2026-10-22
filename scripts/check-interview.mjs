import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root), 'utf8')
const assertClean = (content, path) => {
  assert(!content.includes(String.fromCodePoint(0x63a8, 0x5bfc)), `${path}: 仍有待移除字样`)
  assert(!/原题号|原始题号|原始编号|编号缺口/.test(content), `${path}: 仍有旧编号说明`)
}
const source = await read('面试题整理_完整版.md')
assertClean(source, '题目清单')
assertClean(await read('README.md'), 'README.md')
const sections = [...source.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
const metadataSource = await read('docs/.vitepress/interview.ts')
const metadata = JSON.parse(metadataSource.match(/interviewCategories = ([\s\S]*?) as const/)[1])
assert.equal(sections.length, 35, '分类数变化，请同步更新题库')
assert.equal(metadata.length, sections.length, '分类元信息数量不一致')

const seen = new Set()
let nextId = 1
for (const [index, section] of sections.entries()) {
  const category = metadata[index]
  const questions = [...section[2].matchAll(/^(\d+)\. (.+)\r?$/gm)]
  const page = await read(`docs/interview/${category.slug}.md`)
  assertClean(page, category.slug)
  const entries = [...page.matchAll(/^## (\d+)\. (.+) \{#q-(\d+)\}\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
  assert.equal(category.title, section[1].replace(/（\d+.*$/, '').split('——').at(-1))
  assert.equal(entries.length, questions.length, `${category.slug}: 题数不一致`)
  assert.equal(category.count, questions.length, `${category.slug}: 元信息题数不一致`)
  assert.equal(category.start, nextId, `${category.slug}: 分类起始题号不连续`)
  assert.equal(category.end, nextId + questions.length - 1, `${category.slug}: 分类结束题号不一致`)
  assert(section[1].endsWith(`（${category.start}–${category.end}，共 ${category.count} 题）`), `${category.slug}: 题目清单分类范围不一致`)
  assert(page.includes(`题号 **${category.start}–${category.end}**`), `${category.slug}: 页首题号范围不一致`)
  for (const [i, question] of questions.entries()) {
    const entry = entries[i]
    const id = nextId++
    assert.equal(Number(question[1]), id, `题目清单题号不连续，期望 ${id}`)
    assert(!seen.has(id), `重复题号 ${id}`)
    seen.add(id)
    assert.equal(Number(entry[1]), id, `分类页题号不连续，期望 ${id}`)
    assert.equal(Number(entry[3]), id, `锚点不一致 ${id}`)
    assert.equal(entry[2].trim(), question[2].trim(), `题目内容变化 ${id}`)
    assert.equal((entry[4].match(/\*\*参考答案：\*\*/g) || []).length, 1, `题目 ${id} 缺少或重复答案`)
    const answer = entry[4].split('**参考答案：**')[1].trim()
    assert(answer.length >= 40, `题目 ${id} 答案过短`)
    assert(!/TODO|待补充答案|答案待完善/.test(answer), `题目 ${id} 含占位答案`)
  }
}
assert.equal(seen.size, 693)
const expected = Array.from({ length: 693 }, (_, i) => i + 1)
assert.deepEqual([...seen], expected, '展示题号必须从 1 到 693 连续且不重复')
const pages = (await readdir(new URL('docs/interview/', root))).filter(name => name.endsWith('.md'))
assert.equal(pages.length, 36, '应包含 35 个分类页和一个总览页')
const overview = await read('docs/interview/index.md')
assertClean(overview, '分类总览')
for (const category of metadata) {
  assert(overview.includes(`](./${category.slug})：${category.count} 题，题号 ${category.start}–${category.end}。`), `总览缺少或错配 ${category.slug}`)
}
console.log(`面试题校验通过：${metadata.length} 个分类，题号 1–${seen.size} 连续不跳号，原题、独立答案和锚点一一对应。`)
