import React, { useState, useEffect } from 'react';

const AssignMaestrosModal = ({ materia, maestros, onSave, onClose }) => {
  const [selectedMaestros, setSelectedMaestros] = useState([]);

  useEffect(() => {
    // Pre-seleccionar los maestros ya asignados a la materia
    if (materia && materia.maestros) {
      setSelectedMaestros(materia.maestros.map(m => m.id));
    }
  }, [materia]);

  const handleCheckboxChange = (maestroId) => {
    setSelectedMaestros(prevSelected =>
      prevSelected.includes(maestroId)
        ? prevSelected.filter(id => id !== maestroId)
        : [...prevSelected, maestroId]
    );
  };

  const handleSave = () => {
    onSave(materia.id, selectedMaestros);
  };

  if (!materia) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Asignar Maestros a: {materia.nombre}</h3>
          <div className="mt-4 mb-6">
            <div className="text-left border rounded-md p-3 max-h-60 overflow-y-auto">
              {maestros.map(maestro => (
                <div key={maestro.id} className="flex items-center my-2">
                  <input
                    type="checkbox"
                    id={`maestro-${maestro.id}`}
                    checked={selectedMaestros.includes(maestro.id)}
                    onChange={() => handleCheckboxChange(maestro.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`maestro-${maestro.id}`} className="ml-3 text-sm text-gray-700">
                    {maestro.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#192D63] text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-[#25458a] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Cambios
            </button>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignMaestrosModal;
