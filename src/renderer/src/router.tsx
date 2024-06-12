import { createBrowserRouter, createHashRouter } from "react-router-dom";
import App from "./App";
import { IconGallery } from "./views/IconGallery";
import { Layout } from "./pages/Layout";
import { IconSetPage } from "./pages/IconSetPage";

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/iconset/:prefix',
        element: <IconSetPage />
      }
    ]
  }
])