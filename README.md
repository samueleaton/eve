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

####Remove Ignore for Emitter
`Eve.observe("name of listener")`

####Defer an Emitter
This will prevent an emitter from firing (similar to ignore), until a specified emitter fires first. 
`Eve.defer("name of emitter 1", "name of another emitter")`

In the above example, `"name of emitter 1"` will only fire if and when `"name of another emitter"` is fired. 

####Get info about current Listeners (Dev only)
`Eve.probeListeners("name of Listener")`
