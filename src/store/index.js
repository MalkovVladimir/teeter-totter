/* eslint-disable no-unused-vars */
import { createStore } from "vuex";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Constraint,
  World,
  Events,
} from "matter-js";

export default createStore({
  state: {
    engine: null,
    world: null,
    render: null,
    size: {
      width: 0,
      height: 0,
    },
    runner: null,
    titerTotter: {
      plank: null,
      base: null,
    },
    weightLeft: 0,
    weightRight: 0,
    figures: [],
  },
  getters: {},
  mutations: {
    setEngine(state, engine) {
      state.engine = engine;
    },
    setWorld(state, world) {
      state.world = world;
    },
    setRender(state, render) {
      state.render = render;
    },
    setSize(state, size) {
      state.size = size;
    },
    setRunner(state, runner) {
      state.runner = runner;
    },
    setTiterTotter(state, titerTotter) {
      state.titerTotter = titerTotter;
    },
    addFigure(state, figure) {
      state.figures.push(figure);
    },
    increaseLeftWeight(state, weight) {
      state.weightLeft += weight;
    },
    increaseRightWeight(state, weight) {
      state.weightRight += weight;
    },
  },
  actions: {
    initMatter({ commit }, options) {
      const engine = Engine.create({
        ...options.engine,
      });
      const render = Render.create({
        ...options.render,
        engine,
      });
      const { width, height } = options.render.options;
      const runner = Runner.create();

      commit("setEngine", engine);
      commit("setWorld", engine.world);
      commit("setRender", render);
      commit("setSize", { width, height });
      commit("setRunner", runner);
    },
    rederBorders({ state }, borderWidth = 2) {
      const { size } = state;
      const borders = [
        {
          id: "rightBorder",
          config: [size.width, size.height / 2, borderWidth, size.height],
        },

        {
          id: "leftBorder",
          config: [0, size.height / 2, borderWidth, size.height],
        },
        {
          id: "topBorder",
          config: [size.width / 2, 0, size.width, borderWidth],
        },
        {
          id: "bottomBorder",
          config: [size.width / 2, size.height, size.width, borderWidth],
        },
      ].map((border) =>
        Bodies.rectangle(...border.config, {
          id: border.id,
          isStatic: true,
        })
      );

      World.add(state.world, borders);
    },
    renderTiterTotter({ state, commit }, options) {
      const { size } = state;
      const { plankWidth, plankHeight, baseHeight } = options;
      const plank = Bodies.rectangle(
        size.width / 2,
        size.height - baseHeight,
        plankWidth,
        plankHeight,
        {
          id: "plank",
        }
      );

      const plankMountConstraint = Constraint.create({
        pointA: {
          x: size.width / 2,
          y: size.height - baseHeight,
        },
        bodyB: plank,
        length: 0,
      });

      const base = Bodies.polygon(size.width / 2, size.height, 3, baseHeight, {
        id: "base",
        isStatic: true,
        angle: -0.52,
      });

      World.add(state.world, [plank, plankMountConstraint, base]);
      // for pause function
      commit("addFigure", plank);
    },
    renderRandomFigure({ state, commit }, xCoordinate) {
      const { size } = state;
      const weight = Math.floor(Math.random() * 10) + 1;

      if (xCoordinate > size.width / 2) {
        commit("increaseRightWeight", weight);
      } else {
        commit("increaseLeftWeight", weight);
      }

      const figureWidth = weight * 10;
      const figureHeight = weight * 10;
      const appearenceHeight = 150;

      const figureCreaterMap = {
        0: () => {
          return Bodies.rectangle(
            xCoordinate,
            appearenceHeight,
            figureWidth,
            figureHeight,
            {
              isStatic: false,
              mass: weight,
              inverseMass: 1 / weight,
            }
          );
        },
        1: () => {
          return Bodies.polygon(
            xCoordinate,
            appearenceHeight,
            3,
            figureHeight,
            {
              isStatic: false,
              angle: -0.52,
              mass: weight,
              inverseMass: 1 / weight,
            }
          );
        },
        2: () => {
          return Bodies.circle(xCoordinate, appearenceHeight, figureHeight, {
            isStatic: false,
            mass: weight,
            inverseMass: 1 / weight,
          });
        },
      };
      const randomDigit = Math.floor(Math.random() * 3);
      const figure = figureCreaterMap[randomDigit]();

      World.add(state.world, figure);
      commit("addFigure", figure);

      return figure;
    },
    moveFigure({ state }, code) {
      const xOffset = code === "ArrowLeft" ? -20 : 20;
      const { figures } = state;
      const lastFigure = figures[figures.length - 1];
      const { x, y } = lastFigure.position;

      Body.setPosition(lastFigure, {
        x: x + xOffset,
        y,
      });
    },
    run({ state }) {
      Render.run(state.render);
      Runner.run(state.runner, state.engine);
      Events.on(state.engine, "collisionStart", (e) => {
        const { bodyA, bodyB } = e.pairs[0];
        const stopSimulationIdsCollisions = ["plank", "bottomBorder"];

        if (
          stopSimulationIdsCollisions.includes(bodyA.id) &&
          stopSimulationIdsCollisions.includes(bodyB.id)
        ) {
          // %30 because of width of half plank and base height (calculated trinagle)
          alert("Maximum bending percentage is %30. Simulation ends");
          window.location.reload();
        }
      });
    },
  },
  modules: {},
});
