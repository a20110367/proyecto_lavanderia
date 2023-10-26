import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getCashWhithdrawals = async (req, res) =>{
    try {
        const response = await prisma.cashWhithdrawal.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getCashWhithdrawalsById = async (req, res) =>{
    try {
        const response = await prisma.cashWhithdrawal.findUnique({
            where:{
               id_cashWhihdrawal : Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createCashWhithdrawal = async (req, res) =>{
   
    try {
        const cashWhithdrawal = await  prisma.cashWhithdrawal.create({
            data: req.body
       
        });

        res.status(201).json(cashWhithdrawal);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateCashWhithdrawal =  async (req, res) =>{
    try {
        const cashWhithdrawal = await prisma.cashWhithdrawal.update({
            where:{
                id_cashWhithdrawal: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(cashWhithdrawal);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteCashWhithdrawal =  async (req, res) =>{
    try {
        const cashWhithdrawal = await prisma.cashWhithdrawal.delete({
            where:{
                id_cashWhithdrawal: Number(req.params.id)
            },
        });
        res.status(200).json(cashWhithdrawal);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}