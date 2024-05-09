import { PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from 'moment'
moment.locale('es-mx');

const prisma = new PrismaClient();

export const getIronControl = async (req, res) => {
    try {
        const response = await prisma.ironControl.findMany({

            take: 730,

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

//Update standard, es parte del CRUD basico
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

//inicializa los valores del corte en caso de ser necesario
//REVISAR SI ES NECESARIA ESTA FUNCION
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

//Crea un nuevo registro de control de planchado para un nuevo dia
export const createIronControl = async (req, res) => {

    try {

        const lastIronControl = await prisma.ironControl.findMany({
            orderBy: {
                id_ironControl: 'desc',
            },
            take: 1,
        });

        let date1 = moment(lastIronControl[0].created).startOf('day')
        let date2 = moment().startOf('day')
        let piecesLeft = lastIronControl[0].piecesLeft + lastIronControl[0].piecesTomorrow
        let piecesExpressLeft = lastIronControl[0].piecesExpress
        let piecesTomorrow, piecesToday;
        var response;
        //console.log(date1)
        //console.log(date2)

        //const diffInDays = date2.diff(date1, 'days')
        //console.log(date2>date1)

        if (date2 > date1) {
            const ironingCapacity = await prisma.ironStation.aggregate({

                _sum: {
                    pieces: true,
                },
                where: {
                    status: "available",
                },

            });

            if (piecesLeft > ironingCapacity) {
                piecesTomorrow = piecesLeft - ironingCapacity
                piecesToday = ironingCapacity

            }
            else {
                piecesToday = piecesLeft
                piecesTomorrow = 0
                piecesTomorrow = 0
            }


            const ironControl = await prisma.ironControl.create({
                data:
                {
                    "piecesCashcut": 0,
                    "piecesToday": piecesToday,
                    "piecesTomorrow": piecesTomorrow,
                    "piecesLeft": piecesToday,
                    "piecesExpress": piecesExpressLeft

                }

            });

            response = {
                "ironingCapacity": ironingCapacity._sum,
                "ironControl": ironControl
            }


        }
        else {
            const ironingCapacity = await prisma.ironStation.aggregate({

                _sum: {
                    pieces: true,
                },
                where: {
                    status: "available",
                },

            });
            response = {
                "ironingCapacity": ironingCapacity._sum,
                "ironControl": lastIronControl[0]
            }


        }


        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


//Actualiza los contadores al inicio de un dia de trabajo
//ELIMINAR ESTA FUNCION
// export const updateDiaryIron = async (req, res) => {

//     try {
//         const ironControlBefore = await prisma.ironControl.findMany({
//             orderBy: {
//                 id_ironControl: 'desc',
//             },
//             skip: 1,
//             take: 1,
//         });

//         const piecesToday = ironControlBefore[0].piecesTomorrow + ironControlBefore[0].piecesLeft;

//         const ironControlCurrent = await prisma.ironControl.update({

//             where: {
//                 id_ironControl: Number(req.params.id),
//             },

//             data: {
//                 "piecesToday": piecesToday,
//                 "piecesLeft": piecesToday
//             }

//         });

//         res.status(200).json(ironControlCurrent);
//     } catch (e) {
//         res.status(400).json({ msg: e.message });
//     }
// }
//Actualiza las piezas hechas en el dia, y por lo tanto las quita de backlog de planchado
export const updateIronRegularOrderDone = async (req, res) => {

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
export const updateIronRegularOrderNew = async (req, res) => {

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
export const updateIronRegularOrderForTomorrow = async (req, res) => {

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

//Actualiza las piezas express en el control de planchado de pedidos nuevos
export const updateIronExpressOrderNew = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: {
                piecesExpress: {
                    increment: req.body.pieces
                },
            }

        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Actualiza las piezas express cuando se termina la orden de planchado
export const updateIronExpressOrderDone = async (req, res) => {

    try {
        const ironControl = await prisma.ironControl.update({
            where: {
                id_ironControl: Number(req.params.id)
            },
            data: {
                piecesCashcut: {
                    increment: req.body.pieces
                },
                piecesExpress: {
                    decrement: req.body.pieces
                }
            }

        });
        res.status(200).json(ironControl);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

