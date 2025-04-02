
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <Button 
          variant="default" 
          onClick={handleReturn}
          className="hover:bg-primary/90"
        >
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
