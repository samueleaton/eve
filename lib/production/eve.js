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
		delete _ignoredEvents[evtName];
	}



	function emitEvent() {
		var args = [];
		for(var i = 0, ii = arguments.length; i < ii; i++){
			args[i] = arguments[i];
		}

		var evtName = args.shift();

		/*
		if:
			Emitter is not being ignored
			Emitter is not being deferred
			Emitter has listeners
		*/
		if(!_ignoredEvents[evtName] && !_deferredEvents[evtName] && _events[evtName]) {
			for(var j = 0, jj = _events[evtName].length; j < jj; j++){
				_events[evtName][j].fn.apply(null, args);
			}
		}

		/*
		if:
			Emitter is not being ignored
			Emitter is not being deferred
			Emitter will trigger a deferred emitter
		*/
		if(!_ignoredEvents[evtName] && !_deferredEvents[evtName] && _deferEventsUntil[evtName] && _deferEventsUntil[evtName].length){
			while (_deferEventsUntil[evtName].length) {
				var emitter = _deferEventsUntil[evtName].shift();
				if(_deferredEvents[emitter]) {
					delete _deferredEvents[emitter];
					Eve.emit(emitter)
				}
			}
			delete _deferEventsUntil[evtName];
		}

		/*
		if:
			Emitter is not being ignored
			Emitter is not being deferred
			Emitter will remove 'ignore' for another emitter
		*/
		if(!_ignoredEvents[evtName] && !_deferredEvents[evtName] && _ignoreEventsUntil[evtName] && _ignoreEventsUntil[evtName].length){
			while (_ignoreEventsUntil[evtName].length) {
				var emitter = _ignoreEventsUntil[evtName].shift();
				if(_ignoredEvents[emitter]) {
					delete _ignoredEvents[emitter];
					Eve.emit(emitter)
				}
			}
			delete _ignoreEventsUntil[evtName];
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

		getEventList: function(){
			return _events;
		}
	};
})();
