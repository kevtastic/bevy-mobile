'use strict';

var React = require('react-native');
var {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight
} = React;
var {
  Icon
} = require('react-native-icons');

var constants = require('./../../constants');

var NewPostCard = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    user: React.PropTypes.object
  },

  onPress() {
    this.props.onPress();
  },

  render() {

    var user = this.props.user;

    return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={this.onPress}
        style={ styles.touchContainer }
      >
        <View style={ styles.container }>
          <Image 
            source={{ uri: user.image_url }}
            style={ styles.image }
          />
          <View style={ styles.textContainer }>
            <Text style={ styles.text }>
              Drop a Line
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  touchContainer: {
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 3
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    //borderBottomWidth: 1,
    //borderBottomColor: '#ccc'
  },
  text: {
    color: '#aaa'
  }
});

module.exports = NewPostCard;