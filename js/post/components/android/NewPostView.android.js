/**
 * NewPostView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  ListView,
  View,
  Text,
  Image,
  TextInput,
  TouchableNativeFeedback,
  Navigator,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var NewPostView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      selectedBevy: (this.props.activeBevy._id == -1) ? this.props.myBevies[1] : this.props.activeBevy
    };
  },

  onSwitchBevy(bevy) {
    this.setState({
      selectedBevy: bevy
    });
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={[
          routes.NEWPOST.INPUT
        ]}
        sceneStyle={{
          flex: 1
        }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.NEWPOST.BEVYPICKER.name:
              return (
                <BevyPickerView 
                  newPostRoute={ route } 
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  onSwitchBevy={ this.onSwitchBevy }
                  { ...this.props } 
                />
              );
              break;
            case routes.NEWPOST.INPUT.name:
            default:
              return (
                <InputView 
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  { ...this.props }
                />
              )
              break;
          }
        }}
      />
    );
  }
});

var InputView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    selectedBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      postInput: ''
    };
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {
              // go back
              this.props.mainNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Text style={ styles.backButtonText }>Back</Text>
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>New Post</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={ this.submitPost }
          >
            <View style={ styles.postButton }>
              <Text style={ styles.postButtonText }>Post</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={ styles.postingToBar }>
          <Text style={ styles.postingTo }>Post To</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#FFF', false) }
            onPress={() => this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER)}
          >
            <View style={ styles.bevyPickerButton }>
              <Text style={ styles.bevyPickerButtonText }>{ this.props.selectedBevy.name }</Text>
              <Text sytle={ styles.bevyPickerButtonHintText }>Tap to Change</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <TextInput
          ref='Input'
          style={ styles.postInput }
          autoCorrect={ false }
          multiline={ true }
          placeholder='Drop a Line'
          placeholderTextColor='#000'
          value={ this.state.postInput }
          onChangeText={(text) => this.setState({ postInput: text })}
          textAlignVertical='top'
        />
        <View style={ styles.actionBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {}}
          >
            <View style={ styles.addMediaButton }>
              <Icon
                name='camera-alt'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {}}
          >
            <View style={ styles.addMediaButton }>
              <Icon
                name='image'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
});

var BevyPickerView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    onSwitchBevy: React.PropTypes.func
  },

  getInitialState() {
    var bevies = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      bevies: bevies.cloneWithRows(this.props.myBevies)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      bevies: this.state.bevies.cloneWithRows(nextProps.myBevies)
    });
  },

  onSwitchBevy(bevy) {
    this.props.onSwitchBevy(bevy);
    this.forceUpdate();
    this.props.newPostNavigator.pop();
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Text style={ styles.backButtonText }>Cancel</Text>
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>Posting To...</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
            }}
          >
            <View style={ styles.postButton }>
              <Text style={ styles.postButtonText }>Done</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <ListView
          dataSource={ this.state.bevies }
          style={ styles.bevyPickerList }
          renderRow={(bevy) => {
            if(bevy._id == -1) return <View />;
            return (
              <BevyPickerItem
                key={ 'bevypickeritem:' + bevy._id }
                bevy={ bevy }
                onSwitchBevy={ this.onSwitchBevy }
                isSelected={ bevy._id == this.props.selectedBevy._id }
              />
            );
          }}
        />
      </View>
    );
  }
});

var BevyPickerItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    isSelected: React.PropTypes.bool,
    onSwitchBevy: React.PropTypes.func
  },

  _renderIcon() {
    if(!this.props.isSelected) return <View />;
    return (
      <Icon
        name='done'
        size={ 30 }
        color='#2CB673'
      />
    );
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#666', false) }
        onPress={() => {
          this.props.onSwitchBevy(this.props.bevy);
        }} 
      >
        <View style={ styles.bevyPickerItem }>
          { this._renderIcon() }
          <Image 
            style={ styles.bevyImage }
            source={{ uri: this.props.bevy.image_url + '?w=50&h=50' }}
          />
          <Text style={ styles.bevyName }>{ this.props.bevy.name }</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  topBar: {
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  backButtonText: {
    color: '#000'
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#000'
  },
  postButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  postButtonText: {
    color: '#000'
  },
  postingToBar:{
    height: 40,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB673',
    paddingLeft: 12,
    paddingRight: 12
  },
  postingTo: {
    color: '#FFF',
    marginRight: 10
  },
  bevyPickerButton: {
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  bevyPickerButtonText: {
    textAlign: 'left',
    color: '#FFF'
  },
  bevyPickerButtonHintText: {
    textAlign: 'left',
    color: '#EEE'
  },
  postInput: {
    flex: 1
  },
  actionBar: {
    marginBottom: 24,
    height: 48,
    width: constants.width,
    backgroundColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center'
  },
  addMediaButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  bevyPickerList: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyPickerItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bevyImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10
  },
  bevyName: {
    color: '#888'
  }
});

module.exports = NewPostView;