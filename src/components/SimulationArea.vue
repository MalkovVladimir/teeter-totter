<template>
  <div ref="simulationArea"></div>
  <div>
    You can move left figure before start. Press "Q" to add figure to the left.
    Move last added figure by arrows
  </div>
  <SimulationToggleButton :pauseValue="isPaused" @click="togglePause" />
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import SimulationToggleButton from "./SimulationToggleButton.vue";

export default {
  name: "SimulationArea",
  components: {
    SimulationToggleButton,
  },
  setup() {
    const store = useStore();
    const simulationArea = ref(null);
    const width = 800;
    const height = 700;
    const plankWidth = width - 100;

    const getRandomPlankX = (side) => {
      const plankOffset = 10;
      const delta = (width - plankWidth) / 2;
      let from, to;

      if (side === "right") {
        // always right side of plank by +1
        from = width / 2 + 1;
        to = width - delta - plankOffset;
      } else {
        from = delta + plankOffset;
        to = width / 2 - 1;
      }

      return Math.floor(Math.random() * (to - from + 1) + from);
    };

    const addFigureToLeft = async () => {
      await store.dispatch("renderRandomFigure", getRandomPlankX("left"));
    };

    const qHandler = ({ code }) => {
      if (code === "KeyQ" && !store.state.isPaused) {
        addFigureToLeft();
      }
    };

    const arrowHandler = ({ code }) => {
      if (code !== "ArrowLeft" && code !== "ArrowRight") {
        return;
      }

      store.dispatch("moveFigure", code);
    };

    const alertWeightLimit = (weigth) => {
      if (weigth > 20) {
        alert("Extra weight! Simulation ends");
        window.location.reload();
      }
    };

    watch(() => store.state.weightLeft, alertWeightLimit);
    watch(() => store.state.weightRight, alertWeightLimit);

    onMounted(() => {
      const matterOptions = {
        engine: {
          timing: {
            timeScale: 0.6,
          },
        },
        render: {
          element: simulationArea.value,
          options: {
            width,
            height,
            wireframes: false,
            background: "transparent",
          },
        },
      };

      store.dispatch("initMatter", matterOptions);
      store.dispatch("rederBorders", 2);
      store.dispatch("renderTeeterTotter", {
        plankWidth,
        plankHeight: 2,
        // should be 175 (sin 30 for hypotenuse 350, law of sines);
        // Thanks school geometry
        baseHeight: 175,
      });
      store.dispatch("renderRandomFigure", getRandomPlankX("right"));
      store.dispatch("renderRandomFigure", getRandomPlankX("left"));
      store.dispatch("run");
      store.dispatch("togglePause");

      document.addEventListener("keydown", qHandler);
      document.addEventListener("keydown", arrowHandler);
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", qHandler);
      document.addEventListener("keydown", arrowHandler);
    });

    return {
      store,
      isPaused: computed(() => store.state.isPaused),
      togglePause: () => store.dispatch("togglePause"),
      simulationArea,
      addFigureToLeft,
    };
  },
};
</script>

<style></style>
