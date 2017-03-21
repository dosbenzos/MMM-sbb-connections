/* Magic Mirror
 * Module: sbb-connections
 *
 * By Bendicht Eggimann
 */

Module.register("MMM-sbb-connections",{
	// Default module config.
	result: [],
	sbbConnections: {},
	defaults: {
		from: 'Rotkreuz',
		to: 'Luzern',
		limit: '3',
        direct: '1'
	},
    // Define styles.
    getStyles: function() {
        return ["sbb-connections.css"];
    },

	start: function() {
		Log.info("Starting module: " + this.name);
		var self = this;

		//Do this one first
		var param = "from=" + this.config.from + "&to=" + this.config.to + "&limit=" + this.config.limit + "&direct=" + this.config.direct;
		self.sendSocketNotification('START', param);
	},
	
	// Override dom generator.
	getDom: function() {
		var self = this;
        var wrapper = document.createElement("div");
        wrapper.id = "MMM-sbb-connections"
		try{var test = this.sbbConnections.connections[0];}
		catch(err){
			Log.info("sbbConnections is empty");
			wrapper.innerHTML = "SBB-Connections lädt...";
			return wrapper;
		}
		Log.log("Updating SBB-Connections DOM.");
		var sbbHeader = document.createElement("div");
		var sbbCounter = document.createElement("div");
		var sbbTable = document.createElement("table");
		//sbbHeader.innerHTML = this.config.from + " - " + this.config.to;

		var countDownDate = new Date(this.sbbConnections.connections[0].from.departureTimestamp * 1000).getTime();
        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            sbbCounter.innerHTML = self.config.from + " - " + self.config.to + " in " + minutes + " min ";

            // If the count down is finished, write some text
            if (distance < 0 && distance > -59999) {
                //clearInterval(x);
                sbbCounter.innerHTML = "Zug fährt ab...";
            }else if(distance < -60000){
                clearInterval(x);
                sbbCounter.innerHTML = "updating...";
                var param = "from=" + self.config.from + "&to=" + self.config.to + "&limit=" + self.config.limit;
                self.sendSocketNotification('START', param);
            }
        }, 1000);
        var c, r, t;
        t = document.createElement('table');
        r = sbbTable.insertRow(0);
        c = r.insertCell(0);


        var arr = this.sbbConnections.connections;
        var arrlength = arr.length;
        for (var i = 0; i < arrlength; i++) {
            var departureDate = new Date(arr[i].from.departureTimestamp * 1000);
            var arrivalDate = new Date(arr[i].to.arrivalTimestamp * 1000);
            var duration = arrivalDate - departureDate;
            var departure = (departureDate.getHours()<10?'0':'') + departureDate.getHours() + ":" + (departureDate.getMinutes()<10?'0':'') +departureDate.getMinutes();
            var arrival = (arrivalDate.getHours()<10?'0':'') + arrivalDate.getHours() + ":" + (arrivalDate.getMinutes()<10?'0':'') + arrivalDate.getMinutes();
            r = sbbTable.insertRow(i + 1);
        	c = r.insertCell(0);
        	c.innerHTML = departure;
            c = r.insertCell(1);
            c.innerHTML = arrival;
            c = r.insertCell(2);
            c.innerHTML =  duration/1000/60 + " min";
            //t.appendChild()

        }
        var header = sbbTable.createTHead();
        r = header.insertRow(0);
        c = r.insertCell(0)
        c.innerHTML = "Abfahrt";
        c = r.insertCell(1);
        c.innerHTML = "Ankunft";
        c = r.insertCell(2);
        c.innerHTML = "Dauer";

        wrapper.appendChild(sbbHeader);
        wrapper.appendChild(sbbCounter);
        wrapper.appendChild(sbbTable);
        return wrapper;
    	},

	socketNotificationReceived: function(notification, payload) {
		Log.log("socket received from Node Helper (sbb-Connections)");
		if(notification == "SBB_GATEWAY_RESULT"){
			this.sbbConnections = payload;
			//Log.log(payload);
			//this.departure = json.connections[0].from.departureTimestamp;
			//this.departure = json;
			//this.lineNumber = json.connections[0].sections[0].journey.number;

			this.updateDom();
		}
	}
});
