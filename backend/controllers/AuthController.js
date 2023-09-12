import { PrismaClient } from "@prisma/client";
import { response } from "express";
import { generarJWT } from "../utils/jwt";

const prisma = new PrismaClient();
const { hashToken } = require('../../utils/hashToken');

export const authPost = async (req, res = response) => {
    const { username, password } = req.body;
    try {
        user = await postAuth(username, password);
        if (user.msg) return res.status(400).json(user);
        res.status(200).json(user);
    } catch (e) {
        console.error('Error en la petición de base de datos - authPost');
        return res.status(500).json({ msg: e.message })
    }
};

export const postAuth = async (username, password) => {
    // Verificar si el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
        select: {
            id_user: true,
            username: true,
            name: true,
            firstName: true,
            secondName: true,
            email: true,
            phone: true,
            pass: true,
            role: true,
        },
        where: {
            username: username,
            pass: password,
        },
    });

    if (!user) {
        return {
            msg: 'Error de datos',
        };
    }

    // // Verificar el password
    // const validarPassword = bcryptjs.compareSync(password, usuario.PWD);
    // if (!validarPassword) {
    //     return {
    //         msg: 'Error de datos',
    //     };
    // }

    // Generar el JWT
    const token = await generarJWT(user.id_user);
    delete user.pass;

    return {
        user,
        token,
    };
};


// used when we create a refresh token.
export const addRefreshTokenToWhitelist = async (req, res) => {
    const { jti, refreshToken, id_user } = req.body;
    try {
        const token = await prisma.refreshToken.create({
            data: {
                id_token: jti,
                hashedToken: hashToken(refreshToken),
                id_user
            }
        });
        res.status(201).json(token);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = async (req, res) => {
    try {
        const response = await prisma.refreshToken.findUnique({
            where: {
                id_token: req.params.id,
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

// soft delete tokens after usage.
export const deleteRefreshToken = async (req, res) => {
    try {
        const response = await prisma.refreshToken.update({
            where: {
                id_token: req.params.id,
            },
            data: {
                revoked: true
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

// hard delete tokens after usage.
export const revokeTokens = async (req, res) => {
    try {
        const response = await prisma.refreshToken.updateMany({
            where: {
                id_token: req.params.id,
            },
            data: {
                revoked: true
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}