var Eve = (function(){

	var _events = {};
	var _ignoreEvents = {};
	
	function addEventObserver(evtName, fn) {
		var eventObject = {
			fn: fn
		};

		
		eventObject.caller = (new Error).stack.split("\n");
		var i = eventObject.caller.length;
		while (i--) {
			if(eventObject.caller[i].toUpperCase() === "ERROR") {
				eventObject.caller.splice(i, 1);
			}
			else if (eventObject.caller[i].indexOf("addEventObserver") !== -1){
				eventObject.caller.splice(i, 1);
			}
		}
		

		_events[evtName] = _events[evtName] || [];
		_events[evtName].push(eventObject);
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
		var evtName = args.splice(0,1);
		if(_ignoreEvents[evtName]) return;
		if (_events[evtName]) {
			_events[evtName].forEach(function(eventObj) {
				eventObj.fn.apply(null, args);
			});
		}
	}

	function ignoreEventEmitter(evtName) {
		_ignoreEvents[evtName] = true;
	}

	function observeEventEmitter(evtName) {
		delete _ignoreEvents[evtName];
	}

	return {
		on: addEventObserver,

		remove: removeEventObserver,

		removeAll: removeAllEventObservers,

		emit: emitEvent,

		ignore: ignoreEventEmitter,

		observe: observeEventEmitter,


		probeListeners: function(evtName){
			
			var callers = [];
			if (_events[evtName]) {
				_events[evtName].forEach(function(eventObj) {
					callers.push(eventObj.caller);
				});
			}
			return callers;
			

			},

		getEventList: function(){
			return _events;
		}
		



	};
})();


		
