import React from 'react';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const MaestrosTable = ({ maestros }) => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Listado de Maestros</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Vista de escritorio */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Foto</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Materias Asignadas</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody>
              {maestros.map((maestro) => (
                <tr key={maestro.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex-shrink-0 w-12 h-12">
                          <img 
                              className="w-full h-full rounded-full object-cover" 
                              src={maestro.foto_url ? `${API_URL}${maestro.foto_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(maestro.nombre)}&background=random`}
                              alt={maestro.nombre} 
                          />
                      </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{maestro.nombre}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{maestro.materias}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{maestro.email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista móvil */}
        <div className="md:hidden">
          {maestros.map((maestro) => (
            <div key={maestro.id} className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  className="w-12 h-12 rounded-full object-cover" 
                  src={maestro.foto_url ? `${API_URL}${maestro.foto_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(maestro.nombre)}&background=random`}
                  alt={maestro.nombre} 
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{maestro.nombre}</h3>
                  <p className="text-sm text-gray-600">{maestro.email}</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Materias:</span> {maestro.materias}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaestrosTable;