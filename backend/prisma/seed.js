import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await prisma.user.createMany({
        data:
            [
                {
                    "id_user": 1,
                    "name": "Israel",
                    "email": "israelramirezq@gmail.com",
                    "phone": "3313839768",
                    "pass": "SuperMan",
                    "role": "admin",
                    "firstLN": "Ramirez",
                    "secondLN": "Quintero",
                    "username": "admin",
                    "deleted": false
                },
                {
                    "id_user": 2,
                    "name": "Saul",
                    "email": "a20110347@ceti.mx",
                    "phone": "3321817496",
                    "pass": "3358",
                    "role": "admin",
                    "firstLN": "Rodriguez",
                    "secondLN": "Reynoso",
                    "username": "saul",
                    "deleted": false
                },
                {
                    "id_user": 3,
                    "name": "Rafael",
                    "email": "solucioneslegalesintegrales@hotmail.com",
                    "phone": "3312918941",
                    "pass": "1010",
                    "role": "admin",
                    "firstLN": "Zamora",
                    "secondLN": "Falcon",
                    "username": "Rafael",
                    "deleted": false
                }
            ],

    });


    await prisma.staffMember.createMany({

        data:
            [
                {
                    "id_staffMember": 1,
                    "name": "Israel",
                    "email": "israelramirezq@gmail.com",
                    "phone": "3313839768",
                    "firstLN": "Ramirez",
                    "secondLN": "Quintero",
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
                    "name": "Rafael",
                    "email": "solucioneslegalesintegrales@hotmail.com",
                    "phone": "3312918941",
                    "firstLN": "Zamora",
                    "secondLN": "Falcon",
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
                    "serialNumber": "N/A",
                    "ipAddress": null
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
                    "serialNumber": "N/A",
                    "ipAddress": null
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
                    "serialNumber": "N/A",
                    "ipAddress": null
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
                    "serialNumber": "N/A",
                    "ipAddress": null
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
                    "serialNumber": "N/A",
                    "ipAddress": null
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
                    "description": "Plancha 1",
                    "notes": "",
                    "serialNumber": "N/A",
                },
                {
                    "id_ironStation": 2,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "available",
                    "pieces": 150,
                    "description": "Plancha 2",
                    "notes": "",
                    "serialNumber": "N/A",
                },
                {
                    "id_ironStation": 3,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "unavailable",
                    "pieces": 123,
                    "description": "Plancha 3",
                    "notes": "",
                    "serialNumber": "N/A",
                },
                {
                    "id_ironStation": 4,
                    "machineType": "plancha",
                    "freeForUse": true,
                    "status": "unavailable",
                    "pieces": 130,
                    "description": "Plancha 4",
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
                    "description": "Lav. Encargo 1 a 6 kg",
                    "price": 145,
                    "priceCredit": 140,
                    "washWeight": 6,
                    "washCycleTime": 30,
                    "dryWeight": 6,
                    "dryCycleTime": 30,
                    "category_id": 2,
                },
                {
                    "id_service": 2,
                    "description": "Lav. Encargo 6.1 a 12 kg",
                    "price": 182,
                    "priceCredit": 180,
                    "washWeight": 12,
                    "washCycleTime": 30,
                    "dryWeight": 12,
                    "dryCycleTime": 30,
                    "category_id": 2,
                },
                {
                    "id_service": 3,
                    "description": "Lav. Encargo 12.1 a 16 kg",
                    "price": 230,
                    "priceCredit": 225,
                    "washWeight": 16,
                    "washCycleTime": 30,
                    "dryWeight": 16,
                    "dryCycleTime": 30,
                    "category_id": 2,
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
                    "category_id": 4,
                },
                {
                    "id_service": 2,
                    "description": "Tintoreria Pieza Sencilla",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 3,
                    "description": "Tintoreria Pantalón",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 4,
                    "description": "Tintoreria Camisa",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 5,
                    "description": "Tintoreria Falda",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 6,
                    "description": "Tintoreria Sweter",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 7,
                    "description": "Tintoreria Abrigo Sencillo",
                    "price": 95,
                    "priceCredit": 95,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 8,
                    "description": "Tintoreria Abrigo Largo",
                    "price": 120,
                    "priceCredit": 120,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 9,
                    "description": "Tintoreria Chamarra Sencilla",
                    "price": 85,
                    "priceCredit": 85,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 10,
                    "description": "Tintoreria Chaleco Sencillo",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 11,
                    "description": "Tintoreria Corbata",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 12,
                    "description": "Tintoreria Gabardina",
                    "price": 110,
                    "priceCredit": 110,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 13,
                    "description": "Tintoreria Gorra",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 14,
                    "description": "Tintoreria Pashimina",
                    "price": 55,
                    "priceCredit": 55,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 15,
                    "description": "Tintoreria Sudadera",
                    "price": 70,
                    "priceCredit": 70,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 16,
                    "description": "Tintoreria Traje 2 Piezas",
                    "price": 110,
                    "priceCredit": 110,
                    "pieces": 2,
                    "category_id": 4,
                },
                {
                    "id_service": 17,
                    "description": "Tintoreria Vestido Sencillo",
                    "price": 90,
                    "priceCredit": 90,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 18,
                    "description": "Tintoreria Vestido de Noche",
                    "price": 120,
                    "priceCredit": 120,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 19,
                    "description": "Tintoreria Vestido XV Años",
                    "price": 700,
                    "priceCredit": 700,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 20,
                    "description": "Tintoreria Vestido Comunion",
                    "price": 200,
                    "priceCredit": 200,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 21,
                    "description": "Tintoreria Traje de Charro 2 Pzas.",
                    "price": 200,
                    "priceCredit": 200,
                    "pieces": 2,
                    "category_id": 4,
                },
                {
                    "id_service": 22,
                    "description": "Tintoreria Traje de Charro 3 Pzas.",
                    "price": 280,
                    "priceCredit": 280,
                    "pieces": 3,
                    "category_id": 4,
                },
                {
                    "id_service": 23,
                    "description": "Tintoreria Teñido Pza Sencilla",
                    "price": 135,
                    "priceCredit": 135,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 24,
                    "description": "Tintoreria Teñido Prenda Larga",
                    "price": 165,
                    "priceCredit": 165,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 25,
                    "description": "Tintoreria Peluche Chico",
                    "price": 150,
                    "priceCredit": 150,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 26,
                    "description": "Tintoreria Peluche Grande",
                    "price": 250,
                    "priceCredit": 250,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 27,
                    "description": "Tintoreria Edredon Sencillo",
                    "price": 110,
                    "priceCredit": 110,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 28,
                    "description": "Tintoreria Edredon Plumas",
                    "price": 170,
                    "priceCredit": 170,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 29,
                    "description": "Tintoreria Almohada Chica",
                    "price": 75,
                    "priceCredit": 75,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 30,
                    "description": "Tintoreria Almohada Grande",
                    "price": 90,
                    "priceCredit": 90,
                    "pieces": 1,
                    "category_id": 4,
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
                    "category_id": 1,
                },
                {
                    "id_service": 2,
                    "description": "Autoservicio Lavadora 13 kg",
                    "price": 52,
                    "priceCredit": 50,
                    "weight": 13,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 3,
                    "description": "Autoservicio Lavadora 18 kg",
                    "price": 72,
                    "priceCredit": 70,
                    "weight": 18,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 4,
                    "description": "Autoservicio Lavadora 24 kg",
                    "price": 85,
                    "priceCredit": 83,
                    "weight": 24,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 5,
                    "description": "Autoservicio Lavadora 27 kg",
                    "price": 99,
                    "priceCredit": 97,
                    "weight": 27,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 6,
                    "description": "Autoservicio Secadora 10 kg",
                    "price": 46,
                    "priceCredit": 44,
                    "weight": 10,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "category_id": 1,
                },
                {
                    "id_service": 7,
                    "description": "Autoservicio Secadora 13 kg",
                    "price": 72,
                    "priceCredit": 70,
                    "weight": 13,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "category_id": 1,
                },
                {
                    "id_service": 8,
                    "description": "Autoservicio Secadora 18 kg",
                    "price": 72,
                    "priceCredit": 70,
                    "weight": 18,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "category_id": 1,
                },
                {
                    "id_service": 9,
                    "description": "Autoservicio Secadora 23 kg",
                    "price": 92,
                    "priceCredit": 90,
                    "weight": 23,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "category_id": 1,
                },
                {
                    "id_service": 10,
                    "description": "Autoservicio Lavadora 10 kg MARTES",
                    "price": 29,
                    "priceCredit": 27,
                    "weight": 10,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "category_id": 1,
                }
            ],
    });

    await prisma.ironService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Planchado Docena 12 pzas",
                    "price": 120,
                    "priceCredit": 115,
                    "pieces": 12,
                    "cycleTime": 30,
                    "category_id": 3,
                },
                {
                    "id_service": 2,
                    "description": "Planchado 6 pzas",
                    "price": 66,
                    "priceCredit": 10,
                    "pieces": 1,
                    "cycleTime": 10,
                    "category_id": 3,
                },
                {
                    "id_service": 3,
                    "description": "Planchado Pieza Sencilla",
                    "price": 11,
                    "priceCredit": 10,
                    "pieces": 1,
                    "cycleTime": 10,
                    "category_id": 3,
                },
                {
                    "id_service": 4,
                    "description": "Planchado Docena Promocion Miercoles",
                    "price": 99,
                    "priceCredit": 95,
                    "pieces": 12,
                    "cycleTime": 50,
                    "category_id": 3,
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
            "totalServiceBalance": 0,
            "cashCutD": "2025-06-20T00:00:00.000Z",
            "cashCutT": "1970-01-01T02:06:18.000Z",
            "id_cashCut": 1,
            "cashCutStatus": "closed",
            "initialCash": 0,
            "ordersPayed": 0,
            "ordersCancelled": 0,
            "ironPiecesDone": 0,
            "totalAutoservicio": 0,
            "totalServiceCash": 0,
            "totalCashWithdrawal": 0,
            "totalServiceCredit": 0,
            "totalEncargo": 0,
            "totalOtros": 0,
            "totalPlanchado": 0,
            "totalTintoreria": 0,
            "totalOtrosEncargo": 0,
            "totalServiceIncome": 0,
            "totalCancelations": 0,
            "pettyCashBalance": 0,
            "workShift": "morning"
        }
    });

    await prisma.supplyCashCut.create({

        data: {
            "fk_user": 1,
            "cashCutD": "2025-06-20T00:00:00.000Z",
            "cashCutT": "1970-01-01T02:15:20.000Z",
            "id_supplyCashCut": 1,
            "cashCutStatus": "closed",
            "initialCash": 0,
            "ordersPayedSupply": 0,
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
            "totalSuppliesCredit": 0,
            "totalSuppliesCash": 0,
            "totalSuppliesIncome": 0,
            "workShift": "morning"
        }

    });

    await prisma.workshiftBalance.create({
        data:
        {
            "id_workshifBalance": 1,
            "id_supplyCashCut": 1,
            "id_cashCut": 1,
            "cashIncome": 0,
            "creditIncome": 0,
            "withdrawal": 0,
            "cancellations": 0,
            "initialCash": 0,
            "totalCashBalace": 0,
            "totalIncome": 0,
        }
    });

    await prisma.pettyCash.create({
        data:
        {
            "amount": 0,
            "balance": 0,
            "id_movement": 1,
            "movementDate": "2024-11-29T02:15:19.814Z",
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
                    "description": "Jabon Chico",
                    "price": 6,
                    "category": "jabon",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 2,
                    "description": "Jabon Grande",
                    "price": 12,
                    "category": "jabon",
                    "unit": "mililitros",
                    "value": 200
                },
                {
                    "id_supply": 3,
                    "description": "Suavitel Chico",
                    "price": 6,
                    "category": "suavitel",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 4,
                    "description": "Suavitel Grande",
                    "price": 12,
                    "category": "suavitel",
                    "unit": "mililitros",
                    "value": 200
                },
                {
                    "id_supply": 5,
                    "description": "Pinol Chico",
                    "price": 6,
                    "category": "pinol",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 6,
                    "description": "Pinol Grande",
                    "price": 12,
                    "category": "pinol",
                    "unit": "mililitros",
                    "value": 200
                },
                {
                    "id_supply": 7,
                    "description": "Cloro Chico",
                    "price": 6,
                    "category": "cloro",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 8,
                    "description": "Cloro Grande",
                    "price": 12,
                    "category": "cloro",
                    "unit": "mililitros",
                    "value": 100
                },
                {
                    "id_supply": 9,
                    "description": "Bolsa",
                    "price": 10,
                    "category": "bolsa",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 10,
                    "description": "Gancho",
                    "price": 10,
                    "category": "ganchos",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 11,
                    "description": "WC",
                    "price": 10,
                    "category": "wc",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 12,
                    "description": "Afloja Mugre",
                    "price": 11,
                    "category": "jabon",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 13,
                    "description": "Ultra Monia",
                    "price": 11,
                    "category": "jabon",
                    "unit": "piezas",
                    "value": 1
                },
                {
                    "id_supply": 14,
                    "description": "Oximugre",
                    "price": 12,
                    "category": "jabon",
                    "unit": "piezas",
                    "value": 1
                },
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