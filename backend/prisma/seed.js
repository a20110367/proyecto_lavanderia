import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await prisma.user.createMany({
        data:
            [
                {
                    "id_user": 1,
                    "name": "Axel",
                    "email": "a20110341@ceti.mx",
                    "phone": "3321543206",
                    "pass": "0117",
                    "role": "admin",
                    "created": "2023-11-20T19:23:47.340Z",
                    "firstLN": "Vergara",
                    "secondLN": "Flores",
                    "username": "rojo",
                    "updatedAt": "2023-11-20T19:21:25.500Z",
                    "deleted": false
                },
                {
                    "id_user": 2,
                    "name": "Saul",
                    "email": "a20110347@ceti.mx",
                    "phone": "3321817496",
                    "pass": "3358",
                    "role": "admin",
                    "created": "2023-11-20T19:23:47.340Z",
                    "firstLN": "Rodriguez",
                    "secondLN": "Reynoso",
                    "username": "saul",
                    "updatedAt": "2023-11-20T19:21:25.880Z",
                    "deleted": false
                },
                {
                    "id_user": 3,
                    "name": "Israel",
                    "email": "a20110367@ceti.mx",
                    "phone": "3313839768",
                    "pass": "1010",
                    "role": "admin",
                    "created": "2023-11-20T19:23:47.340Z",
                    "firstLN": "Ramirez",
                    "secondLN": "Quintero",
                    "username": "isra",
                    "updatedAt": "2023-11-20T19:24:56.409Z",
                    "deleted": false
                },
                {
                    "id_user": 4,
                    "name": "juanito",
                    "email": "pyrop59@gmail.com",
                    "phone": "1234567890",
                    "pass": "1234",
                    "role": "employee",
                    "created": "2023-11-20T19:24:56.409Z",
                    "firstLN": "perez",
                    "secondLN": "perez",
                    "username": "juanito",
                    "updatedAt": "2023-11-20T19:24:07.948Z",
                    "deleted": false
                }
            ],

    });


    await prisma.staffMember.createMany({

        data:
            [
                {
                    "id_staffMember": 1,
                    "name": "Axel",
                    "email": "a20110341@ceti.mx",
                    "phone": "3321543206",
                    "firstLN": "Vergara",
                    "secondLN": "Flores",
                    "deleted": false
                },
                {
                    "id_staffMember": 2,
                    "name": "Saul",
                    "email": "a20110347@ceti.mx",
                    "phone": "3321817496",
                    "firstLN": "Rodriguez",
                    "secondLN": "Reynoso",
                    "deleted": false
                },
                {
                    "id_staffMember": 3,
                    "name": "Israel",
                    "email": "a20110367@ceti.mx",
                    "phone": "3313839768",
                    "firstLN": "Ramirez",
                    "secondLN": "Quintero",
                    "deleted": false
                },
                {
                    "id_staffMember": 4,
                    "name": "juanito",
                    "email": "pyrop59@gmail.com",
                    "phone": "1234567890",
                    "firstLN": "perez",
                    "secondLN": "perez",
                    "deleted": false
                }
            ],
    });

    await prisma.category.createMany({

        data:
            [
                {
                    "id_category": 1,
                    "categoryDescription": "autoservicio"
                },
                {
                    "id_category": 2,
                    "categoryDescription": "encargo"
                },
                {
                    "id_category": 3,
                    "categoryDescription": "planchado"
                },
                {
                    "id_category": 4,
                    "categoryDescription": "tintoreria"
                },
                {
                    "id_category": 5,
                    "categoryDescription": "varios"
                }
            ],
    });

    await prisma.client.createMany({
        data:
            [
                {
                    "id_client": 1,
                    "name": "Publico en General",
                    "email": "mail@mail.com",
                    "phone": "3321817496",
                    "pass": "",
                    "firstLN": "Publico",
                    "secondLN": "Publico",
                    "username": "",
                    "deleted": false
                },
                {
                    "id_client": 2,
                    "name": "Janito",
                    "email": "a20110367@ceti.mx",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "Lopez",
                    "secondLN": "Perez",
                    "username": null,
                    "deleted": false
                },
                {
                    "id_client": 3,
                    "name": "cliente2",
                    "email": "mail2@mail2.com",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "cliente2",
                    "secondLN": "cliente2",
                    "username": "cliente2",
                    "deleted": false
                },
                {
                    "id_client": 4,
                    "name": "cliente3",
                    "email": "mail3@mail3.com",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "cliente3",
                    "secondLN": "cliente3",
                    "username": "cliente3",
                    "deleted": false
                },
                {
                    "id_client": 5,
                    "name": "cliente4",
                    "email": "mail4@mail4.com",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "cliente4",
                    "secondLN": "cliente4",
                    "username": "cliente4",
                    "deleted": false
                },
                {
                    "id_client": 6,
                    "name": "pedro",
                    "email": "mailito@mailito.com",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "perez",
                    "secondLN": "perez",
                    "username": "pedro",
                    "deleted": false
                },
                {
                    "id_client": 7,
                    "name": "juan",
                    "email": "mail@mail2.com",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "x",
                    "secondLN": "x",
                    "username": "juan",
                    "deleted": false
                },
                {
                    "id_client": 8,
                    "name": "juan2",
                    "email": "mail43@mail.com",
                    "phone": "3321817496",
                    "pass": "",
                    "firstLN": "picada",
                    "secondLN": "papas",
                    "username": "juan2",
                    "deleted": false
                },
                {
                    "id_client": 9,
                    "name": "Pepe ",
                    "email": "yujiitadori@gmail.com",
                    "phone": "3321817496",
                    "pass": "",
                    "firstLN": "Flores",
                    "secondLN": "Coria",
                    "username": null,
                    "deleted": false
                },
                {
                    "id_client": 10,
                    "name": "Cliente encargo",
                    "email": "makizenin@gmail.com",
                    "phone": "3385697406",
                    "pass": "",
                    "firstLN": "Flores",
                    "secondLN": "Mora",
                    "username": null,
                    "deleted": false
                },
                {
                    "id_client": 11,
                    "name": "cosa",
                    "email": "mailmailmail@mail.com",
                    "phone": "3313839768",
                    "pass": "",
                    "firstLN": "cosa",
                    "secondLN": "cosa",
                    "username": null,
                    "deleted": false
                },
                {
                    "id_client": 12,
                    "name": "Cliente Tintoreria",
                    "email": "akame@gmail.com",
                    "phone": "8896157602",
                    "pass": "",
                    "firstLN": "Akame",
                    "secondLN": "Ga kill",
                    "username": null,
                    "deleted": false
                },
                {
                    "id_client": 13,
                    "name": "juan",
                    "email": "orsted@gmail.com",
                    "phone": "7756982164",
                    "pass": "",
                    "firstLN": "x",
                    "secondLN": "x",
                    "username": null,
                    "deleted": false
                },
                {
                    "id_client": 14,
                    "name": "Juan Pablo",
                    "email": "juanito@juanito.com",
                    "phone": "3338431799",
                    "pass": "",
                    "firstLN": "De la cruz",
                    "secondLN": "Perez",
                    "username": null,
                    "deleted": false
                }
            ],
    });

    await prisma.machine.createMany({
        data:
            [
                {
                    "id_machine": 1,
                    "machineType": "lavadora",
                    "model": "Primus 18 kg",
                    "machineNumber": 1,
                    "cicleTime": 30,
                    "weight": 18,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-07T01:07:52.186Z",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.59"
                },
                {
                    "id_machine": 2,
                    "machineType": "secadora",
                    "model": "Speed Queen 13 kg",
                    "machineNumber": 1,
                    "cicleTime": 30,
                    "weight": 13,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-19T02:57:53.460Z",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.103"
                },
                {
                    "id_machine": 3,
                    "machineType": "lavadora",
                    "model": "Primus 27 Kg",
                    "machineNumber": 2,
                    "cicleTime": 30,
                    "weight": 27,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-02-19T01:22:13.218Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 4,
                    "machineType": "secadora",
                    "model": "Speed Queen 23 kg",
                    "machineNumber": 2,
                    "cicleTime": 30,
                    "weight": 23,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "30",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-19T03:08:36.737Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 5,
                    "machineType": "lavadora",
                    "model": "Primus 24 kg",
                    "machineNumber": 3,
                    "cicleTime": 30,
                    "weight": 24,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-02-19T01:22:15.038Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 6,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 3,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-19T03:09:24.494Z",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.96"
                },
                {
                    "id_machine": 7,
                    "machineType": "lavadora",
                    "model": "Lavadora",
                    "machineNumber": 4,
                    "cicleTime": 30,
                    "weight": 20,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-07T01:07:52.186Z",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.173"
                },
                {
                    "id_machine": 8,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 5,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-07T01:03:53.841Z",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.39"
                },
                {
                    "id_machine": 9,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 6,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-07T01:12:54.009Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 10,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 7,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2024-11-30T01:31:04.955Z",
                    "updatedAt": "2025-03-07T01:07:52.186Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 11,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 8,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:43:49.557Z",
                    "updatedAt": "2025-03-19T02:43:49.557Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 12,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 9,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:43:49.926Z",
                    "updatedAt": "2025-03-19T02:43:49.926Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 13,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 10,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:44:15.782Z",
                    "updatedAt": "2025-03-19T02:44:15.782Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 14,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 11,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:45:57.707Z",
                    "updatedAt": "2025-03-19T02:45:57.707Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 15,
                    "machineType": "lavadora",
                    "model": "LG 10 kg",
                    "machineNumber": 12,
                    "cicleTime": 34,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:46:15.973Z",
                    "updatedAt": "2025-03-19T02:46:15.973Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 16,
                    "machineType": "lavadora",
                    "model": "Primus 13 kg",
                    "machineNumber": 13,
                    "cicleTime": 27,
                    "weight": 13,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:47:23.217Z",
                    "updatedAt": "2025-03-19T02:47:23.217Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 17,
                    "machineType": "lavadora",
                    "model": "Whirlpool 13 kg",
                    "machineNumber": 14,
                    "cicleTime": 60,
                    "weight": 13,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:48:12.293Z",
                    "updatedAt": "2025-03-19T02:48:12.293Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 18,
                    "machineType": "lavadora",
                    "model": "Primus 27 kg",
                    "machineNumber": 15,
                    "cicleTime": 34,
                    "weight": 27,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:50:02.555Z",
                    "updatedAt": "2025-03-19T02:50:02.555Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 19,
                    "machineType": "lavadora",
                    "model": "Lavadora 10 kg",
                    "machineNumber": 17,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:50:44.933Z",
                    "updatedAt": "2025-03-19T02:50:44.933Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 20,
                    "machineType": "lavadora",
                    "model": "Lavadora 10 kg",
                    "machineNumber": 18,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T02:50:58.662Z",
                    "updatedAt": "2025-03-19T02:50:58.662Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 21,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 4,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:09:55.422Z",
                    "updatedAt": "2025-03-19T03:09:55.422Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 22,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 5,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:10:30.007Z",
                    "updatedAt": "2025-03-19T03:10:30.007Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 23,
                    "machineType": "secadora",
                    "model": "Speed Queen 10 kg",
                    "machineNumber": 6,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:11:21.976Z",
                    "updatedAt": "2025-03-19T03:11:21.976Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 24,
                    "machineType": "secadora",
                    "model": "Speed Queen 10 kg",
                    "machineNumber": 7,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:11:44.838Z",
                    "updatedAt": "2025-03-19T03:11:44.838Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 25,
                    "machineType": "secadora",
                    "model": "Speed Queen 18 kg",
                    "machineNumber": 8,
                    "cicleTime": 30,
                    "weight": 18,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:12:06.256Z",
                    "updatedAt": "2025-03-19T03:12:06.256Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 26,
                    "machineType": "secadora",
                    "model": "Speed Queen 18 kg",
                    "machineNumber": 9,
                    "cicleTime": 30,
                    "weight": 18,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:12:46.375Z",
                    "updatedAt": "2025-03-19T03:12:46.375Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 27,
                    "machineType": "secadora",
                    "model": "UniMac 23 kg",
                    "machineNumber": 10,
                    "cicleTime": 20,
                    "weight": 23,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:13:27.431Z",
                    "updatedAt": "2025-03-19T03:13:27.431Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 28,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 11,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:15:03.411Z",
                    "updatedAt": "2025-03-19T03:15:03.411Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 29,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 12,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:15:38.085Z",
                    "updatedAt": "2025-03-19T03:15:38.085Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 30,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 13,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:15:52.940Z",
                    "updatedAt": "2025-03-19T03:15:52.940Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 31,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 14,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:16:09.222Z",
                    "updatedAt": "2025-03-19T03:16:09.222Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 32,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 15,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:16:58.398Z",
                    "updatedAt": "2025-03-19T03:16:58.398Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 33,
                    "machineType": "secadora",
                    "model": "LG 10 kg",
                    "machineNumber": 16,
                    "cicleTime": 30,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "created": "2025-03-19T03:17:17.928Z",
                    "updatedAt": "2025-03-19T03:17:17.928Z",
                    "serialNumber": "N/A",
                    "ipAddress": null
                }
            ],
    });

    await prisma.ironStation.createMany({
        data:
            [
                {
                    "id_ironStation": 1,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "available",
                    "pieces": 150,
                    "description": "Plancha 2",
                    "notes": "",
                    "serialNumber": "N/A",
                },
                {
                    "id_ironStation": 2,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "available",
                    "pieces": 150,
                    "description": "Maldita Pobreza",
                    "notes": "",
                    "serialNumber": "N/A",
                },
                {
                    "id_ironStation": 3,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "unavailable",
                    "pieces": 123,
                    "description": "X3 NFC",
                    "notes": "",
                    "serialNumber": "N/A",
                },
                {
                    "id_ironStation": 4,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "unavailable",
                    "pieces": 130,
                    "description": "Alpha",
                    "notes": "",
                    "serialNumber": "N/A",
                }
            ],
    });

    await prisma.laundryService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Lavado Encargo 1 a 6 kg",
                    "price": 145,
                    "priceCredit": 140,
                    "washWeight": 6,
                    "washCycleTime": 30,
                    "dryWeight": 6,
                    "dryCycleTime": 30,
                    "id_category": 2,
                },
                {
                    "id_service": 2,
                    "description": "Lavado Encargo 6.1 a 12 kg",
                    "price": 182,
                    "priceCredit": 180,
                    "washWeight": 12,
                    "washCycleTime": 30,
                    "dryWeight": 12,
                    "dryCycleTime": 30,
                    "id_category": 2,
                },
                {
                    "id_service": 3,
                    "description": "Lavado Encargo 12.1 a 16 kg",
                    "price": 230,
                    "priceCredit": 225,
                    "washWeight": 16,
                    "washCycleTime": 30,
                    "dryWeight": 16,
                    "dryCycleTime": 30,
                    "id_category": 2,
                }
            ],
    });

    await prisma.drycleanService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Tintoreria Saco",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 2,
                    "description": "Tintoreria Pieza Sencilla",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 3,
                    "description": "Tintoreria Pantalón",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 4,
                    "description": "Tintoreria Camisa",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 5,
                    "description": "Tintoreria Falda",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 6,
                    "description": "Tintoreria Sweter",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 7,
                    "description": "Tintoreria Abrigo Sencillo",
                    "price": 95,
                    "priceCredit": 95,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 8,
                    "description": "Tintoreria Abrigo Largo",
                    "price": 120,
                    "priceCredit": 120,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 9,
                    "description": "Tintoreria Chamarra Sencilla",
                    "price": 85,
                    "priceCredit": 85,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 10,
                    "description": "Tintoreria Chaleco Sencillo",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 11,
                    "description": "Tintoreria Corbata",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 12,
                    "description": "Tintoreria Gabardina",
                    "price": 110,
                    "priceCredit": 110,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 13,
                    "description": "Tintoreria Gorra",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 14,
                    "description": "Tintoreria Pashimina",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 15,
                    "description": "Tintoreria Sudadera",
                    "price": 70,
                    "priceCredit": 70,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 16,
                    "description": "Tintoreria Traje 2 Piezas",
                    "price": 110,
                    "priceCredit": 110,
                    "pieces": 2,
                    "id_category": 4,
                },
                {
                    "id_service": 17,
                    "description": "Tintoreria Vestido Sencillo",
                    "price": 90,
                    "priceCredit": 90,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 18,
                    "description": "Tintoreria Vestido de Noche",
                    "price": 120,
                    "priceCredit": 120,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 19,
                    "description": "Tintoreria Vestido XV Años",
                    "price": 700,
                    "priceCredit": 700,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 20,
                    "description": "Tintoreria Vestido Comunion",
                    "price": 200,
                    "priceCredit": 200,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 21,
                    "description": "Tintoreria Traje de Charro 2 Pzas.",
                    "price": 200,
                    "priceCredit": 200,
                    "pieces": 2,
                    "id_category": 4,
                },
                {
                    "id_service": 22,
                    "description": "Tintoreria Traje de Charro 3 Pzas.",
                    "price": 280,
                    "priceCredit": 280,
                    "pieces": 3,
                    "id_category": 4,
                },
                {
                    "id_service": 23,
                    "description": "Tintoreria Teñido Pza Sencilla",
                    "price": 135,
                    "priceCredit": 135,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 24,
                    "description": "Tintoreria Teñido Prenda Larga",
                    "price": 165,
                    "priceCredit": 165,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 25,
                    "description": "Tintoreria Peluche Chico",
                    "price": 150,
                    "priceCredit": 150,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 26,
                    "description": "Tintoreria Peluche Grande",
                    "price": 250,
                    "priceCredit": 250,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 27,
                    "description": "Tintoreria Edredon Sencillo",
                    "price": 110,
                    "priceCredit": 110,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 28,
                    "description": "Tintoreria Edredon Plumas",
                    "price": 170,
                    "priceCredit": 170,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 29,
                    "description": "Tintoreria Almohada Chica",
                    "price": 75,
                    "priceCredit": 75,
                    "pieces": 1,
                    "id_category": 4,
                },
                {
                    "id_service": 30,
                    "description": "Tintoreria Almohada Grande",
                    "price": 90,
                    "priceCredit": 90,
                    "pieces": 1,
                    "id_category": 4,
                }
            ]
    });

    await prisma.selfService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Autoservicio Lavadora 10 kg",
                    "price": 39,
                    "priceCredit": 37,
                    "weight": 10,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "id_category": 1,
                },
                {
                    "id_service": 2,
                    "description": "Autoservicio Lavadora 13 kg",
                    "price": 52,
                    "priceCredit": 50,
                    "weight": 13,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "id_category": 1,
                },
                {
                    "id_service": 3,
                    "description": "Autoservicio Lavadora 18 kg",
                    "price": 72,
                    "priceCredit": 70,
                    "weight": 18,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "id_category": 1,
                },
                {
                    "id_service": 4,
                    "description": "Autoservicio Lavadora 24 kg",
                    "price": 85,
                    "priceCredit": 83,
                    "weight": 24,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "id_category": 1,
                },
                {
                    "id_service": 5,
                    "description": "Autoservicio Lavadora 27 kg",
                    "price": 99,
                    "priceCredit": 97,
                    "weight": 27,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "id_category": 1,
                },
                {
                    "id_service": 6,
                    "description": "Autoservicio Secadora 10 kg",
                    "price": 46,
                    "priceCredit": 44,
                    "weight": 10,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "id_category": 1,
                },
                {
                    "id_service": 7,
                    "description": "Autoservicio Secadora 13 kg",
                    "price": 72,
                    "priceCredit": 70,
                    "weight": 13,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "id_category": 1,
                },
                {
                    "id_service": 8,
                    "description": "Autoservicio Secadora 18 kg",
                    "price": 72,
                    "priceCredit": 70,
                    "weight": 18,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "id_category": 1,
                },
                {
                    "id_service": 9,
                    "description": "Autoservicio Secadora 23 kg",
                    "price": 92,
                    "priceCredit": 90,
                    "weight": 23,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "id_category": 1,
                },
                {
                    "id_service": 10,
                    "description": "Autoservicio Lavadora 10 kg MARTES",
                    "price": 29,
                    "priceCredit": 27,
                    "weight": 10,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "id_category": 1,
                }
            ],
    });

    await prisma.ironService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Planchado Docena 12pzs",
                    "price": 120,
                    "priceCredit": 115,
                    "pieces": 12,
                    "cycleTime": 30,
                    "id_category": 3,
                },
                {
                    "id_service": 2,
                    "description": "Planchado Pieza Sencilla",
                    "price": 11,
                    "priceCredit": 10,
                    "pieces": 1,
                    "cycleTime": 10,
                    "id_category": 3,
                },
                {
                    "id_service": 3,
                    "description": "Planchado Docena Promocion Miercoles",
                    "price": 99,
                    "priceCredit": 95,
                    "pieces": 12,
                    "cycleTime": 50,
                    "id_category": 3,
                }
            ]
    });

    await prisma.otherService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Lavado de tenis",
                    "price": 40,
                    "priceCredit": 35,
                    "category_id": 5,
                },
                {
                    "id_service": 3,
                    "description": "Lavado de colcha",
                    "price": 150,
                    "priceCredit": 140,
                    "category_id": 5,
                },
                {
                    "id_service": 6,
                    "description": "Lavado Prueba",
                    "price": 5,
                    "priceCredit": 5,
                    "category_id": 5,
                }
            ],
    });

    await prisma.ironControl.create({
        data:
        {
            "id_ironControl": 1,
            "piecesCashcut": 0,
            "piecesToday": 0,
            "piecesLeft": 0,
            "piecesTomorrow": 0,
            "piecesExpress": 0
        }
    });

    await prisma.cashCut.create({
        data: {
            "fk_user": 1,
            "total": 0,
            "created": "2024-11-29T02:08:23.190Z",
            "updatedAt": "2024-11-29T02:10:17.130Z",
            "cashCutD": "2024-11-29T00:00:00.000Z",
            "cashCutT": "1970-01-01T02:06:18.000Z",
            "id_cashCut": 1,
            "cashCutStatus": "closed",
            "initialCash": 0,
            "ordersPayed": 0,
            "ordersCancelled": 0,
            "ironPiecesDone": 0,
            "totalAutoservicio": 0,
            "totalCash": 0,
            "totalCashWithdrawal": 0,
            "totalCredit": 0,
            "totalEncargo": 0,
            "totalOtros": 0,
            "totalPlanchado": 0,
            "totalTintoreria": 0,
            "totalOtrosEncargo": 0,
            "totalIncome": 0,
            "totalCancelations": 0,
            "pettyCashBalance": 0,
            "workShift": "morning"
        }
    });

    await prisma.supplyCashCut.create({

        data: {
            "fk_user": 1,
            "total": 0,
            "created": "2024-11-29T02:15:19.814Z",
            "updatedAt": "2024-11-29T02:15:19.814Z",
            "cashCutD": "2024-11-29T00:00:00.000Z",
            "cashCutT": "1970-01-01T02:15:20.000Z",
            "id_supplyCashCut": 1,
            "cashCutStatus": "closed",
            "initialCash": 0,
            "ordersPayed": 0,
            "totalJabon": 0,
            "totalSuavitel": 0,
            "totalPinol": 0,
            "totalDesengrasante": 0,
            "totalCloro": 0,
            "totalSanitizante": 0,
            "totalBolsa": 0,
            "totalReforzado": 0,
            "totalGanchos": 0,
            "totalWC": 0,
            "totalOtros": 0,
            "totalCredit": 0,
            "totalCash": 0,
            "totalIncome": 0,
            "workShift": "morning"
        }

    });

    await prisma.pettyCash.create({
        data:
        {
            "amount": 0,
            "balance": 0,
            "id_movement": 1,
            "movementDate": "1970-01-01T00:00:00.000Z",
            "cause": "inicial",
            "fk_user": 1,
            "pettyCashType": "withdrawal"
        }
    });

    await prisma.supply.createMany({
        data:
            [
                {
                    "id_supply": 1,
                    "description": "Jabon Liquido",
                    "price": 10,
                    "category": "jabon",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 2,
                    "description": "Suavitel",
                    "price": 10,
                    "category": "suavitel",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 3,
                    "description": "Pinol",
                    "price": 10,
                    "category": "pinol",
                    "unit": "piezas",
                    "value": 100
                },
                {
                    "id_supply": 4,
                    "description": "Desengrasante",
                    "price": 10,
                    "category": "desengrasante",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 5,
                    "description": "Cloro",
                    "price": 10,
                    "category": "cloro",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 6,
                    "description": "Sanitizante",
                    "price": 10,
                    "category": "sanitizante",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 7,
                    "description": "Bolsa",
                    "price": 10,
                    "category": "bolsa",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 8,
                    "description": "Reforzado",
                    "price": 10,
                    "category": "reforzado",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 9,
                    "description": "Ganchos",
                    "price": 10,
                    "category": "ganchos",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 10,
                    "description": "WC",
                    "price": 10,
                    "category": "wc",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 11,
                    "description": "Varios",
                    "price": 10,
                    "category": "otros",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 12,
                    "description": "Otros",
                    "price": 10,
                    "category": "otros",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 13,
                    "description": "Jabon Grande",
                    "price": 20,
                    "category": "jabon",
                    "unit": "mililitros",
                    "value": 200
                },
                {
                    "id_supply": 14,
                    "description": "Jabon Jumbo",
                    "price": 30,
                    "category": "jabon",
                    "unit": "mililitros",
                    "value": 300
                }
            ]

    });

}

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });