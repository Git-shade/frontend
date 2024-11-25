import { createSlice } from "@reduxjs/toolkit";
import { Node, Edge } from "reactflow";
type MyMap = { [K: string]: string[] };

const initialState = {
    'initialNodes' : [] as Node[],
    'initialEdges': [] as Edge[],
    'graphAdjListFolder': {} as MyMap,
    'graphAdjListFiles': {} as MyMap,
    'nodesDictionary': {} as { [K: string]: Node },
    'projectStructure': [],
    'error': ''
}

export const nodesAndEdgesSlice = createSlice({
    name: 'githubDetail',
    initialState,
    reducers: {
        nodesAndEdges: (state , action) =>{
            state.initialNodes = action.payload.initialNodes;
            state.initialEdges = action.payload.initialEdges;
            state.graphAdjListFolder = action.payload.graphAdjListFolder;
            state.graphAdjListFiles = action.payload.graphAdjListFiles;
            state.nodesDictionary = action.payload.nodesDictionary; 
            state.projectStructure = action.payload.projectStructure;
            state.error = action.payload.error;
        },
    }
})


export const {nodesAndEdges} = nodesAndEdgesSlice.actions

export default nodesAndEdgesSlice.reducer