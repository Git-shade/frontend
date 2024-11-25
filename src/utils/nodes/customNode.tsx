import { Box, Card, Text } from 'grommet';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useDispatch, useSelector } from "react-redux"
import { IsettingState, changeCode } from '../../store/slice/settingSlice'
import { githubFile } from '../../store/slice/githubFileSlice';

const CustomNode = (data: any) => {
  const dispatch = useDispatch();
  const editorState: IsettingState = useSelector((state: any) => state.settings as IsettingState);
  const rootFolderAttached = useSelector((state: any) => state.githubDetail.root);

  let border = true;
  if(data.data.border === undefined){
    border = false;
  }
 
  // This helps to being side bar on double click on node
  const doubleClickMouse = () =>{
    let filePath = data.id;

    // If root folder is attached then we need to remove the root folder name from the path
    if(!rootFolderAttached){
      filePath = filePath.split('/').slice(1).join('/') 
    }
    // We can only change it to split screen if select feature is true on node(select false)
    if(!editorState.code){
      // console.log('double', editorState.code)
      dispatch(changeCode(true))
      dispatch(githubFile({file: filePath}))
      
    }else{
      dispatch(changeCode(false))
    }
  }

  const singleClickMouse = () =>{
    let filePath = data.id;

    if(!rootFolderAttached){
      filePath = filePath.split('/').slice(1).join('/') 
    }

    // We can only change it to split screen if select feature is true on node(select false)
    if(editorState.code){
      dispatch(githubFile({file: filePath}))
    }
  }

  return (
    <Card 
      // margin={{top:"10vh", left:"small", right:"small", bottom:"small"}}
      pad="small"
      background="white"
      onDoubleClick={doubleClickMouse}
      onClick={singleClickMouse}
      border= {border? { color: data.data.border , style: 'dashed', size:'medium'}: false}
    >
      <Box justify='around' direction='row' alignContent='center'>
        <Text >{data.data.label}</Text>

      </Box>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}

export default memo(CustomNode);

