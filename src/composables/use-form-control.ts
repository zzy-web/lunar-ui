import { computed, inject } from 'vue'
import { formContextKey } from '../components/form/src/tokens'

/** A form can disable every descendant; an explicit control size wins. */
export function useFormControl(props: { disabled?: boolean; size?: 'large' | 'default' | 'small' }) {
  const form = inject(formContextKey, undefined)
  return {
    formDisabled: computed(() => Boolean(props.disabled || form?.disabled)),
    formSize: computed(() => props.size ?? form?.size ?? 'default')
  }
}
