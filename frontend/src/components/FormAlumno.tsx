import React, { useState } from 'react';

interface FormAlumnoProps {
  onAdd: (formData: FormData) => void;
  materias: { id: number; nombre: string; maestros: { id: number; nombre: string }[] }[];
}

interface FormErrors {
  nombre?: string;
  grado?: string;
  materias?: string;
  foto?: string;
}

const FormAlumno: React.FC<FormAlumnoProps> = ({ onAdd, materias }) => {
  const [nombre, setNombre] = useState('');
  const [grado, setGrado] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
  const [foto, setFoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!grado) newErrors.grado = 'El grado es obligatorio.';
    if (selectedMaterias.length === 0) newErrors.materias = 'Debes seleccionar al menos una materia.';
    if (foto && foto.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.foto = 'La imagen no debe pesar más de 5MB.';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('grado', grado);
    formData.append('email', email);
    selectedMaterias.forEach(materiaId => formData.append('materias', String(materiaId)));
    if (foto) {
      formData.append('foto', foto);
    }

    onAdd(formData);
    
    // Reset form
    setNombre('');
    setGrado('');
    setEmail('');
    setSelectedMaterias([]);
    setFoto(null);
    setErrors({});
    // Clear file input
    const fileInput = document.getElementById('fotoAlumno') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const handleMateriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.options);
    const value = options.filter(option => option.selected).map(option => parseInt(option.value));
    setSelectedMaterias(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFoto(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Registrar Alumno</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Nombre</label>
          <input 
            type="text" 
            id="nombre" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className={`w-full px-3 py-2 border rounded-md text-gray-900 text-sm md:text-base ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Nombre del alumno"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="grado" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Grado</label>
          <input 
            type="number" 
            id="grado" 
            value={grado} 
            onChange={(e) => setGrado(e.target.value)} 
            className={`w-full px-3 py-2 border rounded-md text-gray-900 text-sm md:text-base ${errors.grado ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Grado"
          />
          {errors.grado && <p className="text-red-500 text-xs mt-1">{errors.grado}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm md:text-base" 
            placeholder="email@ejemplo.com"
          />
        </div>
        <div className="mb-4 md:mb-6">
          <label htmlFor="materias" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Materias</label>
          <select 
            id="materias" 
            multiple 
            value={selectedMaterias.map(String)} 
            onChange={handleMateriaChange} 
            className={`w-full h-24 md:h-32 px-3 py-2 border rounded-md text-gray-900 text-sm md:text-base ${errors.materias ? 'border-red-500' : 'border-gray-300'}`}
          >
            {materias.map(materia => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre} {materia.maestros.length > 0 ? `(${materia.maestros.map(m => m.nombre).join(', ')})` : '(Sin maestro)'}
              </option>
            ))}
          </select>
          {errors.materias && <p className="text-red-500 text-xs mt-1">{errors.materias}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="fotoAlumno" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Foto de Perfil</label>
          <input 
            type="file" 
            id="fotoAlumno" 
            accept="image/*" 
            onChange={handleFileChange} 
            className={`w-full text-xs md:text-sm text-gray-500 file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-[#192D63] file:text-white hover:file:bg-[#25458a] ${errors.foto ? 'border-red-500' : ''}`} 
          />
          {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto}</p>}
        </div>
        <button 
          type="submit" 
          className="w-full bg-[#192D63] text-white font-bold py-2 md:py-3 px-4 rounded-md hover:bg-[#25458a] text-sm md:text-base"
        >
          Guardar Alumno
        </button>
      </form>
    </div>
  );
};

export default FormAlumno;
