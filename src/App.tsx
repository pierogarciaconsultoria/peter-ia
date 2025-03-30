
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HumanResources from "./pages/HumanResources";
import DocumentUpload from "./pages/DocumentUpload";
import StrategicPlanning from "./pages/StrategicPlanning"; 
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HumanResources />,
  },
  {
    path: "/human-resources",
    element: <HumanResources />,
  },
  // Adicionar a nova rota para upload de documentos
  {
    path: "/document-upload/:token",
    element: <DocumentUpload />,
  },
  // Adicionar a rota para planejamento estratégico
  {
    path: "/strategic-planning",
    element: <StrategicPlanning />,
  },
  // Adicionar rota para tratamento de 404
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
