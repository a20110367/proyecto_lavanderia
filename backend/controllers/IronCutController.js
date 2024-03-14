import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getIronCut = async (req, res) => {
    try {
        const response = await prisma.ironCut.findMany();
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getIronCutById = async (req, res) => {
    try {
        const response = await prisma.ironCut.findUnique({
            where: {
                id_ironCut: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getLastIronCut = async (req, res) => {
    try {
        const response = await prisma.ironCut.findMany({
            orderBy: {
                id_ironCut: 'desc',
            },
            take: 1,
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}
//Crea un nuevo registro de Cut de planchado para un nuevo dia
export const createIronCut = async (req, res) => {

    try {
        const ironCut = await prisma.ironCut.create({
            data: req.body

        });
        res.status(201).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
//Update standard, es parte deñ CRUD basico
export const updateIronCut = async (req, res) => {

    try {
        const ironCut = await prisma.ironCut.update({
            where: {
                id_ironCut: Number(req.params.id)
            },
            data: req.body

        });
        res.status(200).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Actualiza los contadores al inicio de un dia de trabajo
export const updateDiaryIron = async (req, res) => {

    try {
        const ironCutBefore = await prisma.ironCut.findMany({
            orderBy: {
                id_ironCut: 'desc',
            },
            skip: 1,
            take: 1,
        });

        const piecesToday = ironCutBefore[0].piecesTomorrow + ironCutBefore[0].piecesLeft;

        const ironCutCurrent = await prisma.ironCut.update({

            where: {
                id_ironCut: Number(req.params.id),
            },

            data: {
                piecesToday: piecesToday,
                piecesLeft: piecesToday
            }

        });

        res.status(200).json(ironCutCurrent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
//Actualiza las piezas hechas en el dia, y por lo tanto las quita de backlog de planchado
export const updateCashCutIron = async (req, res) => {

    try {
        const ironCut = await prisma.ironCut.update({
            where: {
                id_ironCut: Number(req.params.id)
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
        res.status(200).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
// Actualiza las piezas del dia, siempre y cuando este admita mas piezas a planchar y no revasemos el limite
export const updateTodayIron = async (req, res) => {

    try {
        const ironCut = await prisma.ironCut.update({
            where: {
                id_ironCut: Number(req.params.id)
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
        res.status(200).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Actualiza las piezas de el dia siguiente si ya hemos revasado el limite
export const updateTomorrowIron = async (req, res) => {

    try {
        const ironCut = await prisma.ironCut.update({
            where: {
                id_ironCut: Number(req.params.id)
            },
            data: {
                piecesTomorrow: {
                    increment: req.body.pieces
                },
            }

        });
        res.status(200).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//inicializa los valores del corte en caso de ser necesario
export const updateCleanCashCutIron = async (req, res) => {

    try {
        const ironCut = await prisma.ironCut.update({
            where: {
                id_ironCut: Number(req.params.id)
            },
            data: {
                piecesCashcut: {
                    set: 0,
                },
            }
        });
        res.status(200).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const deleteIronCut = async (req, res) => {
    try {
        const ironCut = await prisma.ironCut.delete({
            where: {
                id_ironCut: Number(req.params.id)
            }
        });
        res.status(200).json(ironCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}