import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getPettyCash = async (req, res) =>{
    try {
        const response = await prisma.pettyCash.findMany({
            select:{
                amount:true,
                balance:true,
                id_movement:true,
                movementDate:true,
                cause:true,
                user:true,
                pettyCashType:true
            },               
                
        });
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getPettyCashBalance = async (req, res) =>{
    try {
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max:{
                id_movement:true,
            }             
        });

        const response = await prisma.pettyCash.get({
            where:{
                id_movement:lastPettyCash._max,
            },
            select:{
                balance:true,
            }
        });
        

        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const createDepositPettyCash = async (req, res) =>{
    try {
        
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max:{
                id_movement:true,
            }             
        });

        const balance = await prisma.pettyCash.get({
            where:{
                id_movement:lastPettyCash._max,
            },
            select:{
                balance:true,
            }
        });

        req.body.balance = balance + req.body.balance;

        const response = await prisma.pettyCash.create({
            data:req.body                 
        });

        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const createWithdrawalPettyCash = async (req, res) =>{
    try {
        
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max:{
                id_movement:true,
            }             
        });

        const balance = await prisma.pettyCash.get({
            where:{
                id_movement:lastPettyCash._max,
            },
            select:{
                balance:true,
            }
        });

        req.body.balance = balance - req.body.balance;

        
        const response = await prisma.pettyCash.create({
            data:req.body                 
        });
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const updatePettyCash = async (req, res) =>{
    try {
        const response = await prisma.pettyCash.update({
            where:{
                id_movement:Number(req.params.id)
            },
            data:req.body                 
        });
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const deletePettyCash = async (req, res) =>{
    try {
        const response = await prisma.pettyCash.update({
            where:{
                id_movement:Number(req.params.id)
            }
                          
        });
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}



