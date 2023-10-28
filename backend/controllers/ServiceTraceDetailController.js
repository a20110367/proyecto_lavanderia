import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getServiceTraceDetails = async (req, res) =>{
    try {
        const response = await prisma.serviceTraceDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getServiceTraceDetailsById = async (req, res) =>{
    try {
        const response = await prisma.serviceTraceDetail.findMany({
            where:{
                id_serviceTraceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getServiceTraceDetailsByOrderId = async (req, res) =>{
    try {
        const idOrderDetailsArray = await prisma.orderServiceDetail.findMany({
            where:{
                fk_idOrder: Number(req.params.id)
            }
        });

        const serviceTraceDetailOrderArray= await prisma.serviceTraceDetail.findMany({
            where:{
                fk_idOrder:{
                    in:idOrderDetailsArray,
                },
               
                
            },
        });
        res.status(200).json(serviceTraceDetailOrderArray);


    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getServiceTraceDetailsByMachineId = async (req, res) =>{
    try {
        const idMachineDetail = await prisma.machine.findUnique({
            where:{
                id_machine: Number(req.params.id)
            },
        });

        const serviceTraceDetailMachineArray= await prisma.serviceTraceDetail.findMany({
            where:{
                fk_idMachine:idMachineDetail,     
            },
            take:50,
        });
        res.status(200).json(serviceTraceDetailMachineArray);


    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getServiceTraceDetailsByStaffMemberId = async (req, res) =>{
    try {
        const idStaff = await prisma.staffMember.findUnique({
            where:{
                id_staffMember: Number(req.params.id)
            }
        });

        const serviceTraceDetailStaffMemeberArray= await prisma.serviceTraceDetail.findMany({
            where:{
                fk_staffMember:idStaff
            },
            take:50,
        });
        res.status(200).json(serviceTraceDetailStaffMemeberArray);


    }catch(e){
        res.status(404).json({msg:e.message});
    }
}


export const createServiceTraceDetail = async (req, res) =>{
   
    try {
        const serviceTrace = await prisma.serviceTraceDetail.create({
            data: req.body
       
        });

        
        res.status(201).json(serviceTrace);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateServiceTraceDetail =  async (req, res) =>{
    try {
        const user = await prisma.serviceTraceDetail.updateMany({
            where:{
                fk_idOrderServiceDetail: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteServiceTraceDetail =  async (req, res) =>{
    try {
        const serviceTrace = await prisma.serviceTraceDetail.delete({
            where:{
                id_serviceTraceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(serviceTrace);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}