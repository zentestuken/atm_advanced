module.exports = {
  baseUrl: 'http://localhost:3000',
  timeouts: {
    step: 30_000,
    command: 15_000,
    serverStart: 40_000,
    serverCheck: 2000,
  },
  browserOptions: {
    headless: true,
  },
};