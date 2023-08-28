import React from "react";
import { Link } from "react-router-dom";
import { AiFillDollarCircle } from "react-icons/ai";

export default function Dashboard() {
  return (
    <div className="flex gap-4">
      <div className="flex gap-4 w-full">
        <EstiloBox>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
            <AiFillDollarCircle className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">
              Ganancias totales
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                $51651.46
              </strong>
              <span className="text-sm text-green-500 pl-2">+350</span>
            </div>
          </div>
        </EstiloBox>
        <EstiloBox>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
            <AiFillDollarCircle className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">
              Equipos de lavado
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                $51651.46
              </strong>
              <span className="text-sm text-green-500 pl-2">+350</span>
            </div>
          </div>
        </EstiloBox>
        <EstiloBox>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
            <AiFillDollarCircle className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Empleados</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                $51651.46
              </strong>
              <span className="text-sm text-green-500 pl-2">+350</span>
            </div>
          </div>
        </EstiloBox>
        <EstiloBox>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
            <AiFillDollarCircle className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Cajeros</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">
                $51651.46
              </strong>
              <span className="text-sm text-green-500 pl-2">+350</span>
            </div>
          </div>
        </EstiloBox>
      </div>
    </div>
  );
}

function EstiloBox({ children }) {
  return (
    <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">
      {children}
    </div>
  );
}
