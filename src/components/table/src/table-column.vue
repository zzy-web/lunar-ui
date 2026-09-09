<script setup lang="ts">
defineOptions({ name: 'LuTableColumn' })

defineProps<{
  prop?: string
  label?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
}>()
</script>
