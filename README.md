# eve
Simple Pub/Sub


###Docs

####Add a Listener
`Eve.on("name of listener", function(params){})`

####Emit an Event
`Eve.emit("name of listener", params)`

####Remove a Listener
`Eve.remove("name of listener", function(params){})`

####Remove all Listeners of Same Name
`Eve.removeAll("name of listener")`

####Ignore any Emitter
`Eve.ignore("name of listener")`

To stop ignoring, `ignore` return an object that contains the `until` method.  
`Eve.ignore("name of listener").until("name of another listener")`

Example
```javascript
Eve.ignore("name of listener").until("name of another listener")
Eve.emit("name of listener") // does nothing

Eve.emit("name of another listener") // removes the ignore
Eve.emit("name of listener") // Emits "name of listener"
```

Note: Eve.observe(name) will also remove the ignore from an emitter

####Defer an Emitter
This will prevent an emitter from firing (similar to ignore), until a specified emitter fires first. 
`Eve.defer("name of emitter 1").until("name of emitter 2");`

In the above example, `"name of emitter 1"` will only fire if and when `"name of another emitter"` is fired. 

Note: To remove the deferred state without firing emitter, use the `observe` method.

####Remove Ignore/Defer from Emitter
`Eve.observe("name of listener")`

This will remove any `ignore` or pending `defer` states form an emitter.

####Get info about current Listeners (Dev only)
`Eve.probeListeners("name of Listener")`
