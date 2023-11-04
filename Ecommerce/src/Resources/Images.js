/**
 * lightImages are used for light theme
 * darkImages are used for dark theme
 * if no images are provided for  dark theme it uses images form light theme
 * make sure to name the images in light and dark to make the changes dynamic this is similar to colors
 * I have used FastImage since it has better performance then regular images from react-native
 */
import React from 'react';
import FastImage from 'react-native-fast-image';

export const lightImages = {};
export const darkImages = {
  ...lightImages,
};

/*example
  background: props => {
    return (
      <FastImage
        style={{ width: 20, height: 20 }}
        resizeMode={'contain'}
        {...props}
        source={require('./Images/<imagepath>.png')}
      />
    );
  },
  usage:
  const appData = useAppData();
  <appData.images.background />
*/
