/**
 * lightColors are used for light theme
 * darkColors are used for dark theme
 * if no colours are provided for  dark theme it uses colors form light theme
 * make sure to name the colour in light and dark to same as shown for shadowColor to make the changes dynamic
 */
export const lightColors = {
  SpinnerColor: 'green',
  SpinnerBackgroud: 'rgba(0,0,0,0.3)',
  defaultBackgroundColor: 'white',
  shadowColor: 'black',
  fontColor: 'black',
  invertFontColor: 'white',
  borderColor: '#ABB4BD',
  gradientColor: ['blue', '#00FF00'],
  disableColor: 'rgba(0,0,0,0.5)',
  placeHolderTextColor: 'grey',
  appPrimaryColor: '#FB8B24',
};
export const darkColors = {
  ...lightColors,
  shadowColor: 'white',
};
