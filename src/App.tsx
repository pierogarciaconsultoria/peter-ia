
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HumanResources from "./pages/HumanResources";
import DocumentUpload from "./pages/DocumentUpload";

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
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
