import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HumanResources from "./pages/HumanResources";
import ISOCertifications from "./pages/ISOCertifications";
import DashBoard from "./pages/DashBoard";
import TrainingPage from "./pages/TrainingPage";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import QualityManagement from "./pages/QualityManagement";
import Login from "./pages/Login";
import DocumentUpload from "./pages/DocumentUpload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  },
  {
    path: "/human-resources",
    element: <HumanResources />,
  },
  {
    path: "/iso-certifications",
    element: <ISOCertifications />,
  },
  {
    path: "/training",
    element: <TrainingPage />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/quality-management",
    element: <QualityManagement />,
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
