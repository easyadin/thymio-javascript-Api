import {createClient, Node, NodeStatus, Request, setup} from '@mobsya/thymio-api'

//Connect to the switch
//We will need some way to get that url, via the launcher
let client = createClient("ws://localhost:8597");
let selectedNode = undefined

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Start monitotring for node event
// A node will have the state
//      * connected    : Connected but vm description unavailable - little can be done in this state
//      * available    : The node is available, we can start communicating with it
//      * ready        : We have an excusive lock on the node and can start sending code to it.
//      * busy         : The node is locked by someone else.
//      * disconnected : The node is gone
client.onNodesChanged = async (nodes) => {
    try {
    //Iterate over the nodes
    for (let node of nodes) {
        console.log(`${node.id} : ${node.statusAsString}`)
          // Select the first non busy node
        if((!selectedNode || selectedNode.status != NodeStatus.ready) && node.status == NodeStatus.available) {
            try {
                console.log(`Locking ${node.id}`)
                // Lock (take ownership) of the node. We cannot mutate a node (send code to it), until we have a lock on it
                // Once locked, a node will appear busy / unavailable to other clients until we close the connection or call `unlock` explicitely
                // We can lock as many nodes as we want
                await node.lock();
                selectedNode = node
                console.log("Node locked")
            } catch(e) {
                console.log(`Unable To Log ${node.id} (${node.name})`)
            }
        }
        if(!selectedNode)
            continue
        try {

            //This is requiered in order to receive the variables and node of a group
            node.watchSharedVariablesAndEvents(true)

            //Monitor the shared variables - note that because this callback is set on a group
            //It does not track group changes
            node.group.onVariablesChanged = (vars) => {
                console.log("shared variables : ", vars)
            }

            //Monitor the event descriptions - note that because this callback is set on a group, it does not track group changes
            node.group.onEventsDescriptionsChanged = (events) => {
                console.log("descriptions", events)
            }

            //Monitor variable changes
            node.onVariablesChanged = (vars) => {
                console.log(vars)
            }

            //Monitor events
            node.onEvents = async (events) => {
                console.log("events", events)
                let { pong: pong } = events;
                if(pong) {
                    await sleep(1000)
                    await node.emitEvents({"ping": null})
                }
            }

            await node.group.setEventsDescriptions([
                {name : "ping", fixed_size : 0}, {name : "pong", fixed_size : 1},
            ])

            await node.sendAsebaProgram(`
                var rgb[3]
                var tmp[3]
                var i = 0
                onevent ping
                    call math.rand(rgb)
                    for i in 0:2 do
                        rgb[i] = abs rgb[i]
                        rgb[i] = rgb[i] % 20
                    end
                    call leds.top(rgb[0], rgb[1], rgb[2])
                    i++
                    emit pong i
            `)
            await node.runProgram()
            await node.emitEvents("ping")
        }
        catch(e) {
            console.log(e)
            process.exit()
        }
    }
}catch(e) {
    console.log(e)
    process.exit()
}
}