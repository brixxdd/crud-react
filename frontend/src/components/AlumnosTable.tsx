import React from 'react';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const AlumnosTable = ({ alumnos, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Vista de escritorio */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Foto</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grado</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex-shrink-0 w-12 h-12">
                    <img 
                      className="w-full h-full rounded-full object-cover" 
                      src={alumno.foto_url ? `${API_URL}${alumno.foto_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(alumno.nombre)}&background=random`}
                      alt={alumno.nombre} 
                    />
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{alumno.nombre}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{alumno.grado}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{alumno.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => onEdit(alumno)} className="bg-[#D4B012] hover:bg-[#b89a10] text-black font-bold py-1 px-3 rounded-full text-xs mr-2">Editar</button>
                  <button onClick={() => onDelete(alumno.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden">
        {alumnos.map((alumno) => (
          <div key={alumno.id} className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                className="w-12 h-12 rounded-full object-cover" 
                src={alumno.foto_url ? `${API_URL}${alumno.foto_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(alumno.nombre)}&background=random`}
                alt={alumno.nombre} 
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{alumno.nombre}</h3>
                <p className="text-sm text-gray-600">Grado: {alumno.grado}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-600">{alumno.email}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(alumno)} className="flex-1 bg-[#D4B012] hover:bg-[#b89a10] text-black font-bold py-2 px-3 rounded-md text-sm">Editar</button>
              <button onClick={() => onDelete(alumno.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumnosTable;