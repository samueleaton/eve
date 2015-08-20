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

####Get info about current Listeners (Dev only)
`Eve.probeListeners("name of Listener")`
