import React, { useState } from 'react';

const FormMaestro = ({ onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del email no es válido.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    if (foto) {
      formData.append('foto', foto);
    }

    onAdd(formData);

    // Reset form
    setNombre('');
    setEmail('');
    setFoto(null);
    setErrors({});
    const fileInput = document.getElementById('fotoMaestro') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFoto(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Maestro</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="nombreMaestro" className="block text-gray-700 font-semibold mb-2">Nombre</label>
          <input type="text" id="nombreMaestro" value={nombre} onChange={(e) => setNombre(e.target.value)} className={`w-full px-3 py-2 border rounded-md text-gray-900 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="emailMaestro" className="block text-gray-700 font-semibold mb-2">Email</label>
          <input type="email" id="emailMaestro" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 border rounded-md text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
            <label htmlFor="fotoMaestro" className="block text-gray-700 font-semibold mb-2">Foto de Perfil</label>
            <input type="file" id="fotoMaestro" accept="image/*" onChange={handleFileChange} className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#192D63] file:text-white hover:file:bg-[#25458a]`} />
        </div>
        <button type="submit" className="w-full bg-[#192D63] text-white font-bold py-2 px-4 rounded-md hover:bg-[#25458a]">Guardar Maestro</button>
      </form>
    </div>
  );
};

export default FormMaestro;