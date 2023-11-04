import React, {useRef} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {useAppData} from '../../Provider/AppConfig';
import {dropDownStyle} from './DropDown.styles';

export const DropDown = props => {
  const menuRef = useRef(null);
  const appData = useAppData();
  const {
    optionsData,
    selectedOption,
    onChange,
    defaultLabel,
    listWidth,
    menuStyle,
    dropContainerStyle,
    selectedOptionTextStyle,
    optionTextStyle,
    menuItemStyle,
    labelTextStyle,
    onShow,
    onHide,
  } = props;

  const styles = dropDownStyle(appData, listWidth);
  const hideMenu = value => {
    if (onChange) {
      onChange(value);
    }
    menuRef.current.hide();
  };

  const showMenu = () => {
    if (onShow) {
      onShow();
    }
    menuRef.current.show();
  };

  return (
    <Menu
      ref={menuRef}
      onHidden={() => {
        if (onHide) {
          onHide();
        }
      }}
      button={
        <View>
          <TouchableOpacity
            onPress={showMenu}
            style={[styles.dropContainerStyle, dropContainerStyle]}>
            <Text style={[styles.labelTextStyle, labelTextStyle]}>
              {(selectedOption && selectedOption.label) || defaultLabel}
            </Text>
            <Text style={[styles.labelTextStyle, labelTextStyle]}>▼</Text>
          </TouchableOpacity>
        </View>
      }
      style={[styles.menuStyle, menuStyle]}>
      <ScrollView bounces={false} style={styles.scrollViewStyle}>
        {optionsData.map((option, index) => {
          const isSelected =
            selectedOption && option.key === selectedOption.key;
          return (
            <MenuItem
              key={index}
              onPress={() => hideMenu(option)}
              textStyle={
                isSelected
                  ? [styles.selectedOptionTextStyle, selectedOptionTextStyle]
                  : [styles.optionTextStyle, optionTextStyle]
              }
              style={[styles.menuItemStyle, menuItemStyle]}>
              {option.label}
            </MenuItem>
          );
        })}
      </ScrollView>
    </Menu>
  );
};
