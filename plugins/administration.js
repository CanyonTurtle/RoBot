// The goal of this module is to build in
// the ability to moderate the chat more efficiently.
// We will use this to keep track of current cases.
// DQs a user has on them, and much more.
// This will tie into the verification system, and thus
// create a way to track all sorts of user data, and allow
// us, the admins, to moderate the chat in a far more efficient way.
//
// Some examples of features:
// * Slow Mode
// * In-Chat DQ
// * Auto-Mute
// * Moderator Tools for Handling Cases.
// * Demote/Rank Up Users.
// * Kick/Ban Users
// * Force Skip Music <-- See musicplayer.js
// * Add/Remove data from the helpful links list.
// * Check if user already registerred.

var firebase = require('firebase');

// Initialize the app with no authentication
firebase.initializeApp({
	serviceAccount: "./vexbot-6c4a4d1a2f1c.json",
    databaseURL: "https://vexbot-668e9.firebaseio.com"
});


vexBot.commands.register = function(data) {
	var db = firebase.database();
	var ref = db.ref("userData");
	var splitChar = ";";
	var lastStart = 0;
	var numOfItems = 1;
	var userInfo = [];
	var userStuff = data.id;
	var usersRef = ref.child("users");
	var count = 0;
	var registered = false;

	// Indexing Algorithm
	for(var a = 0; a < data.message.length; a++) {
		if(data.message.charAt(a) == splitChar) {
			userInfo[numOfItems-1] = data.message.substring(lastStart, a);
			numOfItems++;
			lastStart = a+1;
		} else {
			//console.log("False at" + a);
		}
	}
	//console.log(data.message.substring(lastStart, data.message.length));
	userInfo[numOfItems-1] = data.message.substring(lastStart, data.message.length);
	//console.log(userInfo);

	if(userInfo[2]) {
		data.respond("Sorry, you have inputted too many paramaters");
	} else {
		// This should do something
		usersRef.orderByChild(data.id).on("child_added", function(snapshot) {
			// Supposed to check user id vs snapshot id
			if(snapshot.val().registered) {
				data.respond("You are already registered");
			} else {
				usersRef.child(userStuff).set({
					registered: true,
					teamNumber: userInfo[1],
					name: userInfo[0]
				});
				data.respond("Congratulations, " + userInfo[0] + " you have now registered as Team#: " + userInfo[1]);
				// Validation For Team or Non-Team
				if(userInfo[1].toUpperCase() == "NONE") {
					vexBot.client.addToRole({
						server: "197777408198180864",
						user: data.id,
						role: "197817210729791489"
					});
					vexBot.client.editNickname({
						nick: "Testing"
					});
					data.respond("Added to Non Competitor Role!");
				} else {
					vexBot.client.addToRole({
						server: "197777408198180864",
						user: data.id,
						role: "197836716726288387"
					});
					data.respond("Added to VEX Member Role");
					vexBot.client.editNickname({
						nick: userInfo[0] + " | " + userInfo[1]
					});
					data.respond("Nick Submitted");
				}
			}
		});
	}
	console.log(registered);
};
vexBot.commandUsage.poll = "<Name>;<TeamNumber>";
vexBot.commandDescs.poll = "Registers you as a member with name: <Name> on team: <TeamNumber>";

vexBot.commands.roles = function(data) {
	console.log("Pre-Loop");
	console.log("Roles \n");
	console.log(data.event);
	var channelID = data.channel;
	var serverID = vexBot.client.channels[channelID].guild_id;
	for(var i in vexBot.client.servers[serverID].roles) {
		console.log(vexBot.client.servers[serverID].roles[i]);
	}
	data.respond(vexBot.servers);
	console.log("Post Loop");
};
vexBot.commandUsage.roles = "";
vexBot.commandDescs.roles = "Logs the role  IDs to the command line";
