import { PrismaClient } from "@prisma/client";
import { response } from "express";

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

export const calculateCashCut = async (req, res) =>{
   
    try {
        const total = await prisma.payment.aggregate({
           
            where:{
                fk_cashCut: Number(req.params.id)
            },
            _sum:{
                payTotal:true
            }
        });

        const cash = await prisma.payment.aggregate({
            where:{
                AND:[
                    {
                        fk_cashCut: Number(req.params.id)                
                    
                    },
                    {
                      
                        payMethod: 'cash'
                    }

                ]
            },
        
            _sum:{
                payTotal:true
            }
        });

        const credit = await prisma.payment.aggregate({
           
            where:{
                AND:[
                    {
                        fk_cashCut: Number(req.params.id)                
                    
                    },
                    {
                      
                        payMethod: 'credit'
                    }

                ]
            },
            _sum:{
                payTotal:true
            }
        });

        const ordersPayed = await prisma.payment.findMany({
           
            where:{
                  fk_cashCut: Number(req.params.id)                            
            },select:{
                order:{
                    select:{
                        id_order:true
                    },
                },
            },
        });       

        
        //const ordersIds = ordersPayed.values();
        //const ordersIdsMap = new Map(Object.entries(JSON.parse(ordersPayed)));
        //console.log(ordersIdsMap);

        const response=
            {
                "cash":cash._sum.payTotal,
                "credit":credit._sum.payTotal,
                "total":total._sum.payTotal,
                "ordersPayed":ordersPayed
                //"selfService":selfService
                //"ordersIds":ordersIds
            }
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}