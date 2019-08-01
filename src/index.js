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
//TODO add button to trigger onNodeChanged to connect robots
//also display nodes in html

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
               // console.log(vars)

            }

          
            await node.sendAsebaProgram(`
           
            
           
            
                call leds.top(0,0,30)
           
            
                call leds.top(32,0,0)
            
            
           
            
            `)
            await node.runProgram()
        }
        catch(e) {
            console.log(e)
          //  process.exit()
        }
    }
}catch(e) {
    console.log(e)
   // process.exit()
}
}