import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getClients = async (req, res) =>{
    try {
        const response = await prisma.client.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getClientsById = async (req, res) =>{
    try {
        const response = await prisma.client.findUnique({
            where:{
                id_client: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createClient = async (req, res) =>{
    const {username, name, firstName, secondName, email, phone, pass} = req.body;
    try {
        const client = await prisma.client.create({
            data:{
                username: username,
                name: name,
                firstName: firstName,
                secondName: secondName,
                email: email,                
                phone: phone,            
                pass: pass
            }
        });
        res.status(201).json(client);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateClient =  async (req, res) =>{
    const {username, name, firstName, secondName, email, phone, pass} = req.body;
    try {
        const client = await prisma.client.update({
            where:{
                id_client: Number(req.params.id)
            },
            data:{
                username: username,
                name: name,
                firstName: firstName,
                secondName: secondName,
                email: email,                
                phone: phone,            
                pass: pass
            }
        });
        res.status(200).json(client);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteClient =  async (req, res) =>{
    try {
        const user = await prisma.client.delete({
            where:{
                id_client: Number(req.params.id)
            }
        });
        res.status(200).json(client);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}