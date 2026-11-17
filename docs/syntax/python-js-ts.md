# Python 与 JS / TS 语法对照

用熟悉的 JavaScript 和 TypeScript 写法查找对应的 Python 语法。写 Python Agent 时，可以先掌握字典、列表、函数参数、类型标注、异步与模块导入。表中的类型标注示例适用于 Python 3.10+。

## 变量与基本语法

| 用途 | JS / TS | Python |
| --- | --- | --- |
| 定义变量 | `let name = "Alice"` | `name = "Alice"` |
| 常量 | `const MAX_RETRIES = 3` | `MAX_RETRIES = 3`，大写是约定，仍可重新赋值 |
| 布尔值 | `true`、`false` | `True`、`False` |
| 空值 | `null`、`undefined` | `None` |
| 字符串插值 | `` `你好，${name}` `` | `f"你好，{name}"` |
| 代码块 | `{ ... }` | 行尾加 `:`，下一行缩进，通常用 4 个空格 |
| 单行注释 | `// 注释` | `# 注释` |
| 相等比较 | `a === b` | `a == b`。列表和字典也会按内容比较 |
| 逻辑运算 | `a && b`、`a \|\| b`、`!a` | `a and b`、`a or b`、`not a` |
| 三元表达式 | `ok ? "成功" : "失败"` | `"成功" if ok else "失败"` |
| 空值兜底 | `x ?? 3` | `x if x is not None else 3` |

## 数组、对象与循环

| 用途 | JS / TS | Python |
| --- | --- | --- |
| 数组 / 列表 | `const nums = [1, 2, 3]` | `nums = [1, 2, 3]` |
| 对象 / 字典 | `const user = {name: "Alice"}` | `user = {"name": "Alice"}` |
| 读取字段 | `user.name` 或 `user["name"]` | `user["name"]`，缺键抛出 `KeyError` |
| 字段缺失时用默认值 | `Object.hasOwn(user, "role") ? user.role : "guest"` | `user.get("role", "guest")`，仅缺键时使用默认值 |
| 集合去重 | `new Set(nums)` | `set(nums)`，迭代顺序无保证 |
| 追加元素 | `nums.push(4)` | `nums.append(4)`，返回 `None` |
| 取长度 | `nums.length` | `len(nums)` |
| 取最后一个元素 | `nums.at(-1)` | `nums[-1]`，空列表会抛出 `IndexError` |
| 截取前两个元素 | `nums.slice(0, 2)` | `nums[:2]` |
| 判断是否包含元素 | `nums.includes(2)` | `2 in nums` |
| 判断对象是否有自有属性 | `Object.hasOwn(user, "name")` | `"name" in user` |
| 遍历数组 | `for (const n of nums) { ... }` | `for n in nums:` |
| 同时遍历索引和值 | `for (const [i, n] of nums.entries()) { ... }` | `for i, n in enumerate(nums):` |
| 遍历键值 | `for (const [k, v] of Object.entries(user)) { ... }` | `for k, v in user.items():` |
| `map` 转换 | `nums.map(n => n * 2)` | `[n * 2 for n in nums]` |
| `filter` 筛选 | `nums.filter(n => n > 1)` | `[n for n in nums if n > 1]` |
| 展开合并对象 | `{...defaults, ...options}` | `{**defaults, **options}` |
| 解构 / 解包 | `const [a, b] = pair` | `a, b = pair`，要求恰好有两个元素 |

## 函数、类型与异常

| 用途 | JS / TS | Python |
| --- | --- | --- |
| 普通函数 | `function greet(name) { return name }` | `def greet(name): return name` |
| 简短匿名函数 | `n => n * 2` | `lambda n: n * 2`，函数体只能是一个表达式 |
| 默认参数 | `function greet(name = "Alice") { ... }` | `def greet(name="Alice"):` |
| 按名称传参 | 常用对象参数 `run({ retries: 3 })` | `run(retries=3)` |
| 剩余位置参数 | `function log(...args) { ... }` | `def log(*args):`，`args` 是元组 |
| 接收任意关键字参数 | 常用对象参数 `function run(options) { ... }` | `def run(**kwargs):`，`kwargs` 是字典 |
| 变量类型 | `const name: string = "Alice"` | `name: str = "Alice"` |
| 参数与返回类型 | `function greet(name: string): string { return name }` | `def greet(name: str) -> str: return name` |
| 字符串数组类型 | `string[]` | `list[str]` |
| 字符串键、整数值 | `Record<string, number>` 中的值使用整数 | `dict[str, int]` |
| 可空类型 | `string \| null` | `str \| None` |
| 对象结构类型 | `interface User { name: string }` | `class User(TypedDict): name: str`，从 `typing` 导入 `TypedDict` |
| 捕获异常 | `try { ... } catch (err) { ... }` | `try:` 配合 `except Exception as err:`，也可指定 `ValueError` 等具体类型 |
| 抛出异常 | `throw new Error("失败")` | `raise ValueError("参数不合法")` |

Python 类型标注可以交给静态检查工具。解释器默认不会根据类型标注校验实参。

## 异步、模块与 JSON

| 用途 | JS / TS | Python |
| --- | --- | --- |
| 定义异步函数 | `async function run() { ... }` | `async def run():` |
| 等待结果 | `const result = await run()` | `result = await run()` |
| 并发等待多个任务 | `await Promise.all([a(), b()])` | `await asyncio.gather(a(), b())`，先 `import asyncio` |
| 从模块导入函数 | `import { run } from "./agent.js"` | `from agent import run`，示例适用于同目录的脚本与模块 |
| 解析 JSON | `JSON.parse(text)` | `json.loads(text)`，先 `import json` |
| 序列化 JSON | `JSON.stringify(data)` | `json.dumps(data)` |
| 从脚本启动异步入口 | `await main()`（ES 模块顶层） | `asyncio.run(main())`（同步入口） |

## 从 JS / TS 切到 Python 容易踩的坑

1. **空容器是假值。** Python 的 `if []:`、`if {}:` 都不会进入分支，JS 的 `if ([])`、`if ({})` 都会。
2. **`is` 判断对象身份。** 比较字符串、数字或列表的值用 `==`。判断空值用 `is None`。
3. **可变的默认参数会被多次调用共享。** 可以写 `def run(messages=None):`，在函数体内判断 `messages is None` 后再创建空列表。
4. **`dict.get()` 的默认值只在缺键时生效。** `{"role": None}.get("role", "guest")` 得到 `None`，JS 的 `user.role ?? "guest"` 在值为 `null` 时会得到 `"guest"`。
5. **调用 `async def` 会创建协程对象。** Python 要 `await` 它或把它调度成任务，函数体才会执行。JS 的 `async` 函数在调用时就开始执行，直到遇到第一个 `await`。
