// Eve.js by Sam Eaton (samueleaton)
// Source Code
// MIT License

var Eve = (function(){

	var _events = {};
	var _ignoreEvents = {};
	var _deferEvents = {};

	var _utils = {
		isArray: function(obj){
			if(Array.isArray && Array.isArray(obj)) return true;
			if(obj.constructor === Array) return true;
			if(obj instanceof Array) return true;
			return false;
		}
	}
	
	function addEventObserver(evtName, fn) {

		var eventObject = {
			fn: fn
		};

		var evts = _utils.isArray(evtName) ? evtName : [evtName];

		for(var i = 0, ii = evts.length; i < ii; i++){
			_events[evts[i]] = _events[evts[i]] || [];
			_events[evts[i]].push(eventObject);
		}

	}



	function removeEventObserver(evtName, fn) {
		if (_events[evtName]) {
			for (var i = 0; i < _events[evtName].length; i++) {

				if (_events[evtName][i].fn === fn || _events[evtName][i].fn.toString() === fn.toString()) {
					_events[evtName].splice(i, 1);
					break;
				}
			};
		}
	}

	function removeAllEventObservers(evtName) {
		delete _events[evtName];
		delete _ignoreEvents[evtName];
	}

	function emitEvent() {
		var args = [];
		for(var i = 0, ii = arguments.length; i < ii; i++){
			args[i] = arguments[i];
		}

		var evtName = args.shift();
		var evts = _utils.isArray(evtName) ? evtName : [evtName];
		for(var i = 0, ii = evts.length; i < ii; i++){
			if(!_ignoreEvents[evts[i]] && _events[evts[i]]) {
				for(var j = 0, jj = _events[evts[i]].length; j < jj; j++){
					_events[evts[i]][j].fn.apply(null, args);
				}
			}

			// console.log("_deferEvents[evts[i]]:",_deferEvents[evts[i]]);
			if(!_ignoreEvents[evts[i]] && _deferEvents[evts[i]] && _deferEvents[evts[i]].length){

				var q = 0;
				// console.log("evts[i]:",evts[i]);
				// console.log("_deferEvents[evts[i]]:",_deferEvents[evts[i]]);
				while (_deferEvents[evts[i]].length) {

					var emitter = _deferEvents[evts[i]].shift();
					delete _ignoreEvents[emitter];
					Eve.emit(emitter)
				}
			}

		}

			


			
	}

	function ignoreEventEmitter(evtName) {
		_ignoreEvents[evtName] = true;
	}

	function observeEventEmitter(evtName) {
		delete _ignoreEvents[evtName];
	}


	function deferEmitter(evtName, deferUntil) {
		_ignoreEvents[evtName] = true;
		_deferEvents[deferUntil] = _deferEvents[deferUntil] ? _deferEvents[deferUntil] : [] ;
		_deferEvents[deferUntil].push(evtName);
	}



	return {
		on: addEventObserver,

		remove: removeEventObserver,

		removeAll: removeAllEventObservers,

		emit: emitEvent,

		ignore: ignoreEventEmitter,

		observe: observeEventEmitter,

		defer: deferEmitter,


		probeListeners: function(evtName){
			
			console.warn("%cEve.probeListeners","background-color:rgb(200,235,255);padding:2px 4px;","is not functional for production");
			


		},

		getEventList: function(){
			return _events;
		}
		



	};
})();


/*ADD THIS
eve.emit(["emitter1", "emitter2"]);

eve.on("emitter1", function(){}); //will fire
eve.on("emitter2", function(){}); //will fire
eve.on(["emitter1", "emitter2"], function(){}); //will fire
eve.on(["emitter1", "emitter2", "emitter3"], function(){}); //will NOT fire


*/	


/*ADD THIS
eve.hang("emitter1").until("emitter2");

eve.emit("emitter1") // does nothing

eve.emit("emitter2") // Fires emitter2, then emitter1

-OR-

eve.hang(["emitter1", "emitter3"]).until("emitter2");

eve.emit("emitter2") // Fires emitter2, then emitter1


*/	
