import { Box, Grommet } from 'grommet';
import { theme } from './config'
import { FailedScreen, LaunchScreen, MainPage, TopBar } from './pages';
import { useSelector } from 'react-redux';
import {fetchDataAndDoSomething} from './utils/graphUtils';
import { useEffect, useState } from 'react';


const App = ( ) => {

  // this will keep loader active until the data is fetched or if there is an error
  const [loadingStatus, setLoadingStatus] = useState(true);

  // this will display error message screen if there is an error
  const [failedStatus, setFailedStatus] = useState(false);

  const githubDetail = useSelector((state: any) => state.githubDetail);
  useEffect(() => {
    fetchDataAndDoSomething(githubDetail);
  }, [githubDetail]);

  const nodesAndEdges = useSelector((state: any) => state.nodesAndEdges);
  useEffect(() => {
    if (nodesAndEdges.initialNodes.length !== undefined && nodesAndEdges.initialNodes.length > 0) {
      setLoadingStatus(false);
    }else if(nodesAndEdges.error !== ''){
      setLoadingStatus(false);
      setFailedStatus(true);
    }
  }, [nodesAndEdges]);


  return (
    <Grommet theme={theme} >
      <Box>
        { loadingStatus && <LaunchScreen /> }
        { !loadingStatus && !failedStatus && <TopBar></TopBar> }
        { failedStatus && <FailedScreen message={nodesAndEdges.error} /> }
        <MainPage></MainPage>
      </Box>
    </Grommet>
  );
}

export default App;
