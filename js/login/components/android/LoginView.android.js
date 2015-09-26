/**
 * LoginView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet
} = React;

var LoginView = React.createClass({
  render() {
    return(
      <View style={ styles.container }>
        <Text>Login</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

module.exports = LoginView;