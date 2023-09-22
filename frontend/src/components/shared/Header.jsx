import React, { Fragment, useState, useEffect } from "react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
  HiOutlineSearch,
} from "react-icons/hi";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Popover, Transition, Menu } from "@headlessui/react";
import { Button } from "antd";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleCollapsed, collapsed, items }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [matchingRoutes, setMatchingRoutes] = useState([]);
  const navigate = useNavigate();


  const handleSearch = (searchTerm) => {
    const matching = items.reduce((acc, item) => {
      if (item.type === 'divider') {
        return acc;
      }
      
      // Obtenemos las primeras letras de la etiqueta del elemento
      const firstLetters = item.label.slice(0, searchTerm.length).toLowerCase();
  
      if (firstLetters === searchTerm.toLowerCase()) {
        acc.push({ key: item.key, label: item.label });
      }
  
      if (item.children) {
        const childMatching = item.children.filter((child) => {
          // Obtenemos las primeras letras de la etiqueta del hijo
          const childFirstLetters = child.label.slice(0, searchTerm.length).toLowerCase();
          return childFirstLetters === searchTerm.toLowerCase();
        });
        acc.push(...childMatching);
      }
  
      return acc;
    }, []);
  
    setMatchingRoutes(matching);
    setShowResults(searchTerm !== "");
  };
  
  const closeResults = () => {
    setShowResults(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeResults);

    return () => {
      document.removeEventListener("click", closeResults);
    };
  }, []);

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center">

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => toggleCollapsed()}
          className="text-lg  w-16 h-9"
        />
        <div className="relative ml-4">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="text-sm focus:outline-none active:outline-none h-10 w-[24rm] border border-gray-300 rounded-sm pl-11 pr-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        {showResults && matchingRoutes.length > 0 && (
  <div className="absolute top-16 left-0 w-[24rm] max-h-60 bg-white border border-gray-300 rounded-b-md shadow-md overflow-y-auto z-50">
    <strong className="px-4 py-2 text-gray-700 font-medium text-lg block">
      Rutas coincidentes:
    </strong>
    <ul>
      {matchingRoutes.map((route) => (
        <li
          key={route.key}
          className="px-4 py-2.5 cursor-pointer hover:bg-gray-100 hover:text-blue-500 text-base"
          onClick={() => {
            navigate(route.key);
            setSearchTerm("");
          }}
        >
          {route.label}
        </li>
      ))}
    </ul>
  </div>
)}
        </div>
      </div>
      <div className="flex items-center gap-2 mr-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "p-1.5 rounded-sm inline-flex items-center text-gray700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineChatAlt fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Mensajes
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      Este es el panel de mensajes
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "p-1.5 rounded-sm inline-flex items-center text-gray700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineBell fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Notificaciones
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      Este es el panel de Notificaciones
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <span className="sr-only">Abrir Usuario</span>
              <div
                className="h-10 w-10 rounded-full bg-gray-500 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage:
                    "url(https://celestiabuilds.com/wp-content/uploads/2021/06/Hu-Tao.png)",
                }}
              >
                <span className="sr-only">Hu Tao</span>
              </div>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gra-200 cursor-pointer rounded-sm px-4 py-2"
                    )}
                    onClick={() => navigate("/perfil")}
                  >
                    Tu cuenta
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gra-200 cursor-pointer rounded-sm px-4 py-2"
                    )}
                    onClick={() => navigate("/configuraciones")}
                  >
                    Configuraciones
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gra-200 cursor-pointer rounded-sm px-4 py-2"
                    )}
                    onClick={() => navigate("/")}
                  >
                    Cerrar sesion
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}