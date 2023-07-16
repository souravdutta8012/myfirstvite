import { useEffect, lazy, Suspense } from "react";
import { Navigate, Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
// import { isAdmin } from "./util/Function";

import Header from "./components/header/Header";
import Loading from "./components/loading/Loading";

const Home = lazy(() => import("./components/home/Home"));
const Unknown = lazy(() => import("./components/unknown/Unknown"));

export default function Router() {
    // const { auth } = props;

    useEffect(() => {
        if (import.meta.env.VITE_ENV !== 'prod') {
            // set window document title according to environment
            document.title = 'WIMS - ' + import.meta.env.VITE_ENV;
        }
    }, []);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                closeButton={false}
                rtl={false}
                transition={Slide}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                className="font-semibold"
            />
            {/* {auth.email ? (
                <> */}
            <Header />
            <Outlet />
            {/* </>
            ) :
                (
                    <Loading />
                )
            } */}
        </>
    )
};

export const routers = () => {

    let children: RouteObject[] = [
        {
            path: "/",
            element: <Navigate to="/home" />
        },
        {
            path: "/home",
            element: <Home />
        },
        {
            path: "/unknown",
            element: <Unknown />
        },
        {
            path: "*",
            element: <Navigate to="/unknown" />
        }
    ];

    // if (isAdmin(auth)) {
    //     let protectedpath: RouteObject[] = [

    //     ];

    //     children = protectedpath.concat(children);
    // }

    return createBrowserRouter([
        {
            element: (
                <Suspense fallback={<Loading />}>
                    <Router />
                </Suspense>
            ),
            errorElement: <Unknown />,
            loader: Loading,
            children: children
        }
    ])
};
