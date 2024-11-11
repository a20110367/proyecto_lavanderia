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

export const createPaymentDelivery = async (req, res) =>{
   
    try {
        console.log(req.body);
        const payment = await prisma.payment.create({
            data: req.body.payment
       
        });
        console.log(payment);
        const delivery = await prisma.deliveryDetail.create({
            data: {
                fk_userCashier:req.body.deliveryDetail.fk_userCashier,
                deliveryDate:req.body.deliveryDetail.deliveryDate,
                deliveryTime:req.body.deliveryDetail.deliveryTime,
                fk_idOrder:req.body.deliveryDetail.fk_idOrder,
                fk_idPayment:payment.id_payment
            }
       
        });
        console.log(delivery);

        
        const orderPayment = await prisma.serviceOrder.update({
            where:{
                id_order:req.body.deliveryDetail.fk_idOrder,
            },
            data:{
                payStatus:'paid',
                orderStatus:'delivered',
                totalPrice: Number(req.body.payment.payTotal)
            },

        });

        console.log(orderPayment);

        const orderDetail = await prisma.serviceOrderDetail.findMany({
            where:{
                fk_serviceOrder:req.body.payment.fk_idOrder,
            },
            
            select:{
              id_serviceOrderDetail:true,
              units:true,
              LaundryService:{
                select:{
                    id_service:true,
                    description:true,
                    price:true,
                    priceCredit:true,
                }
              },
              SelfService:{
                select:{
                    id_service:true,
                    description:true,
                    price:true,
                    priceCredit:true,
                }
              },
              IronService:{
                select:{
                    id_service:true,
                    description:true,
                    price:true,
                    priceCredit:true,
                }
              },
              DrycleanService:{
                select:{
                    id_service:true,
                    description:true,
                    price:true,
                    priceCredit:true,
                }
              },
              OtherService:{
                select:{
                    id_service:true,
                    description:true,
                    price:true,
                    priceCredit:true,
                }
              }                
            }

        });

        console.log(orderDetail)

        // const orderCategory = await prisma.serviceOrder.findFirst({
        //     where:{
        //         id_order:req.body.deliveryDetail.fk_idOrder,
        //     },
        //     select:{
        //         fk_categoryId:true,
        //     }
        // });


        const result = {
            "payment":payment,
            "delivery":delivery,
            "orderPayment":orderPayment
        }

        res.status(201).json(result);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createPaymentAdvance = async (req, res) =>{
   
        console.log(req.body)

    try {
        const payment =  prisma.payment.create({
            data: req.body.payment
       
        });

        
        const orderPayment = prisma.serviceOrder.update({
            where:{
                id_order:Number(req.body.payment.fk_idOrder),
            },
            data:{
                payStatus:'paid',
                totalPrice: Number(req.body.payment.payTotal)
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