export default {
  default: {
    require: [
      './features/step_definitions/**/*.js',
      './features/support/**/*.js',
      './features/step_definitions/world.js',
    ],
    publishQuiet: true,
    timeout: 12_000,
  },
};