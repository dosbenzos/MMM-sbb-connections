/* Magic Mirror
 * Node Helper: SBB-Connections
 *
 * By Bendicht Eggimann
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Started node_helper.js for SBB-Connections.");
	},

	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
		this.sbbGatewayRequest(payload);
	},

	sbbGatewayRequest: function(params) {

		var self = this;
		//var param = "from=" + this.config.from + "&to=" + this.config.to + "&limit=" + this.config.limit;
		//var opendataAPIURL = "http://transport.opendata.ch/v1/connections?from=Luzern%20Kanonenstrasse&to=Luzern&limit=5";
		var opendataURL = "http://transport.opendata.ch/v1/connections";
		var apiUrl = opendataURL + "?" + params;
		request({ url: apiUrl, method: 'GET' }, function(error, response, body) {
			if(!error && response.statusCode == 200){
				var result = JSON.parse(body);
				self.sendSocketNotification('SBB_GATEWAY_RESULT', result);
			}
		});	
	}
});
