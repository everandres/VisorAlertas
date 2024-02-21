import React, { createContext, useState, useEffect } from "react";
import useFetchData from "./useFetchData";

export const DataContext = createContext();

// Componente Spinner (sin cambios)
const Spinner = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    }}
  >
    <div
      style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        animation: "spin 2s linear infinite",
      }}
    />
    <div
      style={{
        marginTop: "20px",
        fontSize: "20px",
        color: "#3498db",
        textAlign: "center",
      }}
    >
      Bienvenido al visor de alertas de la OSPA. Cargando...
    </div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export const DataProvider = ({ children }) => {
  // Estados existentes para incendios y departamentos
  const {
    data: incendiosData,
    isLoading: incendiosLoading,
    error: incendiosError,
  } = useFetchData("http://192.168.156.34:8000/api/v1/incendios");
  const {
    data: departamentosData,
    isLoading: departamentosLoading,
    error: departamentosError,
  } = useFetchData("http://192.168.156.34:8000/api/v1/departamentos");

  // Nuevo estado para datos de deslizamientos
  const {
    data: deslizamientosData,
    isLoading: deslizamientosLoading,
    error: deslizamientosError,
  } = useFetchData("http://192.168.156.34:8000/api/v1/deslizamientos");

  // Modifica la condición de carga para incluir deslizamientos
  if (incendiosLoading || departamentosLoading || deslizamientosLoading) {
    return <Spinner />;
  }

  // Modifica la condición de error para incluir deslizamientos
  if (incendiosError || departamentosError || deslizamientosError) {
    return (
      <div>
        Error:{" "}
        {incendiosError?.message ||
          departamentosError?.message ||
          deslizamientosError?.message}
      </div>
    );
  }

  // Provee los tres conjuntos de datos a los consumidores del contexto
  return (
    <DataContext.Provider
      value={{
        incendiosData,
        departamentosData,
        deslizamientosData,
        incendiosError,
        departamentosError,
        deslizamientosError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
