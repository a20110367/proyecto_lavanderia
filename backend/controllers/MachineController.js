import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMachines = async (req, res) => {
    try {
        const response = await prisma.machine.findMany();
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}
// export const getDryMachines = async (req, res) =>{
//     try {
//         const response = await prisma.dryMachine.findMany();
//         res.status(200).json(response);
//     }catch(e){
//         res.status(500).json({msg:e.message});
//     }
// }

export const getMachinesById = async (req, res) => {
    try {
        const response = await prisma.machine.findUnique({
            where: {
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createMachine = async (req, res) => {

    try {

        let response

        const validation = await prisma.machine.findFirst({
            where: {

                AND: [
                    {
                        machineNumber: Number(req.body.machineNumber)
                    },
                    {
                        machineType: req.body.machineType
                    }
                ]
            }
        });

        response = null;

        if (validation === null) {
            const machine = await prisma.machine.create({
                data: req.body
            });

            response = machine
        }

        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createMachineMany = async (req, res) => {

    try {
        const machineMany = await prisma.machine.createMany({
            data: req.body

        });
        res.status(201).json(machineMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const updateMachine = async (req, res) => {

    try {

        let response

        const validation = await prisma.machine.findFirst({
            where: {

                AND: [
                    {
                        machineNumber: Number(req.body.machineNumber)
                    },
                    {
                        machineType: req.body.machineType
                    }
                ]
            }
        });

        response = null;
        if (validation === null) {

            const machine = await prisma.machine.update({
                where: {
                    id_machine: Number(req.params.id)
                },
                data: req.body
            });

            response = machine
        }

        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const deleteMachine = async (req, res) => {
    try {
        const machine = await prisma.machine.delete({
            where: {
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(machine);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
