export const componentGroups = [
  { zh: '基础组件', en: 'Basic', items: [
    { slug: 'divider', name: 'Divider', zh: '分割线', fresh: true, description: ['水平、垂直与带文字的内容分隔', 'Horizontal, vertical and labeled separators'] },
    { slug: 'button', name: 'Button', zh: '按钮', description: ['常用操作与动作入口', 'Actions and interactions'] },
    { slug: 'card', name: 'Card', zh: '卡片', description: ['组织内容与操作', 'Content containers'] },
    { slug: 'tag', name: 'Tag', zh: '标签', description: ['状态与分类标记', 'Status and categories'] }
  ] },
  { zh: '表单组件', en: 'Form', items: [
    { slug: 'input', name: 'Input', zh: '输入框', updated: true, description: ['文本、密码与多行输入', 'Text, passwords and textareas'] },
    { slug: 'select', name: 'Select', zh: '选择器', fresh: true, description: ['单选、多选与禁用选项', 'Single and multiple selection'] },
    { slug: 'radio', name: 'Radio', zh: '单选框', fresh: true, description: ['互斥选项与单选框组', 'Exclusive options and groups'] },
    { slug: 'checkbox', name: 'Checkbox', zh: '复选框', description: ['布尔选择与半选状态', 'Boolean and mixed states'] },
    { slug: 'switch', name: 'Switch', zh: '开关', description: ['状态切换与加载反馈', 'Toggle states and loading'] },
    { slug: 'form', name: 'Form', zh: '表单', description: ['表单布局与字段校验', 'Layout and field validation'] }
  ] },
  { zh: '数据展示', en: 'Data display', items: [
    { slug: 'tree', name: 'Tree', zh: '树形控件', fresh: true, description: ['层级数据、节点展开与复选联动', 'Hierarchical data, expansion and linked checkboxes'] },
    { slug: 'pagination', name: 'Pagination', zh: '分页', fresh: true, description: ['页码切换与大数据量分页', 'Page navigation for large datasets'] },
    { slug: 'table', name: 'Table', zh: '表格', description: ['结构化数据与自定义列', 'Structured data and columns'] },
    { slug: 'calendar', name: 'Calendar', zh: '日历', description: ['月视图与日期选择', 'Month views and date selection'] },
    { slug: 'empty', name: 'Empty', zh: '空状态', fresh: true, description: ['无数据说明与后续操作', 'Empty states and next actions'] }
  ] },
  { zh: '反馈组件', en: 'Feedback', items: [
    { slug: 'progress', name: 'Progress', zh: '进度条', fresh: true, description: ['任务进度、状态与不确定进度', 'Task progress, status and indeterminate loading'] },
    { slug: 'alert', name: 'Alert', zh: '提示', fresh: true, description: ['行内提示与状态反馈', 'Inline messages and feedback'] },
    { slug: 'dialog', name: 'Dialog', zh: '对话框', description: ['弹层内容与确认操作', 'Modal content and confirmation'] },
    { slug: 'tour', name: 'Tour', zh: '漫游式引导', description: ['分步介绍页面功能', 'Step-by-step feature guides'] }
  ] }
]
