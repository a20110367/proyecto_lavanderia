import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getSupplyPayments = async (req, res) =>{
    try {
        const response = await prisma.supplyPayment.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getSupplyPaymentsById = async (req, res) =>{
    try {
        const response = await prisma.supplyPayment.findUnique({
            where:{
                id_payment: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createSupplyPayment = async (req, res) =>{
   
    try {
        const supplyPayment =  prisma.supplyPayment.create({
            data: req.body
       
        });

        
        const orderSupplyPayment = prisma.supplyOrder.update({
            where:{
                id_supplyOrder:Number(req.body.fk_idOrder),
            },
            data:{
                payStatus:'paid',
            },

        });

        const result= await prisma.$transaction([supplyPayment,orderSupplyPayment]);

        res.status(201).json(result);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}




export const updatePayment =  async (req, res) =>{
    try {
        const supplyPayment = await prisma.supplyPayment.update({
            where:{
                id_payment: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(supplyPayment);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deletePayment =  async (req, res) =>{
    try {
        const supplyPayment = await prisma.supplyPayment.delete({
            where:{
                id_payment: Number(req.params.id)
            },
        });
        res.status(200).json(supplyPayment);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}