'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} = React;
var {
  Icon
} = require('react-native-icons');

var BackButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func,
    color: React.PropTypes.string,
    text: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      color: '#666',
      text: null
    };
  },

  onPress: function() {
    this.props.onPress();
  },

  _renderText() {
    if(!this.props.text) return <View />;
    return (
      <Text style={[ styles.backButtonText, {
        color: this.props.color
      } ]}>
        { this.props.text }
      </Text>
    );
  },

  render: function() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onPress } 
        style={ styles.backButtonContainer } 
      >
        <View style={ styles.backButton }>
          <Icon
            name='ion|ios-arrow-left'
            size={ 30 }
            color={ this.props.color }
            style={ styles.backButtonIcon }
          />
          { this._renderText() }
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButtonIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
    height: 30
  },
  backButtonText: {
    fontSize: 15
  }
});

module.exports = BackButton;