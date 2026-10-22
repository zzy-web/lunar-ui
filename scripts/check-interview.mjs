import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root), 'utf8')
const source = await read('面试题整理_完整版.md')
const sections = [...source.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
const metadataSource = await read('docs/.vitepress/interview.ts')
const metadata = JSON.parse(metadataSource.match(/interviewCategories = ([\s\S]*?) as const/)[1])
assert.equal(sections.length, 35, '原始分类数变化，请同步更新题库')
assert.equal(metadata.length, sections.length, '分类元信息数量不一致')

const seen = new Set()
for (const [index, section] of sections.entries()) {
  const category = metadata[index]
  const questions = [...section[2].matchAll(/^(\d+)\. (.+)\r?$/gm)]
  const page = await read(`docs/interview/${category.slug}.md`)
  const entries = [...page.matchAll(/^## (\d+)\. (.+) \{#q-(\d+)\}\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
  assert.equal(category.title, section[1].replace(/（\d+.*$/, '').split('——').at(-1))
  assert.equal(entries.length, questions.length, `${category.slug}: 题数不一致`)
  assert.equal(category.count, questions.length, `${category.slug}: 元信息题数不一致`)
  assert.equal(category.start, Number(questions[0][1]))
  assert.equal(category.end, Number(questions.at(-1)[1]))
  for (const [i, question] of questions.entries()) {
    const entry = entries[i]
    const id = Number(question[1])
    assert(!seen.has(id), `重复题号 ${id}`)
    seen.add(id)
    assert.equal(Number(entry[1]), id, `题号顺序变化 ${id}`)
    assert.equal(Number(entry[3]), id, `锚点不一致 ${id}`)
    assert.equal(entry[2].trim(), question[2].trim(), `题目内容变化 ${id}`)
    assert.equal((entry[4].match(/\*\*参考答案：\*\*/g) || []).length, 1, `题目 ${id} 缺少或重复答案`)
    const answer = entry[4].split('**参考答案：**')[1].trim()
    assert(answer.length >= 40, `题目 ${id} 答案过短`)
    assert(!/TODO|待补充答案|答案待完善/.test(answer), `题目 ${id} 含占位答案`)
  }
}
assert.equal(seen.size, 693)
const expected = [...Array.from({ length: 79 }, (_, i) => i + 42),
  ...Array.from({ length: 20 }, (_, i) => i + 123),
  ...Array.from({ length: 594 }, (_, i) => i + 318)]
assert.deepEqual([...seen], expected, '原题编号覆盖范围不一致')
const pages = (await readdir(new URL('docs/interview/', root))).filter(name => name.endsWith('.md'))
assert.equal(pages.length, 36, '应包含 35 个分类页和一个总览页')
const overview = await read('docs/interview/index.md')
for (const category of metadata) assert(overview.includes(`](./${category.slug})`), `总览缺少 ${category.slug}`)
console.log(`面试题校验通过：${metadata.length} 个分类，${seen.size} 道原题与独立答案，题号、标题和锚点一致。`)
