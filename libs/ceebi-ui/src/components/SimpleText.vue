<template>
  <p>{{ text.toUpperCase() }} :D</p>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<script lang="ts">
export default {
  name: 'SimpleText',
};
</script>
