import React, { useState, useEffect } from 'react';

const EditMateriaModal = ({ materia, onSave, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (materia) {
      setNombre(materia.nombre || '');
      setErrors({});
    }
  }, [materia]);

  if (!materia) return null;

  const validate = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre de la materia es obligatorio.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(materia.id, { nombre });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Editar Materia</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4 md:mb-6">
            <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrors({});
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 text-sm md:text-base ${
                errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Nombre de la materia"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 text-sm md:text-base order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 text-sm md:text-base order-1 sm:order-2"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMateriaModal;
