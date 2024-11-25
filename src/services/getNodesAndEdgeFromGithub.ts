import axios, { AxiosResponse } from 'axios';


const apiUrl = 'https://0m5ktnebqg.execute-api.us-east-1.amazonaws.com/Test/uuid';

interface FetchDataResponse{
    nodes: any[];
    edges: any[];
    projectStructure: any[];
    info: { rootNode: string };
    error?: {}
}
interface FetchDataResponseFromAPI {
    task_id: string,
    status: string,
    data : FetchDataResponse,
    error? : string
}



const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function* fibonacci() {
    let [a, b] = [1, 2];
    yield a;
    yield b;
    while (true) {
        [a, b] = [b, a + b];
        yield b;
    }
}



export async function fetchDataNodesAndEdges(owner: string, repo: string, root: string, branch?:string, ignore_folder?:string[]): Promise<FetchDataResponse> {
    const body = {
        owner: owner,
        repo: repo,
        root: root,
        ignore_folders:ignore_folder,
        branch:branch
    };
    // console.log('fetching data', body);
    try {
        const response_task_id: AxiosResponse = await axios.post(apiUrl,body);
        // console.log(response_task_id.data);

        const task_id_result = JSON.parse(response_task_id.data.body);
        // console.log(task_id_result, task_id_result['status'])
        const body_with_task_id = { task_id: task_id_result['task_id'], ...body}


        if(task_id_result['status'] === 'COMPLETED'){
            return task_id_result['data']
        }

        let status = 'IN_PROGRESS';
        let resultData: FetchDataResponseFromAPI = {
            task_id: '',
            status: '',
            data: {
                nodes: [],
                edges: [],
                projectStructure: [],
                info: {
                    rootNode: ''
                },
            }
        };

        const fibGen = fibonacci();
        while (status === 'IN_PROGRESS') {
            try {
                const response = await axios.post(apiUrl, body_with_task_id);
                resultData = JSON.parse(response.data.body);
                // console.log(resultData);

                status = resultData.status; // Assuming the status field is present in the response
                
                if (status === 'COMPLETED') {
                    break;
                }
                else if(status === 'FAILED'){
                    return {
                        nodes: [],
                        edges: [],
                        projectStructure: [],
                        info: { rootNode: '' },
                        error: resultData?.error || 'An error occurred'
                    };
                }else{

                }
            } catch (error : any) {
                //  this is handling a case where its FAILED and get 404 
                return {
                    nodes: [],
                    edges: [],
                    projectStructure: [],
                    info: { rootNode: '' },
                    error: error.response?.data?.error || 'An error occurred'
                };
            }
    
            const delayTime = Number(fibGen.next().value) * 1000; 
            // console.log(`Waiting for ${delayTime / 1000} seconds before the next request.`);
            await delay(delayTime);
        }

        return resultData.data;
    } catch (error: any) {
        console.error(error.response?.data?.error);
        return {
            nodes: [],
            edges: [],
            projectStructure: [],
            info: { rootNode: '' },
            error: error.response?.data?.error || 'An error occurred'
        };
    }
}
