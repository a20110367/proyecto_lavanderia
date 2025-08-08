import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
//Rutas para gestion de tipos de ropa
export const getClothingTypes = async (req, res) => {
    try {
        const clothingTypes = await prisma.clothingType.findMany();
        res.status(200).json(clothingTypes);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createClothingTypes = async (req, res) => {

    let { clothingDescription } = req.body;
    clothingDescription = clothingDescription.trim().toLowerCase();

    try {

        const clothingTypesCreated = await prisma.clothingType.create({
            data: {
                clothingDescription: clothingDescription,
            }

        });

        res.status(201).json(clothingTypesCreated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createManyClothingTypes = async (req, res) => {

    try {
        const clothingTypesCreated = await prisma.clothingType.createMany({
            data: req.body

        });

        res.status(201).json(clothingTypesCreated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateClothingTypes = async (req, res) => {

    let { clothingDescription } = req.body;
    clothingDescription = clothingDescription.trim().toLowerCase();


    try {
        const clothingTypesUpdated = await prisma.clothingType.update({
            where: {
                id_clothing: Number(req.params.id)
            },

            data: {
                clothingDescription: clothingDescription
            }
        });
        res.status(200).json(clothingTypesUpdated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteClothingTypes = async (req, res) => {
    try {
        const clothingTypesDeleted = await prisma.clothingType.delete({
            where: {
                id_clothing: Number(req.params.id)
            }
        });
        res.status(200).json(clothingTypesDeleted);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


//Rutas para gestion de colores de ropa

export const getClothingColors = async (req, res) => {
    try {
        const clothingsColors = await prisma.clothingColor.findMany();
        res.status(200).json(clothingsColors);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createClothingColors = async (req, res) => {

    let { colorDescription } = req.body;
    colorDescription = colorDescription.trim().toLowerCase();

    try {

        const clothingsColorsCrated = await prisma.clothingColor.create({
            data: {
                colorDescription: colorDescription
            }

        });

        res.status(201).json(clothingsColorsCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createManyClothingColors = async (req, res) => {

    try {
        const clothingColorsCreated = await prisma.clothingColor.createMany({
            data: req.body

        });

        res.status(201).json(clothingColorsCreated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateClothingColors = async (req, res) => {



    try {
        const clothingColorsUpdated = await prisma.clothingColor.update({
            where: {
                id_color: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(clothingColorsUpdated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteClothingColors = async (req, res) => {
    try {
        const clothingColorDeleted = await prisma.clothingColor.delete({
            where: {
                id_color: Number(req.params.id)
            }
        });
        res.status(200).json(clothingColorDeleted);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Rutas para gestion estampados de ropa

export const getClothingPrints = async (req, res) => {
    try {
        const clothingsPrints = await prisma.clothingPrint.findMany();
        res.status(200).json(clothingsPrints);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createClothingPrints = async (req, res) => {

    let { printDescription } = req.body;
    printDescription = printDescription.trim().toLowerCase();

    try {

        const clothingsPrintsCrated = await prisma.clothingPrint.create({
            data: {
                printDescription: printDescription
            }

        });

        res.status(201).json(clothingsPrintsCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createManyClothingPrints = async (req, res) => {

    try {
        const clothingsPrintsCrated = await prisma.clothingPrint.createMany({
            data: req.body

        });

        res.status(201).json(clothingsPrintsCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateClothingPrints = async (req, res) => {

    let { printDescription } = req.body;
    printDescription = printDescription.trim().toLowerCase();

    try {
        const clothingPrintsUpdated = await prisma.clothingPrint.update({
            where: {
                id_print: Number(req.params.id)
            },

            data: {
                printDescription: printDescription
            }
        });
        res.status(200).json(clothingPrintsUpdated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteClothingPrints = async (req, res) => {
    try {
        const clothingPrintsUpdated = await prisma.clothingPrint.delete({
            where: {
                id_print: Number(req.params.id)
            }
        });
        res.status(200).json(clothingPrintsUpdated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Rutas para gestionar Terminados de Ropa

export const getClothingFinishes = async (req, res) => {
    try {
        const clothingsFinishes = await prisma.clothingFinish.findMany();
        res.status(200).json(clothingsFinishes);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createClothingsFinishes = async (req, res) => {
    let { finishDescription } = req.body;
    finishDescription = finishDescription.trim().toLowerCase();

    try {

        const clothingsFinishesCrated = await prisma.clothingFinish.create({
            data: {
                finishDescription: finishDescription
            }
        });

        res.status(201).json(clothingsFinishesCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createManyClothingFinishes = async (req, res) => {

    try {
        const clothingsFinishesCrated = await prisma.clothingFinish.createMany({
            data: req.body

        });

        res.status(201).json(clothingsFinishesCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateClothingFinishes = async (req, res) => {

    let { finishDescription } = req.body;
    finishDescription = finishDescription.trim().toLowerCase();


    try {
        const clothingFinishesUpdated = await prisma.clothingFinish.update({
            where: {
                id_finish: Number(req.params.id)
            },

            data: {
                finishDescription: finishDescription
            }
        });
        res.status(200).json(clothingFinishesUpdated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteClothingFinishes = async (req, res) => {
    try {
        const clothingFinishesUpdated = await prisma.clothingFinish.delete({
            where: {
                id_finish: Number(req.params.id)
            }
        });
        res.status(200).json(clothingFinishesUpdated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

//Gestion de tabla de detalles de terminados
//Obtener catalogo de terminados

export const getClothingFinishesCatalog = async (req, res) => {
    try {

        // const clothingTypes = await prisma.clothingType.findMany();
        // const clothingsColors = await prisma.clothingColor.findMany();
        // const clothingsPrints = await prisma.clothingPrint.findMany();
        // const clothingsFinishes = await prisma.clothingFinish.findMany();
        const clothingsFinishesCatalog = Object();
        let clothingsTypes = await prisma.clothingType.findMany({
            select: { clothingDescription: true }
        });
        let clothingsColors = await prisma.clothingColor.findMany({
            select: { colorDescription: true }
        });
        let clothingsPrints = await prisma.clothingPrint.findMany({
            select: { printDescription: true }
        });
        let clothingsFinishes = await prisma.clothingFinish.findMany({
            select: { finishDescription: true }
        });

        // clothingsFinishesCatalog.clothingsTypes = await prisma.clothingType.findMany({
        //     select:{clothingDescription:true}
        // });
        // clothingsFinishesCatalog.clothingsColors = await prisma.clothingColor.findMany({
        //     select:{colorDescription:true}
        // });
        // clothingsFinishesCatalog.clothingsPrints = await prisma.clothingPrint.findMany({
        //     select:{printDescription:true}
        // });
        // clothingsFinishesCatalog.clothingsFinishes = await prisma.clothingFinish.findMany({
        //     select:{finishDescription:true}
        // });


        clothingsFinishesCatalog.clothingTypes = clothingsTypes.map(clothingType => clothingType.clothingDescription);

        clothingsFinishesCatalog.clothingsColors = clothingsColors.map(clothingsColor => clothingsColor.colorDescription);

        clothingsFinishesCatalog.clothingsPrints = clothingsPrints.map(clothingsPrint => clothingsPrint.printDescription);

        clothingsFinishesCatalog.clothingsFinishes = clothingsFinishes.map(clothingsFinishe => clothingsFinishe.finishDescription);

        clothingsFinishesCatalog.clothingTypes.unshift("n/a");

        clothingsFinishesCatalog.clothingsColors.unshift("n/a");

        clothingsFinishesCatalog.clothingsPrints.unshift("n/a");

        clothingsFinishesCatalog.clothingsFinishes.unshift("n/a");

        res.status(200).json(clothingsFinishesCatalog);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getClothingFinishesDetails = async (req, res) => {
    try {
        const clothingsFinishesDetails = await prisma.clothingFinishDetail.findMany();
        res.status(200).json(clothingsFinishesDetails);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getClothingFinishesDetailsByOrderId = async (req, res) => {
    try {
        const clothingsFinishesDetails = await prisma.clothingFinishDetail.findMany({

            where: {
                fk_idOrder: Number(req.params.id)
            },

            select: {
                fk_idOrder: true,
                clothingDescription: true,
                colorDescription: true,
                printDescription: true,
                finishDescription: true
            }

        });
        res.status(200).json(clothingsFinishesDetails);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createClothingsFinishesDetail = async (req, res) => {

    try {

        const clothingsFinishesDetailCrated = await prisma.clothingFinishDetail.create({
            data: req.body
        });

        res.status(201).json(clothingsFinishesDetailCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createClothingsFinishesDetails = async (req, res) => {

    try {

        const clothingsFinishesDetailsCrated = await prisma.clothingFinishDetail.createMany({
            data: req.body
        });

        res.status(201).json(clothingsFinishesDetailsCrated);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}