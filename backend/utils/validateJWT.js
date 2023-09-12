import { response, request } from 'express';
const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición',
        });
    }

    try {
        const { id_user } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        req.id_user = id_user;

        // Leer el usuario que corresponde al id_usuario
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
                id_user: Number(id_user),
            },
        });

        // No existe el usuario
        if (!user) {
            return res.status(401).json({
                msg: 'Token invalido',
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token invalido',
        });
    }
};