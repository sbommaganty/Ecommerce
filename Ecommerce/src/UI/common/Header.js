import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAppData} from '../../Provider/AppConfig';
import {headerStyles} from './Header.styles';

export const Header = props => {
  const appData = useAppData();
  const styles = headerStyles(appData);

  const renderContent = () => {
    return (
      <View style={[styles.subContainerStyle, props.subContainerStyle]}>
        {props.onBackpress ? (
          <TouchableOpacity
            onPress={() => {
              props.onBackpress();
            }}
            style={styles.iconContainerStyle}>
            <Text style={[styles.titleStyle, props.titleStyle]}>ᐸ</Text>
            {/* {<appData.images.backarrow />} */}
          </TouchableOpacity>
        ) : null}
        <View>
          {props.title ? (
            <Text style={[styles.titleStyle, props.titleStyle]}>
              {props.title}
            </Text>
          ) : null}
          {props.subTitle ? (
            <Text style={[styles.subTitleStyle, props.subTitleStyle]}>
              {props.subTitle}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <View style={[styles.mainContainerStyle, props.mainContainerStyle]}>
      {props.backgroundImage ? (
        <View>
          <View style={styles.imageContainerStyle}>
            {props.backgroundImage}
          </View>
          {renderContent()}
        </View>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={appData.colors.gradientColor}
          style={styles.gradientContianer}>
          {renderContent()}
        </LinearGradient>
      )}
    </View>
  );
};
