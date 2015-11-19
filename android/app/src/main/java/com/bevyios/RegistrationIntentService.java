package com.bevyios;

import android.app.IntentService;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.android.gms.gcm.GcmPubSub;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import org.json.*;
import com.loopj.android.http.*;
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.entity.StringEntity;

import java.io.IOException;

public class RegistrationIntentService extends IntentService {

  private static final String TAG = "RegIntentService";
  private static final String[] TOPICS = {"global"};

  private static AsyncHttpClient client = new AsyncHttpClient();

  public RegistrationIntentService() {
    super(TAG);
  }

  @Override
  protected void onHandleIntent(Intent intent) {
    //SharedPreferences sharedPreferences = 
    //  PreferenceManager.getDefaultSharedPreferences(this);
    try {
      // [START register_for_gcm]
      // Initially this call goes out to the network to retrieve the token, subsequent calls
      // are local.
      // R.string.gcm_defaultSenderId (the Sender ID) is typically derived from google-services.json.
      // See https://developers.google.com/cloud-messaging/android/start for details on this file.
      // [START get_token]
      InstanceID instanceID = InstanceID.getInstance(this);
      String token = instanceID.getToken("540892787949",
              GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
      // [END get_token]
      Log.i(TAG, "GCM Registration Token: " + token);

      // TODO: Implement this method to send any registration to your app's servers.
      //sendRegistrationToServer(token, userID);

      // Subscribe to topic channels
      //subscribeTopics(token);

      // Notify UI that registration has completed, so the progress indicator can be hidden.
      Intent registrationComplete = new Intent("REGISTRATION_COMPLETE");
      registrationComplete.putExtra("token", token);
      LocalBroadcastManager.getInstance(this).sendBroadcast(registrationComplete);

      // You should store a boolean that indicates whether the generated token has been
      // sent to your server. If the boolean is false, send the token to your server,
      // otherwise your server should have already received the token.
      //sharedPreferences.edit().putBoolean(QuickstartPreferences.SENT_TOKEN_TO_SERVER, true).apply();
      // [END register_for_gcm]
    } catch (Exception e) {
      Log.d(TAG, "Failed to complete token refresh", e);
      // If an exception happens while fetching the new token or updating our registration data
      // on a third-party server, this ensures that we'll attempt the update at a later time.
      //sharedPreferences.edit().putBoolean(QuickstartPreferences.SENT_TOKEN_TO_SERVER, false).apply();
    }

  }

  /**
   * Persist registration to third-party servers.
   *
   * Modify this method to associate the user's GCM registration token with any server-side account
   * maintained by your application.
   *
   * @param token The new token.
   */
  private void sendRegistrationToServer(String token, String userID) {
    // Add custom implementation, as needed.
    JsonHttpResponseHandler handler = new JsonHttpResponseHandler() {
      @Override
      public void onStart() {
        // called before request is started
      }
      @Override
      public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
        // called when response HTTP status is "200 OK"
      }
      @Override
      public void onFailure(int statusCode, Header[] headers, Throwable e, JSONObject response) {
        // called when response HTTP status is "4XX" (eg. 401, 403, 404)
      }
      @Override
      public void onRetry(int retryNo) {
        // called when request is retried
      }
    };

    String url = "http://api.joinbevy.com/users/" + userID + "/devices";
    String body = "{\"device_id\":\"" + token + "\"}";
    HttpEntity entity = new StringEntity(body, "UTF-8");

    this.client.post(this, url, entity, "application/json", handler);
  }

  /**
   * Subscribe to any GCM topics of interest, as defined by the TOPICS constant.
   *
   * @param token GCM token
   * @throws IOException if unable to reach the GCM PubSub service
   */
  // [START subscribe_topics]
  private void subscribeTopics(String token) throws IOException {
    GcmPubSub pubSub = GcmPubSub.getInstance(this);
    for (String topic : TOPICS) {
      pubSub.subscribe(token, "/topics/" + topic, null);
    }
  }
  // [END subscribe_topics]

}