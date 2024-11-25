import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    Node,
    Edge,
    Connection,
    addEdge,
    getOutgoers,
    getIncomers,
    getConnectedEdges,
    isNode,
    isEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, RangeInput } from 'grommet';

import CustomNode from '../utils/nodes/customNode';
import { NoteEditor } from '../editor/notesEditor'
import { CodeEditor } from '../editor/codeEditor';

// import '../utils/graphUtils'; // Assuming graphUtils will handle graph related operations


import ProjectStructure from '../utils/projectStructure';
import Draggable from '../utils/useDrag';

import { useSelector } from 'react-redux';
import { IsettingState } from '../store/slice/settingSlice';
import CustomBox from '../utils/nodes/customBox';
import { graphNodeDimension } from '../utils/graphNodeDimensions';

const nodeTypes = { custom: CustomNode, group: CustomBox };


const MainPage = () => {

    const editorState: IsettingState = useSelector((state: any) => state.settings as IsettingState);
    const showSidebar = editorState.code || editorState.note
    // console.log('main page', showSidebar, editorState.code, editorState.note)
    const nodesAndEdges = useSelector((state: any) => state.nodesAndEdges);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    useEffect(() => {
        // console.log('hit in main page')
        setNodes(nodesAndEdges.initialNodes);
        setEdges(nodesAndEdges.initialEdges);
    }, [nodesAndEdges.initialNodes, nodesAndEdges.initialEdges])


    const openFolderState = useSelector((state: any) => state.openFolder);
    useEffect(() => {
        // console.log('hit in main page useeffect')
        if (nodes.length === 0 && nodesAndEdges.initialNodes.length >= 1) {
            const updatedNode = graphNodeDimension(openFolderState, nodesAndEdges.initialNodes, nodesAndEdges)
            setNodes(updatedNode)
        }
        else if (nodes.length >= 1) {
            const updatedNode = graphNodeDimension(openFolderState, nodes, nodesAndEdges)
            setNodes(updatedNode)
        }
    }, [openFolderState, nodesAndEdges]);



    // ReactFlow Setting
    // -------------------------------------------------------------------------------------------
    const hideBanner = { hideAttribution: true };
    const intialFitViewOptions = {
        maxZoom: 1,
        minZoom: 0,
    };
    const [fitViewOptions, setFitViewOptions] = useState(intialFitViewOptions);
    // -------------------------------------------------------------------------------------------


    // Bar Control to adjust size of code and graph
    // -------------------------------------------------------------------------------------------
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth / 2);
    const [mainContentbarWidth, setMainContentBarWidth] = useState(window.innerWidth / 2);

    const startResizing = React.useCallback((_mouseDownEvent: any) => {
        setIsResizing(true);
    }, []);
    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);
    const resize = React.useCallback(
        (mouseMoveEvent: { clientX: number; }) => {
            if (isResizing && sidebarRef.current) {
                // console.log(mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left, window.innerWidth / 1.8)
                setSidebarWidth(
                    Math.min(mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left, window.innerWidth / 2)
                );
            }
        },
        [isResizing]
    );
    useEffect(() => {
        const totalWidth = window.innerWidth;
        const minMainContentWidth = window.innerWidth / 4;
        const newMainContentWidth = Math.min(totalWidth - sidebarWidth, window.innerWidth - minMainContentWidth);
        setMainContentBarWidth(Math.max(newMainContentWidth, minMainContentWidth));
    }, [sidebarWidth]);
    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);
    // -------------------------------------------------------------------------------------------


    // Highlight the node and its parent and child  when mouse move down
    // Reset back to original position when mouse move up
    // -------------------------------------------------------------------------------------------
    const highlightPath = (node: Node, nodes: Node[], edges: Edge[], selection: boolean) => {

        if (node.type === "custom") {
            const allIncomers = getIncomers(node, nodes, edges);
            const allOutgoers = getOutgoers(node, nodes, edges);

            const nodeAffected: (string | undefined)[] = [];
            // Update styles for nodes
            const updatedNodes = nodes.map((elem) => {
                const isIncomer = allIncomers.some((incomer) => incomer.id === elem.id);
                const isOutgoer = allOutgoers.some((outgoer) => outgoer.id === elem.id);
                const highlight = elem.id === node.id || isIncomer || isOutgoer;
                const opacity = highlight ? 1 : 0.25;

                let borderColor;
                if (isIncomer) borderColor = 'red';
                if (isOutgoer) borderColor = 'green';

                if (highlight) {
                    nodeAffected.push(elem.parentNode)
                }

                return {
                    ...elem,
                    data: {
                        ...elem.data,
                        border: highlight ? borderColor : undefined,
                    },
                    style: {
                        ...elem.style,
                        opacity,
                    },
                };
            });





            // Find parent nodes of affected nodes and set their opacity to 1
            const updatedNodesWithParentOpacity = updatedNodes.map((elem) => {
                if (nodeAffected.includes(elem.id)) {
                    // Adjust opacity of parent nodes
                    return {
                        ...elem,
                        style: {
                            ...elem.style,
                            opacity: 1,
                        },
                    };
                }
                return elem;
            });

            setNodes(updatedNodesWithParentOpacity)

            // Update styles for edges
            // const updatedEdges = edges.map((elem) => {
            //     const isIncomer = allIncomers.some((incomer) => incomer.id === elem.id);
            //     const isOutgoer = allOutgoers.some((outgoer) => outgoer.id === elem.id);
            //     console.log(elem, isIncomer, isOutgoer)
            //     const highlight = elem.id === node.id || isIncomer || isOutgoer;
            //     const animated = highlight ? false : true;

            //     return {
            //         ...elem,
            //         animated: animated, 
            //     }// Adjust as needed based on your condition
            // });
            // setEdges(updatedEdges)
        }


    };
    const resetNodeStyles = (nodes: Node[], edges: Edge[]) => {
        // Assuming you have separate states for nodes and edges
        const updatedNodes = nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                border: undefined,
            },
            style: {
                ...node.style,
                opacity: 1,
            },
        }));
        setNodes(updatedNodes);

        const updatedEdges = edges.map((edge) => ({
            ...edge,
            animated: false, // Adjust animation state based on your requirement
        }));

        setEdges(updatedEdges);
    };
    const nodeHoverState = useSelector((state: any) => state.nodeHover);
    useEffect(() => {
        if (nodeHoverState.state) {
            if (nodesAndEdges.nodesDictionary[nodeHoverState.id]) {
                const node = nodesAndEdges.nodesDictionary[nodeHoverState.id];
                highlightPath(node, nodes, edges, true);
            }
        } else {
            resetNodeStyles(nodes, edges)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeHoverState])
    // -------------------------------------------------------------------------------------------




    return (
        <ReactFlowProvider>
            {!showSidebar}


            <div className="fixed  min-h-screen flex flex-row h-screen bg-white">

                <div
                    ref={sidebarRef}
                    className="flex flex-row bg-white  border-r border-gray-200 z-20"
                    style={showSidebar ? { minWidth: window.innerWidth / 4, width: sidebarWidth } : { width: window.innerWidth }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="flex-1">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            // onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            // onNodeClick={onNodeClick}
                            fitView={true}
                            fitViewOptions={fitViewOptions}
                            proOptions={hideBanner}
                            onNodeMouseEnter={(event, node) =>
                                highlightPath(node, nodes, edges, true)
                            }
                            snapToGrid
                            panOnScroll
                            selectionOnDrag
                            onNodeMouseLeave={(event, node) => resetNodeStyles(nodes, edges)}
                        >
                            <Background variant={BackgroundVariant.Dots} />
                        </ReactFlow>

                    </div>



                    <div
                        className="flex-none w-1.5 cursor-col-resize hover:bg-gray-400"
                        onMouseDown={startResizing}>
                    </div>

                    {   nodesAndEdges.projectStructure.length !==0  &&
                        <Draggable initialX={100} initialY={100} >
                            <div className='absolute top-20'><ProjectStructure /></div>
                        </Draggable>
                    }


                </div>


                {showSidebar &&
                    <div
                        className="pt-2 flex-1 flex flex-col rounded-r-lg"
                        style={{ width: mainContentbarWidth }}
                    >
                        {editorState.note && <NoteEditor />}
                        {editorState.code && <CodeEditor />}
                    </div>
                }

            </div>
        </ReactFlowProvider>
    );
}

export default MainPage;
