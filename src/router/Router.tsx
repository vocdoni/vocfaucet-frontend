import { lazy } from "react";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// These aren't lazy loaded to avoid excessive loaders in different locations
import Layout from "../elements/Layout";
import Error from "../elements/Error";
import LayoutContents from "../elements/LayoutContents";
import { SuspenseLoader } from "./SuspenseLoader";

// Lazy loading helps splitting the final code, which helps downloading the app (theoretically)
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));
const Home = lazy(() => import("../elements/Home"));
const NotFound = lazy(() => import("../elements/NotFound"));

export const RoutesProvider = () => {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route errorElement={<Error />}>
          <Route element={<LayoutContents />}>
            <Route
              index
              element={
                <SuspenseLoader>
                  <Home />
                </SuspenseLoader>
              }
            />
          </Route>
          <Route element={<LayoutContents />}>
            <Route
              element={
                <SuspenseLoader>
                  <ProtectedRoutes />
                </SuspenseLoader>
              }
            ></Route>
          </Route>
          <Route
            path="*"
            element={
              <SuspenseLoader>
                <NotFound />
              </SuspenseLoader>
            }
          />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
