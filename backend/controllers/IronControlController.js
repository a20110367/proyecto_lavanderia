import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getIronControl = async (req, res) => {
    try {
        const response = await prisma.ironControl.findMany({

            take:730,

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getIronControlById = async (req, res) => {
    try {
        const response = await prisma.ironControl.findUnique({
            where: {
                id_ironControl: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getLastIronControl = async (req, res) => {
    try {
        const response = await prisma.ironControl.findMany({
            orderBy: {
                id_ironControl: 'desc',
            },
            take: 1,
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}
//Crea un nuevo registro de control de planchado para un nuevo dia
export const createIronControl = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.create({
            data: req.body

        });
        res.status(201).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
//Update standard, es parte deñ CRUD basico
export const updateIronControl = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: req.body

        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Actualiza los contadores al inicio de un dia de trabajo
export const updateDiaryIron = async (req, res) => {

    try {
        const ironControlBefore = await prisma.ironControl.findMany({
            orderBy: {
                id_ironControl: 'desc',
            },
            skip: 1,
            take: 1,
        });

        const piecesToday = ironControlBefore[0].piecesTomorrow + ironControlBefore[0].piecesLeft;

        const ironControlCurrent = await prisma.ironControl.update({

            where: {
                id_ironControl: Number(req.params.id),
            },

            data: {
                piecesToday: piecesToday,
                piecesLeft: piecesToday
            }

        });

        res.status(200).json(ironControlCurrent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
//Actualiza las piezas hechas en el dia, y por lo tanto las quita de backlog de planchado
export const updateCashCutIron = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: {
                piecesCashcut: {
                    increment: req.body.pieces
                },
                piecesLeft: {
                    decrement: req.body.pieces
                }
            }

        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
// Actualiza las piezas del dia, siempre y cuando este admita mas piezas a planchar y no revasemos el limite
export const updateTodayIron = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: {
                piecesToday: {
                    increment: req.body.pieces
                },
                piecesLeft: {
                    increment: req.body.pieces
                }
            }

        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Actualiza las piezas de el dia siguiente si ya hemos revasado el limite
export const updateTomorrowIron = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: {
                piecesTomorrow: {
                    increment: req.body.pieces
                },
            }

        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//inicializa los valores del corte en caso de ser necesario
export const updateCleanCashCutIron = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: {
                piecesCashcut: {
                    set: 0,
                },
            }
        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const deleteIronControl = async (req, res) => {
    try {
        const ironControl = await prisma.ironControl.delete({
            where: {
                id_ironControl: Number(req.params.id)
            }
        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}