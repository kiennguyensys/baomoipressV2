import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

class DatePicker extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          isDatePickerVisible: false,
      }
  }

  setDatePickerVisibility = val => {
      this.setState({ isDatePickerVisible: val })
  }

  showDatePicker = () => {
      this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
      this.setDatePickerVisibility(false);
  };

  handleConfirm = date => {
      this.props.handleSelectedDate(date)
      this.hideDatePicker();
  };

  render(){
    return (
      <View>
        <TouchableOpacity onPress={this.showDatePicker} style={styles.dropDownMenu}>
            <Text style={styles.dropDownText}>{("Ngày sinh: " + this.props.date || 'Select Date of birth')}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={this.state.isDatePickerVisible}
          mode="date"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
      </View>
    );
  }
};

const styles = {
    dropDownMenu: {
        borderBottomWidth: 1,
        borderColor: '#D9D8D9',
        height: 30,
        marginHorizontal: 10,
        marginBottom: 20
    },
    dropDownText: {
        fontSize: 18,
        color: '#949494'
    },
}

export default DatePicker;
