
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
