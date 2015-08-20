var Eve = (function(){

	var _events = {};
	var _ignoreEvents = {};
	
	function addEventObserver(evtName, fn) {
		var eventObject = {
			fn: fn
		};

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
			
			console.warn("%cEve.probeListeners","background-color:rgb(200,235,255);padding:2px 4px;","is not functional for production");
			


		},

		getEventList: function(){
			return _events;
		}
		



	};
})();


		
