import { cloneVNode, Comment, defineComponent, Fragment, h, Text } from 'vue'
import type { VNode } from 'vue'

export default defineComponent({
  name: 'LuTooltipTrigger',
  props: { describedby: String },
  setup(props, { slots }) {
    function flatten(nodes: VNode[]): VNode[] {
      return nodes.flatMap(node => node.type === Comment ? [] : node.type === Fragment ? flatten(node.children as VNode[]) : [node])
    }
    return () => {
      const children = flatten(slots.default?.() ?? [])
      if (children.length === 1 && children[0].type !== Text) {
        const child = children[0]
        const needsTabindex = typeof child.type === 'string' && !['button', 'input', 'select', 'textarea'].includes(child.type) && !(child.type === 'a' && child.props?.href)
        return cloneVNode(child, {
          ...(needsTabindex ? { tabindex: child.props?.tabindex ?? 0 } : {}),
          'aria-describedby': [child.props?.['aria-describedby'], props.describedby].filter(Boolean).join(' ') || undefined
        })
      }
      return h('span', { tabindex: 0, 'aria-describedby': props.describedby }, children)
    }
  }
})
