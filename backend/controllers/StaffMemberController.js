import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getStaffMembers = async (req, res) =>{
    try {
        const response = await prisma.staffMember.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getStaffMembersById = async (req, res) =>{
    try {
        const response = await prisma.staffMember.findUnique({
            where:{
                id_staffMember: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createStaffMember = async (req, res) =>{
   
    try {
        const staffMember = await prisma.staffMember.create({
            data: req.body
       
        });
        res.status(201).json(staffMember);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createStaffMemberMany = async (req, res) =>{
   
    try {
        const staffMemberMany = await prisma.staffMember.createMany({
            data: req.body
       
        });
        res.status(201).json(staffMemberMany);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateStaffMember =  async (req, res) =>{
    try {
        const staffMember = await prisma.staffMember.update({
            where:{
                id_staffMember: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(staffMember);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteStaffMember =  async (req, res) =>{
    try {
        const staffMember = await prisma.staffMember.delete({
            where:{
                id_staffMember: Number(req.params.id)
            }
        });
        res.status(200).json(staffMember);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}