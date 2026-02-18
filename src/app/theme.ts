const colorPrimary = '#242EDB';
const colorPrimaryHover = '#1e26b8';
const colorPrimaryLight = 'rgba(36, 46, 219, 0.15)';
const colorCheckbox = '#3C538E';

const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const fontSizeSM = 12;
const fontSize = 14;
const fontSizeMD = 16;
const fontSizeLG = 18;
const fontSizeXL = 24;
const fontSizeXXL = 40;

const fontWeightMedium = 500;
const fontWeightSemibold = 600;

const lineHeight = 1.5;

export const theme = {
  token: {
    colorPrimary,
    fontFamily,
    fontSize,
    fontSizeSM,
    fontSizeLG,
    fontWeightStrong: fontWeightSemibold,
    lineHeight,
  },
};

export const cssVars = {
  '--color-primary': colorPrimary,
  '--color-primary-hover': colorPrimaryHover,
  '--color-primary-light': colorPrimaryLight,
  '--color-checkbox': colorCheckbox,
  '--font-family': fontFamily,
  '--font-size-sm': `${fontSizeSM}px`,
  '--font-size': `${fontSize}px`,
  '--font-size-md': `${fontSizeMD}px`,
  '--font-size-lg': `${fontSizeLG}px`,
  '--font-size-xl': `${fontSizeXL}px`,
  '--font-size-xxl': `${fontSizeXXL}px`,
  '--font-weight-medium': String(fontWeightMedium),
  '--font-weight-semibold': String(fontWeightSemibold),
  '--line-height': String(lineHeight),
};

export function applyThemeVars() {
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
