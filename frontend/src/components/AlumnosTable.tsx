import React from 'react';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const AlumnosTable = ({ alumnos, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
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
  );
};

export default AlumnosTable;