
export function SignatureSection() {
  return (
    <>
      {/* Signature Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
        <div>
          <h3 className="font-medium text-lg mb-2">Requisitante</h3>
          <div className="text-sm text-gray-500 mt-2">
            Data: ___/___/_____
          </div>
          <div className="border-t border-gray-300 mt-6 pt-2 text-center text-sm text-gray-500">
            Assinatura
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg mb-2">Gerência / Direção</h3>
          <div className="text-sm text-gray-500 mt-2">
            Data: ___/___/_____
          </div>
          <div className="border-t border-gray-300 mt-6 pt-2 text-center text-sm text-gray-500">
            Assinatura
          </div>
        </div>
      </div>
      
      {/* Encerramento Section */}
      <div className="bg-gray-100 p-4 rounded-md text-center">
        <h3 className="font-semibold text-xl mb-2">ENCERRAMENTO</h3>
        <div className="text-sm text-gray-500 mt-2">
          Data: ___/___/_____
        </div>
        <div className="border-t border-gray-300 mt-6 pt-2 text-center text-sm text-gray-500">
          RH
        </div>
      </div>
    </>
  );
}
