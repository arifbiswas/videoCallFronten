import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import GroupCall from "../GroupCall";

export const routers = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/group",
        element: <GroupCall />
    }
])