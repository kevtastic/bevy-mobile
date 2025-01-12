/**
 * NewPostInputView.ios.js
 *
 * Entry view where the user creates new posts by entering text
 * and uploading images
 * Also doubles as the edit post view, for editing text and
 * removing images
 *
 * @author albert
 * @flow
 */

'use strict';

import React, {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
  AlertIOS,
  Component,
  PropTypes
} from 'react-native';
var Icon = require('react-native-vector-icons/MaterialIcons');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var UIImagePickerManager = NativeModules.UIImagePickerManager;
var NewPostImageItem = require('./NewPostImageItem.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var FileStore = require('./../../../file/FileStore');
var FileActions = require('./../../../file/FileActions');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var UserStore = require('./../../../user/UserStore');
var BevyStore = require('./../../../bevy/BevyStore');
var FILE = constants.FILE;
var POST = constants.POST;

var NewPostInputView = React.createClass({
  propTypes: {
    newPostNavigator: React.PropTypes.object,
    newPostRoute: React.PropTypes.object,
    postingToBoard: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,

    // used for editing
    editing: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      keyboardSpace: 0,
      title: (this.props.editing)
        ? this.props.post.title : '',
      placeholderText: constants.hintTexts[Math.floor(Math.random() * constants.hintTexts.length)],
      images: (this.props.editing)
        ? this.props.post.images : [],
    };
  },

  componentDidMount() {
    this.titleValue = '';

    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);

    PostStore.on(POST.POST_CREATED, this.onPostCreated);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);
  },
  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);

    PostStore.off(POST.POST_CREATED, this.onPostCreated);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onKeyboardShow(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({ keyboardSpace: height });
  },
  onKeyboardHide(ev) {
    this.setState({ keyboardSpace: 0 });
  },

  onUploadComplete(image) {
    var images = this.state.images;
    images.push(image);
    this.setState({ images: images });
  },

  uploadImage() {
    UIImagePickerManager.showImagePicker({
      title: 'Upload Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, (type, response) => {
      if(type !== 'cancel') FileActions.upload(response.uri);
    });
  },

  addImage() {
    UIImagePickerManager.launchImageLibrary({
      returnBase64Image: false,
      returnIsVertical: true
    }, response => {
      if(!response.didCancel) FileActions.upload(response.uri);
    });
  },

  launchCamera() {
    UIImagePickerManager.launchCamera({
      returnBase64Image: false,
      returnIsVertical: true
    }, response => {
      if(!response.didCancel) FileActions.upload(response.uri);
    });
  },

  goBack() {
    this.TitleInput.blur();
    this.props.mainNavigator.pop();
  },

  goToBoardPickerView() {
    var route = {
      name: routes.NEWPOST.BOARDPICKER
    };
    this.props.newPostNavigator.push(route);
  },

  submit() {
    // dont post if text and images are empty
    if(this.state.title.length <= 0 && this.state.images.length <= 0) {
      AlertIOS.alert('Post must contain either text or images');
      return;
    }

    if(this.props.editing) {
      PostActions.update(
        this.props.post._id,
        this.titleValue,
        this.state.images,
        null //event
      );
    } else {
      PostActions.create(
        this.titleValue,
        (_.isEmpty(this.state.images)) ? [] : this.state.images,
        this.props.user,
        this.props.postingToBoard,
        null, // type
        null, // event
      );
    }

    // unfocus text field
    this.TitleInput.blur();
    this.titleValue = '';

    // if we're editing the post, then go directly to the comment view
    // because we already have the post that the comment view needs
    //
    // if we're creating a new post, then the onPostCreated function will
    // go to the comment view once the new post has been created on the server
    if(this.props.editing) {
      var route = routes.MAIN.COMMENT;

      // optimistic update
      var post = this.props.post;
      post.title = this.state.title;
      post.images = this.state.images;

      this.goToCommentView(post);
    }
  },

  onPostCreated(newPost) {
    // go to comment view
    setTimeout(() => {
      this.goToCommentView(newPost);
    }, 250);
  },

  goToCommentView(post) {
    var route = {
      name: routes.MAIN.COMMENT,
      post: post
    };
    this.props.mainNavigator.replace(route);
  },

  onImageItemRemove(image) {
    var images = this.state.images;
    images = _.reject(images, ($image) => $image.filename == image.filename);
    this.setState({
      images: images
    });
  },

  onChangeText(text) {
    this.titleValue = text;
    this.setState({ title: text });
  },

  _renderBoardItem() {
    var board = (this.props.editing)
      ? this.props.post.board
      : this.props.postingToBoard;

    var boardImageSource = BevyStore.getBoardImage(board.image, 64, 64);

    if(this.props.editing) {
      return (
        <View style={ styles.boardItemDetails }>
          <Image
            source={ boardImageSource }
            style={ styles.boardImage }
          />
          <Text style={styles.boardName}>
            { board.name }
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={ this.goToBoardPickerView }
          activeOpacity={ 0.5 }
        >
          <View style={ styles.boardItemDetails }>
            <Image
              source={ boardImageSource }
              style={ styles.boardImage }
            />
            <Text
              style={ styles.boardName }
              numberOfLines={ 2 }
            >
              { board.name }
            </Text>
            <Icon
              name='chevron-right'
              size={ 48 }
              color='#888'
              style={{
                marginLeft: 10,
                marginRight: -10
              }}
            />
          </View>
        </TouchableOpacity>
      );
    }
  },

  _renderImages() {
    if(_.isEmpty(this.state.images)) return <View />;

    var images = [];
    for(var key in this.state.images) {
      var image = this.state.images[key];
      images.push(
        <NewPostImageItem
          key={ 'inputimage:' + image.filename }
          image={ image }
          onRemove={ this.onImageItemRemove }
        />
      );
    }
    return (
      <View style={ styles.imageBar }>
        <Text style={ styles.sectionTitle }>
          Images
        </Text>
        <ScrollView
          horizontal={ true }
          showHorizontalScrollIndicator={ true }
          contentContainerStyle={ styles.imageScrollBar }
        >
          { images }
        </ScrollView>
      </View>
    );
  },

  _renderContentBar() {
      return (
        <View style={styles.contentBar}>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={ this.addImage }
            style={ styles.contentBarItem }
          >
            <Icon
              name='photo'
              size={ 36 }
              color='rgba(0,0,0,.3)'
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={ this.launchCamera }
            style={ styles.contentBarItem }
          >
            <Icon
              name='add-a-photo'
              size={ 36 }
              color='rgba(0,0,0,.3)'
            />
          </TouchableHighlight>
        </View>
      );
  },

  render() {
    var authorImageSource = UserStore.getUserImage(this.props.user.image, 64, 64);

    return (
      <View style={[ styles.container, {
        marginBottom: (this.state.keyboardSpace == 0) ? 0 : (this.state.keyboardSpace - 48)
      }]}>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <View style={{
              width: 27,
              height: 48
            }}/>
            <Text style={ styles.title }>
              {(this.props.editing)
                ? 'Edit Post'
                : 'New Post'}
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={ this.submit }
            >
              <View style={ styles.createButton }>
                <Text style={ styles.createButtonText }>
                  {(this.props.editing) ? 'Save' : 'Create' }
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={ styles.body }
          contentContainerStyle={{
            paddingBottom: 20
          }}
        >
          <View style={ styles.boardItem }>
            <Text style={ styles.sectionTitle }>Posting To...</Text>
            { this._renderBoardItem() }
          </View>
          <Text style={ styles.sectionTitle }>Post</Text>
          <View style={ styles.input }>
            <Image
              style={ styles.inputProfileImage }
              source={ authorImageSource }
            />
            <TextInput
              ref={ ref => { this.TitleInput = ref; }}
              multiline={ true }
              onChangeText={ this.onChangeText }
              placeholder={ this.state.placeholderText }
              placeholderTextColor='#AAA'
              style={ styles.textInput }
              value={ this.state.title }
            />
          </View>
          { this._renderImages() }
        </ScrollView>
        { this._renderContentBar() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createButton: {
    width: 75,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 17
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 48
  },
  boardItem: {
    flexDirection: 'column',
    padding: 0,
    marginTop: 10,
    marginBottom: 15
  },
  boardName: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    marginLeft: 15,
  },
  boardImage: {
    borderRadius: 6,
    width: 48,
    height: 48
  },
  boardItemDetails: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 0,
    marginTop: 0,
    backgroundColor: '#fff'
  },
  inputProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 15
  },
  textInput: {
    flex: 2,
    fontSize: 17,
    height: 280
  },

  imageBar: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 6,
    flex: 1
  },
  imageScrollBar: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  contentBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 60,
    width: constants.width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE'
  },
  contentBarItem: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    color: '#888',
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = NewPostInputView;
