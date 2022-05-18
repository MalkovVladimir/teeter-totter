# teeter-totter

## Task description

In this project, we expect you to create a standing in balance teeter totter.

- At the right side of teeter totter, there will be randomly placing objects with
  random weights. On the left side, there will be nothing but there will be
  objects falling from top to bottom. According to weight on the sides, teeter
  totter will be bending towards to heavy side.
- You will be managing those object’s placement by arrow keys to keep teeter
  totter on balance.
- Your task is, keeping this balance as much as you can.

Rules:

- There will be three different object type with different weights. Triangle,
  circle and rectangle.
- On the left side, only falling objects can be placed. You will be controlling
  objects with arrow keys. The placement of objects should keep balance as its
  best.
- On the right side, there will be randomly placing objects, which created
  randomly and placed randomly.
- The weights will be between 1 and 10.
- The bending speed will be increasing or decreasing according to balance.
- The maximum bending percentage is %30, if it exceeds this limit, simulation
  ends.
- If there is extra 20kg weight on the one side, simulation ends
  immediately.
- Distance from center will be considered as factor when placing the objects to
  keep teeter totter on balance.
- There will be pause and continue feature. The simulation can be paused and
  can be resumed last paused state.
- Vuex store usage expected.
- Component design expected.
- You can use any color or styling.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
