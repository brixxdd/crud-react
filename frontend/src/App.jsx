import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FormAlumno from './components/FormAlumno';
import FormMaestro from './components/FormMaestro';
import AlumnosTable from './components/AlumnosTable';
import MaestrosTable from './components/MaestrosTable';
import EditAlumnoModal from './components/EditAlumnoModal';
import InscripcionesTable from './components/InscripcionesTable';
import MateriasManagement from './components/MateriasManagement';
import Login from './components/Login';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ITEMS_PER_PAGE = 5;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginError, setLoginError] = useState('');
  
  const [activePage, setActivePage] = useState('dashboard');
  const [alumnos, setAlumnos] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTermMaestros, setSearchTermMaestros] = useState('');
  const [currentPageMaestros, setCurrentPageMaestros] = useState(1);

  const apiFetch = async (url, options = {}) => {
    const headers = { ...options.headers };

    if (!options.isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { isFormData, ...fetchOptions } = options;

    const response = await fetch(url, { ...fetchOptions, headers });

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      throw new Error('Token inválido o expirado');
    }
    return response;
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Credenciales incorrectas');
      const { accessToken } = await response.json();
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setLoginError('');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const fetchAllData = async () => {
    try {
      const [alumnosRes, maestrosRes, materiasRes, inscripcionesRes] = await Promise.all([
        apiFetch(`${API_URL}/alumnos`, { cache: 'no-cache' }),
        apiFetch(`${API_URL}/maestros`, { cache: 'no-cache' }),
        apiFetch(`${API_URL}/materias-con-maestros`, { cache: 'no-cache' }),
        apiFetch(`${API_URL}/inscripciones`, { cache: 'no-cache' }),
      ]);
      if (!alumnosRes.ok || !maestrosRes.ok || !materiasRes.ok || !inscripcionesRes.ok) {
          throw new Error('Error al cargar los datos iniciales');
      }
      setAlumnos(await alumnosRes.json());
      setMaestros(await maestrosRes.json());
      setMaterias(await materiasRes.json());
      setInscripciones(await inscripcionesRes.json());
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleAddAlumno = async (formData) => {
    try {
      const response = await apiFetch(`${API_URL}/alumnos`, { method: 'POST', body: formData, isFormData: true });
      if (!response.ok) {
        throw new Error(`Error al crear el alumno: ${await response.text()}`);
      }

      const newAlumno = await response.json();
      const materias = formData.getAll('materias');

      if (materias.length > 0) {
        const enrollPromises = materias.map(materiaId =>
          apiFetch(`${API_URL}/alumnos/${newAlumno.id}/materias`, {
            method: 'POST',
            body: JSON.stringify({ materia_id: parseInt(materiaId, 10) })
          })
        );
        const responses = await Promise.all(enrollPromises);

        // Revisar si alguna de las inscripciones falló
        for (const res of responses) {
          if (!res.ok) {
            throw new Error(`Error al inscribir materia: ${await res.text()}`);
          }
        }
      }

      // Si todo fue bien, refrescar los datos
      await fetchAllData();

    } catch (error) {
      console.error("Fallo en el proceso de añadir alumno:", error);
    }
  };

  const handleAddMaestro = async (formData) => {
    try {
      const response = await apiFetch(`${API_URL}/maestros`, { method: 'POST', body: formData, isFormData: true });
      if (!response.ok) throw new Error('Error al crear el maestro');
      await fetchAllData(); // Refrescar todos los datos
    } catch (error) {
      console.error("Fallo en el proceso de añadir maestro:", error);
    }
  };

  const handleDeleteAlumno = async (id) => {
    try {
      await apiFetch(`${API_URL}/alumnos/${id}/materias`, { method: 'DELETE' });
      const response = await apiFetch(`${API_URL}/alumnos/${id}`, { method: 'DELETE' });
      if (response.ok) await fetchAllData();
    } catch (error) {
        console.error("Error al eliminar alumno:", error);
    }
  };
  
  const handleAddMateria = async (materiaData) => {
    try {
        const response = await apiFetch(`${API_URL}/materias`, { method: 'POST', body: JSON.stringify(materiaData) });
        if (response.ok) await fetchAllData();
    } catch (error) {
        console.error("Error al añadir materia:", error);
    }
  };

  const handleUpdateMaestrosDeMateria = async (materiaId, maestroIds) => {
    try {
        const response = await apiFetch(`${API_URL}/materias/${materiaId}/maestros`, { method: 'PUT', body: JSON.stringify({ maestro_ids: maestroIds }) });
        if (response.ok) await fetchAllData();
    } catch (error) {
        console.error("Error al actualizar maestros de materia:", error);
    }
  };

  if (!token) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  const filteredAlumnos = alumnos.filter(a => a.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredAlumnos.length / ITEMS_PER_PAGE);
  const paginatedAlumnos = filteredAlumnos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const maestrosConMaterias = maestros.map(m => ({ ...m, materias: materias.filter(mat => mat.maestros.some(m2 => m2.id === m.id)).map(mat => mat.nombre).join(', ') || 'Sin asignar' }));

  const filteredMaestros = maestrosConMaterias.filter(m => 
    m.nombre.toLowerCase().includes(searchTermMaestros.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTermMaestros.toLowerCase())
  );
  const totalPagesMaestros = Math.ceil(filteredMaestros.length / ITEMS_PER_PAGE);
  const paginatedMaestros = filteredMaestros.slice((currentPageMaestros - 1) * ITEMS_PER_PAGE, currentPageMaestros * ITEMS_PER_PAGE);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard alumnos={alumnos} maestros={maestros} materias={materias} inscripciones={inscripciones} />;
      case 'alumnos': return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1"><FormAlumno onAdd={handleAddAlumno} materias={materias} /></div>
            <div className="lg:col-span-2">
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o grado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#192D63] text-gray-900"
                  />
                </div>
                <AlumnosTable alumnos={paginatedAlumnos} onDelete={handleDeleteAlumno} onEdit={() => {}} />
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span>Página {currentPage} de {totalPages}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
            </div>
          </div>);
      case 'maestros': return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1"><FormMaestro onAdd={handleAddMaestro} /></div>
            <div className="lg:col-span-2">
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTermMaestros}
                    onChange={(e) => setSearchTermMaestros(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#192D63] text-gray-900"
                  />
                </div>
                <MaestrosTable maestros={paginatedMaestros} />
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentPageMaestros(p => Math.max(p - 1, 1))}
                    disabled={currentPageMaestros === 1}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span>Página {currentPageMaestros} de {totalPagesMaestros}</span>
                  <button 
                    onClick={() => setCurrentPageMaestros(p => Math.min(p + 1, totalPagesMaestros))}
                    disabled={currentPageMaestros === totalPagesMaestros || totalPagesMaestros === 0}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
            </div>
          </div>);
      case 'materias': return <MateriasManagement materias={materias} maestros={maestros} onAddMateria={handleAddMateria} onUpdateMaestros={handleUpdateMaestrosDeMateria} onDeleteMateria={() => {}} onUpdateMateria={() => {}}/>;
      case 'inscripciones': return <InscripcionesTable inscripciones={inscripciones} />;
      default: return <div>Página no encontrada</div>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="content-container"><div className="p-6">{renderContent()}</div></main>
      {isEditModalOpen && <EditAlumnoModal alumno={editingAlumno} maestros={maestros} onSave={() => {}} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
}

export default App;
