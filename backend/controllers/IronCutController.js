import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getIronCuts = async (req, res) => {
    
    let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())


    try {
        const response = await prisma.ironCut.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

            
        });
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

export const calculateIronCut = async (req, res) => {

    try {
        const ironCutE1R = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true,

            },


            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 1,
                            }
                        },
                    },

                    {
                        express: false,
                    },

                ],

            },

        });

        const ironCutE1E = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true,
            },

            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 1,
                            }
                        },
                    },

                    {
                        express: true,
                    },

                ],

            },

        });


        const ironCutE2R = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true

            },


            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 2,
                            }
                        },
                    },

                    {
                        express: false,
                    },

                ],

            },

        });

        const ironCutE2E = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true

            },


            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 2,
                            }
                        },
                    },

                    {
                        express: true,

                    },

                ],

            },

        });

        const ironCutE3R = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true

            },

            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 3,
                            }
                        },
                    },

                    {
                        express: false,
                    },

                ],

            },

        });

        const ironCutE3E = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true

            },

            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 3,
                            }
                        },
                    },

                    {
                        express: true,
                    },

                ],

            },

        });


        const ironCutE4R = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true

            },

            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            }
                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 4,
                            }
                        },
                    },

                    {
                        express: false,
                    },

                ],

            },

        });

        const ironCutE4E = await prisma.serviceOrder.aggregate({
            _sum: {
                ironPieces: true

            },

            where: {
                AND: [
                    {
                        IronQueue: {
                            some: {
                                accounted: false,
                            },

                        },

                    },
                    {
                        IronQueue: {
                            some: {
                                fk_idIronStation: 4,
                            },

                        },
                    },

                    {
                        express: true,
                    },

                ],

            },

        });

        const startDate = await prisma.serviceOrder.findFirst({
            where: {
                IronQueue: {
                    some: {
                        accounted: false,
                    },

                },
            },

            select: {
                created: true,
            },

        });

        const today = new Date().toJSON();

        const ordersUpdate = await prisma.ironQueue.updateMany({
            where: {
                accounted: false,

            },

            data: {
                accounted: true,
            },

        });

        if (ironCutE1R._sum.ironPieces === null)
            ironCutE1R._sum.ironPieces = 0

        if (ironCutE1E._sum.ironPieces === null)
            ironCutE1E._sum = 0

        if (ironCutE2R._sum.ironPieces === null)
            ironCutE2R._sum.ironPieces = 0

        if (ironCutE2E._sum.ironPieces === null)
            ironCutE2E._sum.ironPieces = 0

        if (ironCutE3R._sum.ironPieces === null)
            ironCutE3R._sum.ironPieces = 0

        if (ironCutE3E._sum.ironPieces === null)
            ironCutE3E._sum.ironPieces = 0

        if (ironCutE4R._sum.ironPieces === null)
            ironCutE4R._sum.ironPieces = 0

        if (ironCutE4E._sum.ironPieces === null)
            ironCutE4E._sum.ironPieces = 0


        console.log(startDate)
        if(startDate){
            const ironCutCreate = await prisma.ironCut.create({
                data: {
    
                    "station1R": ironCutE1R._sum.ironPieces,
                    "station1E": ironCutE1E._sum.ironPieces,
                    "station2R": ironCutE2R._sum.ironPieces,
                    "station2E": ironCutE2E._sum.ironPieces,
                    "station3R": ironCutE3R._sum.ironPieces,
                    "station3E": ironCutE3E._sum.ironPieces,
                    "station4R": ironCutE4R._sum.ironPieces,
                    "station4E": ironCutE4E._sum.ironPieces,
                    "startingDay": startDate.created,
                    "endDay": today
    
                },
    
            });
    
            res.status(200).json(ironCutCreate);
        }else{
            res.status(200).json(false);
        }
        
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
//REVISAR POR FALLAS DE DISEÑO LOGICO
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