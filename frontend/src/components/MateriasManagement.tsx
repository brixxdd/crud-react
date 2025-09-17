import React, { useState } from 'react';
import EditMateriaModal from './EditMateriaModal';
import AssignMaestrosModal from './AssignMaestrosModal';

const MateriasManagement = ({ materias, maestros, onAddMateria, onUpdateMateria, onDeleteMateria, onUpdateMaestros }) => {
  const [newMateriaName, setNewMateriaName] = useState('');
  const [editingMateria, setEditingMateria] = useState(null);
  const [assigningMateria, setAssigningMateria] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMateriaName.trim()) {
      setErrors({ newMateriaName: 'El nombre de la materia es obligatorio.' });
      return;
    }
    onAddMateria({ nombre: newMateriaName });
    setNewMateriaName('');
    setErrors({});
  };

  const handleEditClick = (materia) => {
    setEditingMateria(materia);
    setIsEditModalOpen(true);
  };

  const handleAssignClick = (materia) => {
    setAssigningMateria(materia);
    setIsAssignModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setEditingMateria(null);
    setIsAssignModalOpen(false);
    setAssigningMateria(null);
    setErrors({});
  };

  const handleUpdateSubmit = (id, updatedData) => {
    onUpdateMateria(id, updatedData);
    handleCloseModals();
  };

  const handleAssignSubmit = (materiaId, maestroIds) => {
    onUpdateMaestros(materiaId, maestroIds);
    handleCloseModals();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Gestión de Materias</h2>

      {/* Formulario para añadir nueva materia */}
      <form onSubmit={handleAddSubmit} className="mb-8">
        <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
          <input
            type="text"
            placeholder="Nueva Materia"
            value={newMateriaName}
            onChange={(e) => {
              setNewMateriaName(e.target.value);
              setErrors({});
            }}
            className={`appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none text-gray-900 ${
              errors.newMateriaName ? 'border-red-500' : ''
            }`}
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-[#192D63] hover:bg-[#25458a] border-[#192D63] hover:border-[#25458a] text-sm border-4 text-white py-1 px-2 rounded"
          >
            Añadir
          </button>
        </div>
        {errors.newMateriaName && <p className="text-red-500 text-xs mt-1">{errors.newMateriaName}</p>}
      </form>

      {/* Tabla de materias */}
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Maestros Asignados
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {materias.map((materia) => (
              <tr key={materia.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{materia.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{materia.nombre}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {materia.maestros && materia.maestros.length > 0
                      ? materia.maestros.map(m => m.nombre).join(', ')
                      : 'Sin asignar'}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-nowrap">
                  <button
                    onClick={() => handleAssignClick(materia)}
                    className="bg-[#735920] hover:bg-[#8a6c2f] text-white font-bold py-1 px-3 rounded-full text-xs mr-2"
                  >
                    Asignar
                  </button>
                  <button
                    onClick={() => handleEditClick(materia)}
                    className="bg-[#D4B012] hover:bg-[#b89a10] text-black font-bold py-1 px-3 rounded-full text-xs mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteMateria(materia.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición de Materia */}
      {isEditModalOpen && editingMateria && (
        <EditMateriaModal
          materia={editingMateria}
          onSave={handleUpdateSubmit}
          onClose={handleCloseModals}
        />
      )}

      {/* Modal de Asignación de Maestros */}
      {isAssignModalOpen && assigningMateria && (
        <AssignMaestrosModal
          materia={assigningMateria}
          maestros={maestros}
          onSave={handleAssignSubmit}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export default MateriasManagement;