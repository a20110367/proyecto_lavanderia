import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMachines = async (req, res) =>{
    try {
        const response = await prisma.machine.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getMachinesById = async (req, res) =>{
    try {
        const response = await prisma.machine.findUnique({
            where:{
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createMachine = async (req, res) =>{
    //const {machineType, model, cicleTime, weight, status, notes} = req.body;
    try {
        const machine = await prisma.machine.create({
           data:req.body
            // data:{
            //     machineType: machineType,
            //     model: model,
            //     cicleTime: cicleTime,
            //     weight: weight,
            //     status: status,
            //     notes: notes,
            // }
        });
        res.status(201).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateMachine =  async (req, res) =>{
    const {machineType, model, cicleTime, weight, status, notes} = req.body;
    try {
        const machine = await prisma.machine.update({
            where:{
                id_machine: Number(req.params.id)
            },
            data:req.body
            // data:{
            //     machineType: machineType,
            //     model: model,
            //     cicleTime: cicleTime,
            //     weight: weight,
            //     status: status,
            //     notes: notes,
            // }
        });
        res.status(200).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteMachine =  async (req, res) =>{
    try {
        const machine = await prisma.machine.delete({
            where:{
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}