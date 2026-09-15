export const componentGroups = [
  { zh: '基础组件', en: 'Basic', items: [
    { slug: 'steps', name: 'Steps', zh: '步骤条', fresh: true, description: ['流程状态、纵向布局与可交互步骤', 'Workflow states, vertical layouts and interactive steps'] },
    { slug: 'tabs', name: 'Tabs', zh: '标签页', fresh: true, description: ['内容切换与键盘导航', 'Content switching and keyboard navigation'] },
    { slug: 'breadcrumb', name: 'Breadcrumb', zh: '面包屑', fresh: true, description: ['页面层级与路径导航', 'Page hierarchy and navigation'] },
    { slug: 'dropdown', name: 'Dropdown', zh: '下拉菜单', fresh: true, description: ['操作菜单、禁用项与键盘导航', 'Action menus, disabled items and keyboard navigation'] },
    { slug: 'divider', name: 'Divider', zh: '分割线', fresh: true, description: ['水平、垂直与带文字的内容分隔', 'Horizontal, vertical and labeled separators'] },
    { slug: 'button', name: 'Button', zh: '按钮', description: ['常用操作与动作入口', 'Actions and interactions'] },
    { slug: 'card', name: 'Card', zh: '卡片', description: ['组织内容与操作', 'Content containers'] },
    { slug: 'tag', name: 'Tag', zh: '标签', description: ['状态与分类标记', 'Status and categories'] }
  ] },
  { zh: '表单组件', en: 'Form', items: [
    { slug: 'input-number', name: 'InputNumber', zh: '计数器', fresh: true, description: ['精度、步长、范围与格式化数值输入', 'Precision, steps, limits and formatted numeric input'] },
    { slug: 'slider', name: 'Slider', zh: '滑块', fresh: true, description: ['区间拖动、刻度、标记与键盘操作', 'Range dragging, stops, marks and keyboard controls'] },
    { slug: 'segmented', name: 'Segmented', zh: '分段控制器', fresh: true, description: ['分段选择、自定义内容与键盘导航', 'Segmented selection, custom content and keyboard navigation'] },
    { slug: 'rate', name: 'Rate', zh: '评分', fresh: true, description: ['星级评分、只读与键盘操作', 'Star ratings, read-only and keyboard controls'] },
    { slug: 'upload', name: 'Upload', zh: '上传', fresh: true, description: ['文件选择、拖拽上传与进度管理', 'File selection, drag and drop, upload progress'] },
    { slug: 'input', name: 'Input', zh: '输入框', updated: true, description: ['文本、密码与多行输入', 'Text, passwords and textareas'] },
    { slug: 'select', name: 'Select', zh: '选择器', fresh: true, description: ['单选、多选与禁用选项', 'Single and multiple selection'] },
    { slug: 'radio', name: 'Radio', zh: '单选框', fresh: true, description: ['互斥选项与单选框组', 'Exclusive options and groups'] },
    { slug: 'checkbox', name: 'Checkbox', zh: '复选框', description: ['布尔选择与半选状态', 'Boolean and mixed states'] },
    { slug: 'switch', name: 'Switch', zh: '开关', description: ['状态切换与加载反馈', 'Toggle states and loading'] },
    { slug: 'form', name: 'Form', zh: '表单', description: ['表单布局与字段校验', 'Layout and field validation'] }
  ] },
  { zh: '数据展示', en: 'Data display', items: [
    { slug: 'timeline', name: 'Timeline', zh: '时间线', fresh: true, description: ['时间戳、状态与自定义节点', 'Timestamps, status and custom nodes'] },
    { slug: 'collapse', name: 'Collapse', zh: '折叠面板', fresh: true, description: ['手风琴、异步拦截与延迟渲染', 'Accordion, async guards and lazy rendering'] },
    { slug: 'badge', name: 'Badge', zh: '徽标', fresh: true, description: ['数量提示、小红点与自定义内容', 'Counts, notification dots and custom content'] },
    { slug: 'avatar', name: 'Avatar', zh: '头像', fresh: true, description: ['图片头像、尺寸与失败回退', 'Profile images, sizes and error fallback'] },
    { slug: 'tree', name: 'Tree', zh: '树形控件', fresh: true, description: ['层级数据、节点展开与复选联动', 'Hierarchical data, expansion and linked checkboxes'] },
    { slug: 'pagination', name: 'Pagination', zh: '分页', fresh: true, description: ['页码切换与大数据量分页', 'Page navigation for large datasets'] },
    { slug: 'table', name: 'Table', zh: '表格', description: ['结构化数据与自定义列', 'Structured data and columns'] },
    { slug: 'calendar', name: 'Calendar', zh: '日历', description: ['月视图与日期选择', 'Month views and date selection'] },
    { slug: 'empty', name: 'Empty', zh: '空状态', fresh: true, description: ['无数据说明与后续操作', 'Empty states and next actions'] }
  ] },
  { zh: '反馈组件', en: 'Feedback', items: [
    { slug: 'result', name: 'Result', zh: '结果', fresh: true, description: ['操作结果与后续操作', 'Operation outcomes and next actions'] },
    { slug: 'skeleton', name: 'Skeleton', zh: '骨架屏', fresh: true, description: ['加载占位、动画与自定义布局', 'Loading placeholders, animation and custom layouts'] },
    { slug: 'tooltip', name: 'Tooltip', zh: '文字提示', fresh: true, description: ['悬停提示、焦点提示与自动定位', 'Hover and focus hints with automatic positioning'] },
    { slug: 'progress', name: 'Progress', zh: '进度条', fresh: true, description: ['任务进度、状态与不确定进度', 'Task progress, status and indeterminate loading'] },
    { slug: 'alert', name: 'Alert', zh: '提示', fresh: true, description: ['行内提示与状态反馈', 'Inline messages and feedback'] },
    { slug: 'dialog', name: 'Dialog', zh: '对话框', description: ['弹层内容与确认操作', 'Modal content and confirmation'] },
    { slug: 'tour', name: 'Tour', zh: '漫游式引导', description: ['分步介绍页面功能', 'Step-by-step feature guides'] }
  ] }
]
