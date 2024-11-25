import { Edge, MarkerType, Node } from "reactflow";
import { fetchDataNodesAndEdges } from '../services/getNodesAndEdgeFromGithub';
import { store } from '../store/store'; 
import { nodesAndEdges } from "../store/slice/nodesAndEdgesSlice";
import { openFolder } from "../store/slice/openFolderSlice";


const fetchDataAndDoSomething = async (githubDetail: {owner: string, repo: string, root: string, branch: string, ignore_folder:string[]}) => {
    // console.log('fetchDataAndDoSomething')
    try {
        const responseData = await fetchDataNodesAndEdges(githubDetail.owner, githubDetail.repo, githubDetail.root, githubDetail.branch, githubDetail.ignore_folder);
        // console.log(responseData, responseData.error)
        if(responseData.error !== undefined && responseData.error !== null && responseData.error !== ''){
            const payload = {   
                initialNodes: [],
                initialEdges: [],
                graphAdjListFolder: {},
                graphAdjListFiles: {},
                nodesDictionary: {},
                projectStructure: [],
                error: responseData.error
            }
            // console.log('we found error', payload)
            store.dispatch(nodesAndEdges(payload));
            return;
        }

        const nodeData = responseData.nodes;
        const edgeData = responseData.edges;
        const projectStructure = responseData.projectStructure;
        const info = responseData.info;
        // console.log(responseData)
        let colors = [
            '#F28B82',
            '#FBBC05',
            '#FFF475',
            '#CCFF90',
            '#A7FFEB',
            '#CBF0F8',
            '#AECBFA',
            '#D7AEFB',
            '#FDCFE8',
            '#E6C9A8',
            '#E8EAED',
        ]
        let nodes = [];
        for (let index = 0; index < nodeData.length; index++) {
            nodes.push(nodeData[index] as Node)
            let rand = Math.floor(Math.random() * 6) + 1;
            nodes[index].data.color = colors[rand];
        }
        
        const edges = [];
        for (let index = 0; index < edgeData.length; index++) {
            edges.push(edgeData[index] as Edge);
            edges[index].markerEnd ={
                type: MarkerType.ArrowClosed,
                width: 15, 
                height:15,
                color: '#A9A9A9',
            }
            edges[index].style = {
                strokeWidth: 2,
                stroke: '#A9A9A9',
              }
        }
        
        const initialNodes: Node[] = nodes;
        const initialEdges: Edge[] = edges;
        
        
        type MyMap = { [K: string]: string[] };
        let graphAdjListFolder: MyMap = {};
        let graphAdjListFiles: MyMap = {};
        let nodesDictionary: { [K: string]: Node }= {}
        
        // making adj list for folders
        initialNodes.forEach(node => {
            if(node.type === "group") {
                let parentNode: string = node.parentNode === undefined ? "" : node.parentNode;
                if(graphAdjListFolder[node.id] === undefined) {
                    graphAdjListFolder[node.id]=[];
                }
                if(graphAdjListFolder[parentNode == null ? "" : parentNode] === undefined) {
                    graphAdjListFolder[parentNode == null ? "" : parentNode]=[];
                }
                graphAdjListFolder[parentNode == null ? "" : parentNode].push(node.id);
            }
        });
        
        // making adj list for files in folder
        initialNodes.forEach(node => {
            if(node.type === "group") {
                initialNodes.forEach(file => {
                    if(file.type === "custom" && file.parentNode === node.id) {
                        if(!graphAdjListFiles[node.id]) {
                            graphAdjListFiles[node.id] = [];
                        }
                        graphAdjListFiles[node.id].push(file.id);
                    }
                });
            }
        });
        
        // making a dictionary for all nodes
        initialNodes.forEach(node => {
            nodesDictionary[node.id] = node;
        });

        const payload = {
            initialNodes : initialNodes,
            initialEdges: initialEdges,
            graphAdjListFolder: graphAdjListFolder,
            graphAdjListFiles: graphAdjListFiles,
            nodesDictionary: nodesDictionary,
            projectStructure: projectStructure,
        }
        const infoPayload = {
            id: info.rootNode,
            state: true,
        }
        store.dispatch(openFolder(infoPayload))
        store.dispatch(nodesAndEdges(payload));
    } catch (error) {
        console.error('Error:', error);
    }
};

// Call the function to start the process

// fetchDataAndDoSomething();

export {fetchDataAndDoSomething};
// const initialNodes: Node[] = [];
// const initialEdges: Edge[] = [];


// type MyMap = { [K: string]: string[] };
// let graphAdjListFolder: MyMap = {};
// let graphAdjListFiles: MyMap = {};
// let nodesDictionary: { [K: string]: Node }= {}

