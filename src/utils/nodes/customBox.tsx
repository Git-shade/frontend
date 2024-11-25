import { Text } from 'grommet';
import { Down, Expand, Next } from 'grommet-icons';
import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NodeResizeControl } from 'reactflow';
import { openFolder } from '../../store/slice/openFolderSlice';

const CustomBox = (data: any) => {
  // console.log(data)
  const dispatch = useDispatch();

  const [folderOpen, setFolderOpen] = useState(data.data.icon as boolean)

  const hideFolder = () => {
    dispatch(openFolder({ id: data.id, state: !folderOpen }))
    setFolderOpen(folderOpen => !folderOpen)
  }

  // const color = data.data.color
  const color = ''

  return (

    <div className={"absolute child inset-0  p-2 flex justify-start "} style={{backgroundColor:color}}>

      <NodeResizeControl>
        <ResizeIcon ></ResizeIcon>
      </NodeResizeControl> 


      <div onClick={hideFolder}>
      {folderOpen ? <Down size='medium' />:<Next size='medium' /> }
      </div>
    <Text margin={{left:'xsmall'}} size='medium' weight='bold'>{data.id.split('/').pop()}</Text>
      

    </div>

  );
}


function ResizeIcon() {
  return (
    <Expand
      size='small'
      viewBox="0 0 24 24"
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </Expand>
  );
}

export default memo(CustomBox);


// const controlStyle = {
//   background: 'transparent',
//   border: 'none',
// };

// const CustomBox = (data: any) => {

//   const color = `bg-${data.data.color}`

//   const dispatch = useDispatch();

//   const [folderOpen, setFolderOpen] = useState(false)
//   const [width, setWidth] = useState("medium")
//   const [height, setHeight] = useState("medium")

//   const hideFolder = () => {
//     if (folderOpen) {
//       setWidth(width => width = "xsmall")
//       setHeight(height => height = "xxsmall")
//     } else {
//       setWidth(width => width = "medium")
//       setHeight(height => height = "medium")
//     }

//     dispatch(openFolder({ id: data.id, state: !folderOpen }))
//     setFolderOpen(folderOpen => !folderOpen)
//   }

//   return (
//     <>
//       <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
//         <ResizeIcon />
//         <div className={"" + color}>
//           <Box>
//             <Button className='text-bold' onClick={hideFolder} pad="small" margin={{ right: "5%" }} color="white">
//               {folderOpen ? <Next size='small' /> : <Down size='small' />}
//             </Button>
//           </Box>
//           {data.id}
//         </div>
//       </NodeResizeControl>

//       {/* <Handle type="target" position={Position.Left} /> */}

//       {/* <Handle type="source" position={Position.Right} /> */}
//     </>
//   );
// };

// function ResizeIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       strokeWidth="2"
//       stroke="#ff0071"
//       fill="none"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       style={{ position: 'absolute', right: 5, bottom: 5 }}
//     >
//       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//       <polyline points="16 20 20 20 20 16" />
//       <line x1="14" y1="14" x2="20" y2="20" />
//       <polyline points="8 4 4 4 4 8" />
//       <line x1="4" y1="4" x2="10" y2="10" />
//     </svg>
//   );
// }

// export default memo(CustomBox);