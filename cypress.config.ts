import { defineConfig } from 'cypress'

// TODO: I might need to define path aliases here
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
