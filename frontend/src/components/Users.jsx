import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

function Users () {
    const { mutate } = useSWRConfig();
    const fetcher = async () => {
        const response = await axios.get("http://localhost:5000/users");
        return response.data;
    };

    const { data } = useSWR("users", fetcher);
    if (!data) return <h2>Loading...</h2>;

    const deleteUser = async (userId) => {
        await Axios.delete(`http://localhost:5000/users/${userId}`);
        mutate("users");
    };

    return (
        <div className="flex flex-col mt-5">
            <div className="w-full">
                <Link
                    to="/add"
                    className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Add New
                </Link>
                <div className="relative shadow rounded-lg mt-3">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="py-3 px-1 text-center">No</th>
                                <th className="py-3 px-6">Nombre</th>
                                <th className="py-3 px-6">Rol</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">Telefono</th>
                                <th className="py-3 px-6">Contraseña</th>
                                <th className="py-3 px-1 text-center">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user, index) => (
                                <tr className="bg-white border-b" key={user.id}>
                                    <td className="py-3 px-1 text-center">{index + 1}</td>
                                    <td className="py-3 px-6 font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-6">{user.rol}</td>
                                    <td className="py-3 px-6">{user.email}</td>
                                    <td className="py-3 px-6">{user.phone}</td>
                                    <td className="py-3 px-6">{user.pass}</td>
                                    <td className="py-3 px-1 text-center">
                                        <Link
                                            to={`/editUser/${user.id}`}
                                            className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users