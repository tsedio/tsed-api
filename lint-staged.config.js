module.exports = {
  "packages/backoffice/**/*.{jsx,tsx,ts,js}": [
    "cd packages/backoffice && eslint --fix"
  ],
  "packages/config/**/*.{jsx,tsx,ts,js}": [
    "cd packages/config && eslint --fix"
  ],
  "packages/server/**/*.{jsx,tsx,ts,js}": [
    "cd packages/server && eslint --fix"
  ],
  "packages/shared/**/*.{jsx,tsx,ts,js}": [
    "cd packages/shared && eslint --fix"
  ],
  "packages/storybook/**/*.{jsx,tsx,ts,js}": [
    "cd packages/backoffice && eslint --fix"
  ],
  "**/*.{ts,js,json,md,yml,yaml}": ["prettier --write"]
};
