import React from 'react';
import logo from '../assets/logounach.png';

const Sidebar = ({ activePage, setActivePage, onLogout, isOpen, onClose }) => {
  const navItems = ['Dashboard', 'Alumnos', 'Maestros', 'Materias', 'Inscripciones'];

  return (
    <>
      {/* Overlay para móviles con efecto de desenfoque y transición */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-[#192D63] text-white flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-gray-700 flex justify-center items-center">
          <img src={logo} alt="UNACH Logo" className="w-32" />
        </div>
        <nav className="mt-5 flex-grow">
          <ul>
            {navItems.map(item => (
              <li key={item} className="mb-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage(item.toLowerCase());
                    onClose(); // Cerrar sidebar en móvil al hacer clic
                  }}
                  className={`block px-5 py-3 rounded-md mx-2 transition-colors duration-200 font-semibold ${
                    activePage === item.toLowerCase()
                      ? 'bg-[#D4B012] text-[#192D63]'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full text-left px-5 py-3 rounded-md mx-2 transition-colors duration-200 font-semibold text-gray-300 hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
