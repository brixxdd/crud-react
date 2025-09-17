import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StatCard = ({ title, value, bgColor }) => (
  <div className={`p-4 md:p-6 rounded-lg shadow-md ${bgColor}`}>
    <h3 className="text-sm md:text-xl font-semibold text-white">{title}</h3>
    <p className="text-2xl md:text-4xl font-bold text-white mt-1 md:mt-2">{value}</p>
  </div>
);

const Dashboard = ({ alumnos, maestros, inscripciones, materias }) => {
  // Calcular datos para el gráfico: número de alumnos por materia
  const dataGrafico = materias.map(materia => {
    const alumnosCount = inscripciones.filter(
      (i) => i.materia_nombre === materia.nombre
    ).length;
    return { name: materia.nombre, Alumnos: alumnosCount };
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard title="Total de Alumnos" value={alumnos.length} bgColor="bg-[#192D63]" />
        <StatCard title="Total de Maestros" value={maestros.length} bgColor="bg-[#735920]" />
        <StatCard title="Total de Materias" value={materias.length} bgColor="bg-[#192D63]" />
        <StatCard title="Total de Inscripciones" value={inscripciones.length} bgColor="bg-[#735920]" />
      </div>

      {/* Gráfico */}
      <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Alumnos por Materia</h2>
        <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dataGrafico}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Alumnos" fill="#D4B012" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
