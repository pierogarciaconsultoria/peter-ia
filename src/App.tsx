
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HumanResources from "./pages/HumanResources";
import DocumentUpload from "./pages/DocumentUpload";
import StrategicPlanning from "./pages/StrategicPlanning"; 
import NotFound from "./pages/NotFound";
import Documents from "./pages/Documents";
import NonCompliance from "./pages/NonCompliance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HumanResources />,
  },
  {
    path: "/human-resources",
    element: <HumanResources />,
  },
  {
    path: "/document-upload/:token",
    element: <DocumentUpload />,
  },
  {
    path: "/strategic-planning",
    element: <StrategicPlanning />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  {
    path: "/non-compliance",
    element: <NonCompliance />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
