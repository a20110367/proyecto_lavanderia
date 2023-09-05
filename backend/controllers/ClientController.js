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
                id_cliente: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createClient = async (req, res) =>{
    const {name, apellido_p, apellido_m, phone, email} = req.body;
    try {
        const client = await prisma.client.create({
            data:{
                name: name,
                apellido_p: apellido_p,
                apellido_m: apellido_m,
                phone: phone,
                email: email,
            }
        });
        res.status(201).json(client);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateClient =  async (req, res) =>{
    const {name, apellido_p, apellido_m, phone, email} = req.body;
    try {
        const client = await prisma.user.update({
            where:{
                id_cliente: Number(req.params.id)
            },
            data:{
                name: name,
                apellido_p: apellido_p,
                apellido_m: apellido_m,
                phone: phone,
                email: email,
            }
        });
        res.status(200).json(client);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteClient =  async (req, res) =>{
    //const {name, accessToken, email, phone, rol, pass} = req.body;
    try {
        const client = await prisma.client.delete({
            where:{
                id_cliente: Number(req.params.id)
            }
        });
        res.status(200).json(client);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}