import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getWashMachines = async (req, res) =>{
    try {
        const response = await prisma.washMachine.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}
export const getDryMachines = async (req, res) =>{
    try {
        const response = await prisma.dryMachine.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getWashMachinesById = async (req, res) =>{
    try {
        const response = await prisma.washMachine.findUnique({
            where:{
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getDryMachinesById = async (req, res) =>{
    try {
        const response = await prisma.dryMachine.findUnique({
            where:{
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createWashMachine = async (req, res) =>{

    try {
        const machine = await prisma.washMachine.create({
           data:req.body

        });
        res.status(201).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createDryMachine = async (req, res) =>{

    try {
        const machine = await prisma.dryMachine.create({
           data:req.body

        });
        res.status(201).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createWashMachineMany = async (req, res) =>{

    try {
        const machineMany = await prisma.washMachine.createMany({
           data:req.body

        });
        res.status(201).json(machineMany);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}


export const createDryMachineMany = async (req, res) =>{

    try {
        const machineMany = await prisma.dryMachine.createMany({
           data:req.body

        });
        res.status(201).json(machineMany);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateWashMachine =  async (req, res) =>{

    try {
        const machine = await prisma.machine.update({
            where:{
                id_machine: Number(req.params.id)
            },
            data:req.body
        });
        res.status(200).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateDryMachine =  async (req, res) =>{
    
    try {
        const machine = await prisma.dryMachine.update({
            where:{
                id_machine: Number(req.params.id)
            },
            data:req.body
        });
        res.status(200).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteWashMachine =  async (req, res) =>{
    try {
        const machine = await prisma.washMachine.delete({
            where:{
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteDryMachine =  async (req, res) =>{
    try {
        const machine = await prisma.dryMachine.delete({
            where:{
                id_machine: Number(req.params.id)
            }
        });
        res.status(200).json(machine);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}