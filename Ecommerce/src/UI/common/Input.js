/**
 * Props:
 * label: Input Label
 * inputType: 'text' |'date' |'checkbox' |'radioButton' |'drop'
 * value: input value
 * onUpdate: (value)=>void  // can be string or {key:1, value:'option1'}
 * options: used for checkbox|radioButton|drop
 *          ex: [{key:1, value:'option1'},{key:2, value:'option2'}]
 * isPassword: boolean only if inputType is text
 * textInputProps: only if inputType is text, extra textInput props
 * dropProps: only if inputType is drop, extra Drop props
 * dateType: 'date' | 'time' | 'datetime' only if inputType is date
 * datePickerProps:  only if inputType is date, extra DateTimePickerModal props
 * checkboxProps: only if inputType is checkbox, extra CheckBox props
 */
import React, {useState} from 'react';
import {Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useAppData} from '../../Provider/AppConfig';
import {DropDown} from './DropDown';
import {inputStyles} from './Input.styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

export const Input = props => {
  const appData = useAppData();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const styles = inputStyles(appData, isFocused);

  const renderTextInput = () => {
    return (
      <TextInput
        value={props.value}
        style={styles.inputTextStyles}
        placeholderTextColor={appData.colors.placeHolderTextColor}
        placeholder={props.label}
        onChangeText={value => {
          props.onUpdate(value);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        selectionColor={appData.colors.appPrimaryColor}
        secureTextEntry={props.isPassword}
        editable={!props.disable}
        {...props.textInputProps}
      />
    );
  };

  const renderDropInput = () => {
    return (
      <DropDown
        onShow={() => {
          setIsFocused(true);
        }}
        onHide={() => {
          setIsFocused(false);
        }}
        optionsData={props.options}
        selectedOption={props.value}
        onChange={value => {
          props.onUpdate(value);
        }}
        defaultLabel={props.label}
        listWidth={props.listWidth}
        labelTextStyle={
          props.value ? styles.inputTextStyles : styles.placeHolderTextStyles
        }
        {...props.dropProps}
      />
    );
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setIsFocused(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setIsFocused(false);
  };
  const handleConfirm = date => {
    props.onUpdate(date);
    hideDatePicker();
  };
  const renderDateInput = () => {
    const isValidDate = props.value && moment(props.value).isValid();
    return (
      <View style={styles.dateMainContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={showDatePicker}
          style={[styles.dateContainer, props.dateContainerStyle]}>
          <Text
            style={
              isValidDate
                ? styles.inputTextStyles
                : styles.placeHolderTextStyles
            }>
            {isValidDate
              ? moment(props.value).format('DD-MM-YYYY')
              : props.label}
          </Text>
          <Text>📅</Text>
          {/* <appData.images.calendarIcon /> */}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={props.dateType}
          onConfirm={date => handleConfirm(date)}
          onCancel={hideDatePicker}
          {...props.datePickerProps}
        />
      </View>
    );
  };

  const renderCheckbox = () => {
    return props.options.map((option, index) => {
      const isSelected = (props.value || []).includes(option);
      return (
        <View
          key={index}
          style={[styles.checkboxContainer, props.checkboxContainerStyle]}>
          <CheckBox
            disabled={false}
            value={isSelected}
            style={styles.checkboxStyle}
            tintColor={props.tintColor || appData.colors.appPrimaryColor}
            onTintColor={props.onTintColor || appData.colors.appPrimaryColor}
            onCheckColor={props.onCheckColor || appData.colors.appPrimaryColor}
            onFillColor={props.onFillColor}
            onValueChange={newValue => {
              let temp = [];
              temp.push(...(props.value || []));
              if (newValue) {
                temp.push(option);
              } else {
                temp = temp.filter(
                  optionFilter => optionFilter.key !== option.key,
                );
              }
              props.onUpdate(temp);
            }}
            boxType={'square'}
            onAnimationType={'bounce'}
            offAnimationType={'bounce'}
            lineWidth={1.5}
            animationDuration={0.25}
            {...props.checkboxProps}
          />
          <Text style={styles.inputTextStyles}>{option.label}</Text>
        </View>
      );
    });
  };

  const renderRadioButton = () => {
    return (
      <View
        style={[styles.radiobuttonContainer, props.radiobuttonContainerStyle]}>
        {props.options.map((option, i) => {
          const isSelected = props.value && props.value.key === option.key;
          return (
            <RadioButton
              labelHorizontal={true}
              key={i}
              {...props.radioButtonProps}>
              <RadioButtonInput
                obj={{label: option.label, value: option.key}}
                index={i}
                isSelected={isSelected}
                onPress={value => {
                  props.onUpdate(option);
                }}
                borderWidth={1}
                buttonInnerColor={
                  props.circleColor || appData.colors.appPrimaryColor
                }
                buttonOuterColor={
                  props.circleColor || appData.colors.appPrimaryColor
                }
                buttonOuterSize={20}
                buttonSize={10}
                buttonStyle={{}}
                buttonWrapStyle={styles.radioButtonStyle}
                {...props.radioButtonInputProps}
              />
              <RadioButtonLabel
                obj={{label: option.label, value: option.key}}
                index={i}
                labelHorizontal={true}
                onPress={value => {
                  props.onUpdate(option);
                }}
                labelStyle={styles.radioLabelTextStyle}
                labelWrapStyle={styles.radioLabelStyle}
                {...props.radioButtonLabelProps}
              />
            </RadioButton>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.mainContainerStyle, props.mainContainerStyle]}>
      {props.value || ['checkbox', 'radioButton'].includes(props.inputType) ? (
        <Text style={styles.headingTextstyle}>{props.label}</Text>
      ) : null}
      {props.inputType === 'text'
        ? renderTextInput()
        : props.inputType === 'drop'
        ? renderDropInput()
        : props.inputType === 'date'
        ? renderDateInput()
        : props.inputType === 'checkbox'
        ? renderCheckbox()
        : props.inputType === 'radioButton'
        ? renderRadioButton()
        : null}
    </View>
  );
};
