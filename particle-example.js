// Create a MongoDB collection to store event data from Photons
MyEvents = new Mongo.Collection("MyEvents");

if (Meteor.isServer) { // Server Logic
  // (1) Invoke the Spark Cloud object from the NPM module we included
  //     in packages.json.
  Spark = Meteor.npmRequire('spark');

  // (2) Once we're all logged in, what's the plan?
  Spark.on('login', Meteor.bindEnvironment( function(err, body) {
    if (err) {
      console.error(err);
    } else {
      // (4) Listen for device events with the name "someEventName":
      Spark.onEvent('someEventName', Meteor.bindEnvironment( function (data) {
        // Here's where the magic happens:  take the data from the message
        // and create a new Event object in our MongoDB collection.
        MyEvents.insert({
          device_id: data.coreid,
          message: data.data,
          timestamp: new Date()
        });
      }));
    }
  }));

  // (3) Login to the Spark Cloud!
  Spark.login({
    accessToken: "put your Spark token here"
  });

} else if (Meteor.isClient) {  // Client Logic
  // (1) This helper means when you write '{{getRealtimeEvents}}' anywhere in
  //     your app's HTML, you'll get a realtime array of events from the DB.
  Template.registerHelper('getRealtimeEvents', function() {
    return MyEvents.find().fetch();
  });
}
