/**
 * TagModalItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var TagModalItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    index: React.PropTypes.number,
    selected: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },

  onSelect() {
    this.props.onSelect(this.props.tag, this.props.index);
  },

  _renderCheckedIcon() {
    var name = '';
    if(!this.props.selected) {
      name = 'check-box';
    } else {
      name = 'check-box-outline-blank';
    }
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#DDD', false) }
        onPress={ this.onSelect }
      >
        <View style={ styles.checkButton }>
          <Icon
            name={ name }
            size={ 30 }
            color={ this.props.tag.color }
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={[ styles.color, {
          backgroundColor: this.props.tag.color
        }]} />
        <Text style={ styles.name }>
          { this.props.tag.name }
        </Text>
        { this._renderCheckedIcon() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#F00'
  },
  name: {
    flex: 1,
    color: '#333'
  },
  checkButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  }
});

module.exports = TagModalItem;