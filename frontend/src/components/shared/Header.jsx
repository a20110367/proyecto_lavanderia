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
import { useAuth } from "../../hooks/auth/auth";

export default function Header({ toggleCollapsed, collapsed, items }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [matchingRoutes, setMatchingRoutes] = useState([]);
  const navigate = useNavigate();
  const { cookies } = useAuth();


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
    <div className="header-container">
      <div className="fc">

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => toggleCollapsed()}
          className="text-lg  w-16 h-9"
        />
          <p className="user font-bold">{cookies.role === 'admin' ? 'Administrador:' : 'Empleado:'}</p>
          <p className="user text-RedPantone">{cookies.username}</p>
      </div>
      <div className="flex items-center gap-2 mr-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "Popover-btn"
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
                <Popover.Panel className="Popover">
                  <div className="Popover-container">
                    <strong className="Popover-title">
                      Mensajes
                    </strong>
                    <div className="Popover-text">
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
                  "Popover-btn"
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
                <Popover.Panel className="Popover">
                  <div className="Popover-container">
                    <strong className="Popover-title">
                      Notificaciones
                    </strong>
                    <div className="Popover-text">
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
            <Menu.Button className="menu-btn">
              <span className="sr-only">Abrir Usuario</span>
              <div
                className="menu-btn-img"
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
            <Menu.Items className="menu">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active && "bg-gray-100",
                      "menu-item"
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
                      "menu-item"
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
                      "menu-item"
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