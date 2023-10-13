import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getCashCuts = async (req, res) =>{
    try {
        const response = await prisma.cashCut.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getCashCutsById = async (req, res) =>{
    try {
        const response = await prisma.cashCut.findUnique({
            where:{
                id_cashCut: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createCashCut = async (req, res) =>{
   
    try {
        const cashCut = await prisma.cashCut.create({
            data: req.body
       
        });
        res.status(201).json(cashCut);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateCashCut =  async (req, res) =>{
    try {
        const cashCut = await prisma.cashCut.update({
            where:{
                id_cashCut: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(cashCut);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteCashCut =  async (req, res) =>{
    try {
        const cashCut = await prisma.cashCut.delete({
            where:{
                id_cashCut: Number(req.params.id)
            }
        });
        res.status(200).json(cashCut);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}