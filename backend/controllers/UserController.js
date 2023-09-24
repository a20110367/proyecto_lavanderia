import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authUser = async (req, res) =>{
    const {username, pass} = req.body
    try{
        const response = await prisma.user.findFirst({
            select:{
                id_user: true,
                username: true,
                role: true,
            },
            where:{
                username: username,
                pass: pass,
            }
        });
        res.status(200).json(response)
    }catch(e){
        res.status(500).json({msg:e.message})
    }
}

export const getUsers = async (req, res) =>{
    try {
        const response = await prisma.user.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getUsersById = async (req, res) =>{
    try {
        const response = await prisma.user.findUnique({
            where:{
                id_user: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createUser = async (req, res) =>{
    const {username, name, firstname, secondname, email, phone, pass, role} = req.body;
    try {
        const user = await prisma.user.create({
            data:{
                username: username,
                name: name,
                firstLN: firstname,
                secondLN: secondname,
                email: email,                
                phone: phone,            
                pass: pass,
                role: role
            }
        });
        res.status(201).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateUser =  async (req, res) =>{
    const {username, name, firstName, secondName, email, phone, pass, role} = req.body;
    try {
        const user = await prisma.user.update({
            where:{
                id_user: Number(req.params.id)
            },
            data:{
                username: username,
                name: name,
                firstLN: firstName,
                secondLN: secondName,
                email: email,                
                phone: phone,            
                pass: pass,
                role: role
            }
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteUser =  async (req, res) =>{
    try {
        const user = await prisma.user.delete({
            where:{
                id_user: Number(req.params.id)
            }
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}