// Eve.js by Sam Eaton (samueleaton)
// Source Code
// MIT License

var Eve = (function(){

	var _events = {};
	var _ignoredEvents = {};
	var _deferredEvents = {};

	var _ignoreEventsUntil = {};
	var _deferEventsUntil = {};

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
		delete _ignoredEvents[evtName];
	}



	function emitEvent() {

		var args = [];
		for(var i = 0, ii = arguments.length; i < ii; i++){
			args[i] = arguments[i];
		}

		var evtName = args.shift();
		var evts = _utils.isArray(evtName) ? evtName : [evtName];

		for(var i = 0, ii = evts.length; i < ii; i++){
			/*
			if:
				Emitter is not being ignored
				Emitter is not being deferred
				Emitter has listeners
			*/
			if(!_ignoredEvents[evts[i]] && !_deferredEvents[evts[i]] && _events[evts[i]]) {
				for(var j = 0, jj = _events[evts[i]].length; j < jj; j++){
					_events[evts[i]][j].fn.apply(null, args);
				}
			}

			/*
			if:
				Emitter is not being ignored
				Emitter is not being deferred
				Emitter will trigger a deferred emitter
			*/
			if(!_ignoredEvents[evts[i]] && !_deferredEvents[evts[i]] && _deferEventsUntil[evts[i]] && _deferEventsUntil[evts[i]].length){
				while (_deferEventsUntil[evts[i]].length) {
					var emitter = _deferEventsUntil[evts[i]].shift();
					if(_deferredEvents[emitter]) {
						delete _deferredEvents[emitter];
						Eve.emit(emitter)
					}
				}
				delete _deferEventsUntil[evts[i]];
			}

			/*
			if:
				Emitter is not being ignored
				Emitter is not being deferred
				Emitter will remove 'ignore' for another emitter
			*/
			if(!_ignoredEvents[evts[i]] && !_deferredEvents[evts[i]] && _ignoreEventsUntil[evts[i]] && _ignoreEventsUntil[evts[i]].length){
				while (_ignoreEventsUntil[evts[i]].length) {
					var emitter = _ignoreEventsUntil[evts[i]].shift();
					if(_ignoredEvents[emitter]) {
						delete _ignoredEvents[emitter];
						Eve.emit(emitter)
					}
				}
				delete _ignoreEventsUntil[evts[i]];
			}
		}
			
	}


	function ignoreEventEmitter(evtName) {
		_ignoredEvents[evtName] = true;
		var _evtName = evtName;
		return {
			getEvt: function(){
				return _evtName;
			},
			until: function (ignoreUntil) {
				_ignoreEventsUntil[ignoreUntil] = _ignoreEventsUntil[ignoreUntil] ? _ignoreEventsUntil[ignoreUntil] : [] ;
				_ignoreEventsUntil[ignoreUntil].push(this.getEvt());
			}
		}
	}



	function deferEmitter(evtName) {
		_deferredEvents[evtName] = true;
		var _evtName = evtName;
		return {
			getEvt: function(){
				return _evtName;
			},
			until: function (deferUntil) {
				_deferEventsUntil[deferUntil] = _deferEventsUntil[deferUntil] ? _deferEventsUntil[deferUntil] : [] ;
				_deferEventsUntil[deferUntil].push(this.getEvt());
			}
		}
	}


	/*
	Removes an event from _ignoredEvents and _deferredEvents
	*/
	function observeEventEmitter(evtName) {
		delete _ignoredEvents[evtName];
		delete _deferredEvents[evtName];
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
