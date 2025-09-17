import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Define API_URL here

const EditAlumnoModal = ({ alumno, materias, onSave, onClose }) => {
  const [formData, setFormData] = useState({ nombre: '', grado: '', email: '' });
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (alumno) {
      setFormData({
        nombre: alumno.nombre || '',
        grado: alumno.grado || '',
        email: alumno.email || '',
      });
      setErrors({}); // Clear errors when a new alumno is loaded

      // Fetch current materias for this student
      const fetchAlumnoMaterias = async () => {
        try {
          const response = await fetch(`${API_URL}/alumnos/${alumno.id}/materias`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setSelectedMaterias(data.map(m => m.id));
        } catch (error) {
          console.error("Error fetching alumno materias:", error);
        }
      };
      fetchAlumnoMaterias();
    }
  }, [alumno]);

  if (!alumno) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.grado) newErrors.grado = 'El grado es obligatorio.';
    if (selectedMaterias.length === 0) newErrors.materias = 'Debes seleccionar al menos una materia.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMateriaChange = (e) => {
    const options = Array.from(e.target.options);
    const value = options.filter(option => option.selected).map(option => parseInt(option.value));
    setSelectedMaterias(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedData = {
      ...formData,
      grado: parseInt(String(formData.grado), 10),
      materias: selectedMaterias, // Pass selected materias
    };
    onSave(alumno.id, updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Editar Alumno</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 text-sm md:text-base ${
                errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="grado" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Grado</label>
            <input
              type="number"
              id="grado"
              name="grado"
              value={formData.grado}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 text-sm md:text-base ${
                errors.grado ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.grado && <p className="text-red-500 text-xs mt-1">{errors.grado}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm md:text-base"
            />
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="materias" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Materias</label>
            <select
              id="materias"
              name="materias"
              multiple
              value={selectedMaterias.map(String)}
              onChange={handleMateriaChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 h-24 md:h-32 text-sm md:text-base ${
                errors.materias ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              {materias.map(materia => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
                </option>
              ))}
            </select>
            {errors.materias && <p className="text-red-500 text-xs mt-1">{errors.materias}</p>}
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

export default EditAlumnoModal;
