import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getCashWithdrawals = async (req, res) =>{
    try {
        const response = await prisma.cashWithdrawal.findMany({
            include: {
                user: {
                    select: {
                        name:true,
                    },
                },
            },
        }
        );
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getActiveCashWithdrawals = async (req, res) =>{
    try {

        let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())

        const response = await prisma.cashWithdrawal.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

            include: {
                user: {
                    select: {
                        name:true,
                    },
                },
            },
        }
        );
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getCashWithdrawalsById = async (req, res) =>{
    try {
        const response = await prisma.cashWithdrawal.findUnique({
            include: {
                user: {
                    select: {
                        name:true,
                    },
                },
            },
            where:{
                id_cashWithdrawal : Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createCashWithdrawal = async (req, res) =>{
   
    try {
        const cashWithdrawal = await  prisma.cashWithdrawal.create({
            data: req.body
        });

        res.status(201).json(cashWithdrawal);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateCashWithdrawal =  async (req, res) =>{
    try {
        const cashWithdrawal = await prisma.cashWithdrawal.update({
            where:{
                id_cashWithdrawal: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(cashWithdrawal);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteCashWithdrawal =  async (req, res) =>{
    try {
        const cashWithdrawal = await prisma.cashWithdrawal.delete({
            where:{
                id_cashWithdrawal: Number(req.params.id)
            },
        });
        res.status(200).json(cashWithdrawal);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}