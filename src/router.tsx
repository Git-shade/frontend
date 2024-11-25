import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import About from "./pages/about";
import { FailedScreen } from "./pages";
import { githubDetail } from "./store/slice/githubDetailSlice";
import { store } from "./store/store";
import Creator from "./pages/creator";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <About/>,
    },
    {
        path: "/creator",
        element:  <Creator/>,
    },
    {
        path: "/:owner/:repo/*",
        element: <App />,
        loader: async ({ params }) => {
            const { owner, repo, '*': rest } = params;
            const restParts = rest ? rest.split('/') : [];
            const root = restParts.slice(2).join('/');

            const branch = localStorage.getItem(`github2s-${owner}-${repo}-branch`)
            let ignore_folder = localStorage.getItem(`github2s-${owner}-${repo}-ignore_folder`);
            if(ignore_folder!==null){
                ignore_folder = JSON.parse(ignore_folder);
            }            


            store.dispatch(githubDetail({ owner, repo, root, branch, ignore_folder}));
            return {};
        }
    },
    {
        path: "/*",
        element: <FailedScreen message="No Page found"/>,
    },
]);