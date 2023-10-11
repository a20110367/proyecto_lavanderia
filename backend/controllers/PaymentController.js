import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getPayments = async (req, res) =>{
    try {
        const response = await prisma.payment.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getPaymentsById = async (req, res) =>{
    try {
        const response = await prisma.payment.findUnique({
            where:{
                id_payment: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createPayment = async (req, res) =>{
   
    try {
        const user = await prisma.payment.create({
            data: req.body
       
        });
        res.status(201).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updatePayment =  async (req, res) =>{
    try {
        const user = await prisma.payment.update({
            where:{
                id_payment: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deletePayment =  async (req, res) =>{
    try {
        const user = await prisma.payment.delete({
            where:{
                id_payment: Number(req.params.id)
            }
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}