// let colors = [
//     "Red",
//     "Orange",
//     "Yellow",
//     "Green",
//     "Teal",
//     "Blue",
//     "Dark Blue",
//     "Purple",
//     "Pink",
//     "Brown",
//     "Gray",
// ]
// let nodes = [];
// for (let index = 0; index < nodeData.length; index++) {
//     nodes.push(nodeData[index] as Node)
//     let rand = Math.floor(Math.random() * 6) + 1;
//     nodes[index].data.color = colors[rand];
// }

// const edges = [];
// for (let index = 0; index < edgeData.length; index++) {
//     edges.push(edgeData[index] as Edge);
//     edges[index].markerEnd ={
//         type: MarkerType.ArrowClosed,
//         width: 15, 
//         height:15,
//         color: '#A9A9A9',
//     }
//     edges[index].style = {
//         strokeWidth: 2,
//         stroke: '#A9A9A9',
//       }
// }


// // making adj list for folders
// initialNodes.forEach(node => {
//     if(node.type === "group") {
//         let parentNode: string = node.parentNode === undefined ? "" : node.parentNode;
//         if(graphAdjListFolder[node.id] === undefined) {
//             graphAdjListFolder[node.id]=[];
//         }
//         if(graphAdjListFolder[parentNode == null ? "" : parentNode] === undefined) {
//             graphAdjListFolder[parentNode == null ? "" : parentNode]=[];
//         }
//         graphAdjListFolder[parentNode == null ? "" : parentNode].push(node.id);
//     }
// });

// // making adj list for files in folder
// initialNodes.forEach(node => {
//     if(node.type === "group") {
//         initialNodes.forEach(file => {
//             if(file.type === "custom" && file.parentNode === node.id) {
//                 if(!graphAdjListFiles[node.id]) {
//                     graphAdjListFiles[node.id] = [];
//                 }
//                 graphAdjListFiles[node.id].push(file.id);
//             }
//         });
//     }
// });

// // making a dictionary for all nodes
// initialNodes.forEach(node => {
//     nodesDictionary[node.id] = node;
// });

// export {initialNodes, initialEdges, graphAdjListFolder, graphAdjListFiles, nodesDictionary};





// console.log(initialNodes, initialEdges)

// export const initialNodes: Node[] = [
//     // { id: 'Bigbox', position: { x: 0, y: 0 }, type: "groupBox", data: { icon: "CaretDownFill", label: 'Box' ,},  hidden:false},
//     // { id: 'box', position: { x: 0, y: 0 }, type: "groupBox", data: { icon: "CaretDownFill", label: 'Box' ,}, parentNode: 'Bigbox', extent: 'parent', hidden:false},
//     { id: 'box', position: { x: 0, y: 0 }, type: "groupBox", data: { icon: "CaretDownFill", label: 'Box' ,}, hidden:false},
//     // { id: '1', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file1' }, },
//     // { id: '2', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file2' } }, 
//     // { id: '3', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file3' }, },
//     // { id: '4', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file4' } },
//     // { id: '5', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file5' } },
//     // { id: '6', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file6' } },
//     // { id: '7', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' } },
//     { id: '6', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file6' },parentNode: 'box', extent: 'parent', hidden:false},
//     { id: '7', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',  hidden:false },
//     { id: '8', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',  hidden:false },
//     { id: '9', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',  hidden:false },
//     { id: '10', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',  hidden:false},
//     // { id: '8', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file8' } },
//     // { id: '9', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file9' } },
//     // { id: '10', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file10' } },
// ];



// export const initialNodes:Node[] = [
//     { id: 'box', position: { x: 0, y: 0 }, type: "groupBox", data: { icon: "CaretDownFill", label: 'Box' ,}},
//     // { id: '1', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file1' }, },
//     // { id: '2', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file2' } }, 
//     // { id: '3', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file3' }, },
//     // { id: '4', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file4' } },
//     // { id: '5', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file5' } },
//     // { id: '6', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file6' } },
//     // { id: '7', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' } },
//     { id: '6', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file6' },parentNode: 'box', extent: 'parent',},
//     { id: '7', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',},
//     { id: '8', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',},
//     { id: '9', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',},
//     { id: '10', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file7' },parentNode: 'box', extent: 'parent',},
//     // { id: '8', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file8' } },
//     // { id: '9', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file9' } },
//     // { id: '10', position: { x: 0, y: 0 }, type: "custom", data: { icon: "CaretDownFill", label: 'file10' } },
// ];


// export const initialEdges = [
//     { id: 'e1', source: '1', target: '2', label: "component" },
//     { id: 'e2', source: '1', target: '3', label: "interface" },
//     { id: 'e7', source: '1', target: '8', label: "db" },
//     { id: 'e3', source: '2', target: '4', label: "box" },
//     { id: 'e4', source: '2', target: '5', label: "labels" },
//     { id: 'e5', source: '3', target: '6', label: "status" },
//     { id: 'e6', source: '3', target: '7', label: "files" },
//     { id: 'e8', source: '8', target: '9', label: "model" },
//     { id: 'e10', source: '8', target: '10', label: "migration" },
// ];


