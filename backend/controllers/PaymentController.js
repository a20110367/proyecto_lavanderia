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
        const payment =  prisma.payment.create({
            data: req.body
       
        });

        
        const orderPayment = prisma.serviceOrder.update({
            where:{
                id_order:Number(req.body.fk_idOrder),
            },
            data:{
                payStatus:'paid',
            },

        });

        const result= await prisma.$transaction([payment,orderPayment]);

        res.status(201).json(result);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createPaymentDelyvery = async (req, res) =>{
   
    try {
        const payment =  prisma.payment.create({
            data: req.body
       
        });

        const delivery =  prisma.deliveryDetail.create({
            data: {
                fk_userCashier:cashier,
                deliveryDate:deliveryDate,
                deliveryTime:deliveryTime,
                fk_idOrder:Number(req.body.fk_idOrder),
                fk_idPayment:id_payment
            }
       
        });

        
        const orderPayment = prisma.serviceOrder.update({
            where:{
                id_order:Number(req.body.fk_idOrder),
            },
            data:{
                payStatus:'paid',
                orderStatus:'delivered',
            },

        });



        const result= await prisma.$transaction([payment,delivery,orderPayment]);

        res.status(201).json(result);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createPaymentAdvance = async (req, res) =>{
   
    try {
        const payment =  prisma.payment.create({
            data: req.body
            //  {
            //     fk_idOrder:fk_idOrder,
            //     payMethod:payMethod,
            //     payDate:payDate,
            //     fk_userCashier:id_user,
            //     payTime:payTime,
            //     payTotal:payTotal

            // },
        });

        
        const orderPayment = prisma.serviceOrder.update({
            where:{
                id_order:Number(req.body.fk_idOrder),
            },
            data:{
                payStatus:'paid',
                orderStatus:'delivered',
            },

        });



        const result= await prisma.$transaction([payment,orderPayment]);

        res.status(201).json(result);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updatePayment =  async (req, res) =>{
    try {
        const payment = await prisma.payment.update({
            where:{
                id_payment: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(payment);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deletePayment =  async (req, res) =>{
    try {
        const payment = await prisma.payment.delete({
            where:{
                id_payment: Number(req.params.id)
            },
        });
        res.status(200).json(payment);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}