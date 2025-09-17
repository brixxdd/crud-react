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
  <div className={`p-6 rounded-lg shadow-md ${bgColor}`}>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-4xl font-bold text-white mt-2">{value}</p>
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
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total de Alumnos" value={alumnos.length} bgColor="bg-[#192D63]" />
        <StatCard title="Total de Maestros" value={maestros.length} bgColor="bg-[#735920]" />
        <StatCard title="Total de Materias" value={materias.length} bgColor="bg-[#192D63]" />
        <StatCard title="Total de Inscripciones" value={inscripciones.length} bgColor="bg-[#735920]" />
      </div>

      {/* Gráfico */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alumnos por Materia</h2>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    data={dataGrafico}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
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
