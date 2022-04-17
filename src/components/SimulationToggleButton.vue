<template>
  <button type="button" @click="handleClick">{{ btnContent }}</button>
</template>

<script>
import { computed } from "vue";

export default {
  name: "SimulationPauseButton",
  props: {
    pauseValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, ctx) {
    const handleClick = () => ctx.emit("click");
    const btnContent = computed(() =>
      props.pauseValue ? "Continue" : "Pause"
    );

    return {
      handleClick,
      btnContent,
    };
  },
};
</script>

<style></style>
