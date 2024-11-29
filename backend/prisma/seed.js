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
                    "model": "LG",
                    "machineNumber": 1,
                    "cicleTime": 1,
                    "weight": 11,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.59"
                },
                {
                    "id_machine": 2,
                    "machineType": "secadora",
                    "model": "Secadora 3000",
                    "machineNumber": 1,
                    "cicleTime": 2,
                    "weight": 30,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.103"
                },
                {
                    "id_machine": 3,
                    "machineType": "lavadora",
                    "model": "Mabe",
                    "machineNumber": 2,
                    "cicleTime": 30,
                    "weight": 30,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 4,
                    "machineType": "secadora",
                    "model": "Mabe2",
                    "machineNumber": 2,
                    "cicleTime": 30,
                    "weight": 303,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "30",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 5,
                    "machineType": "lavadora",
                    "model": "Ojuled",
                    "machineNumber": 3,
                    "cicleTime": 35,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 6,
                    "machineType": "secadora",
                    "model": "Perrona",
                    "machineNumber": 3,
                    "cicleTime": 3,
                    "weight": 12,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.96"
                },
                {
                    "id_machine": 7,
                    "machineType": "lavadora",
                    "model": "Grande",
                    "machineNumber": 4,
                    "cicleTime": 1,
                    "weight": 20,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.173"
                },
                {
                    "id_machine": 8,
                    "machineType": "lavadora",
                    "model": "Samsung",
                    "machineNumber": 5,
                    "cicleTime": 2,
                    "weight": 10,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": "192.168.137.39"
                },
                {
                    "id_machine": 9,
                    "machineType": "lavadora",
                    "model": "Prueba",
                    "machineNumber": 6,
                    "cicleTime": 40,
                    "weight": 20,
                    "status": "available",
                    "freeForUse": true,
                    "notes": "",
                    "serialNumber": "N/A",
                    "ipAddress": null
                },
                {
                    "id_machine": 10,
                    "machineType": "lavadora",
                    "model": "13",
                    "machineNumber": 12,
                    "cicleTime": 12,
                    "weight": 12,
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
                    "description": "Lavado 10 kg",
                    "price": 50,
                    "priceCredit": 40,
                    "washWeight": 30,
                    "washCycleTime": 30,
                    "dryWeight": 30,
                    "dryCycleTime": 30,
                    "category_id": 2,

                },
                {
                    "id_service": 2,
                    "description": "Lavado  15 kg",
                    "price": 80,
                    "priceCredit": 70,
                    "washWeight": 30,
                    "washCycleTime": 30,
                    "dryWeight": 30,
                    "dryCycleTime": 30,
                    "category_id": 2,
                },
                {
                    "id_service": 8,
                    "description": "Lavado 16 kg",
                    "price": 150,
                    "priceCredit": 140,
                    "washWeight": 16,
                    "washCycleTime": 60,
                    "dryWeight": 16,
                    "dryCycleTime": 60,
                    "category_id": 2,
                },
                {
                    "id_service": 9,
                    "description": "Lavado 20 kg",
                    "price": 100,
                    "priceCredit": 90,
                    "washWeight": 20,
                    "washCycleTime": 40,
                    "dryWeight": 20,
                    "dryCycleTime": 40,
                    "category_id": 2,
                },
                {
                    "id_service": 12,
                    "description": "Lavado Prueba",
                    "price": 15,
                    "priceCredit": 15,
                    "washWeight": 10,
                    "washCycleTime": 10,
                    "dryWeight": 10,
                    "dryCycleTime": 10,
                    "category_id": 2,
                }
            ],
    });

    await prisma.drycleanService.createMany({
        data:
            [
                {
                    "id_service": 1,
                    "description": "Tintoreria 5pz",
                    "price": 100,
                    "priceCredit": 90,
                    "pieces": 5,
                    "category_id": 4,
                },
                {
                    "id_service": 2,
                    "description": "tintoreria saco",
                    "price": 80,
                    "priceCredit": 70,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 3,
                    "description": "Vestido de Noche Tintoreria",
                    "price": 200,
                    "priceCredit": 190,
                    "pieces": 1,
                    "category_id": 4,
                },
                {
                    "id_service": 4,
                    "description": "Traje 3 Piezas Tintoreria",
                    "price": 150,
                    "priceCredit": 130,
                    "pieces": 3,
                    "category_id": 4,
                },
                {
                    "id_service": 5,
                    "description": "Traje dos Piezas Tintoreria",
                    "price": 100,
                    "priceCredit": 90,
                    "pieces": 2,
                    "category_id": 4,
                },
                {
                    "id_service": 6,
                    "description": "Tintoreria Prueba",
                    "price": 1,
                    "priceCredit": 1,
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
                    "description": "Autoservicio Secado",
                    "price": 50,
                    "priceCredit": 40,
                    "weight": 30,
                    "cycleTime": 30,
                    "machineType": "secadora",
                    "category_id": 1,
                },
                {
                    "id_service": 2,
                    "description": "Autoservicio Lavado 10K",
                    "price": 40,
                    "priceCredit": 35,
                    "weight": 30,
                    "cycleTime": 30,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 5,
                    "description": "Autoservicio Lavado Edredon 15 kilos",
                    "price": 145,
                    "priceCredit": 135,
                    "weight": 45,
                    "cycleTime": 60,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 6,
                    "description": "aaav autoservicio",
                    "price": 24,
                    "priceCredit": 20,
                    "weight": 5,
                    "cycleTime": 20,
                    "machineType": "lavadora",
                    "category_id": 1,
                },
                {
                    "id_service": 8,
                    "description": "Prueba Autoservicio",
                    "price": 5,
                    "priceCredit": 5,
                    "weight": 5,
                    "cycleTime": 5,
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
                    "description": "Planchado 12pzs",
                    "price": 60,
                    "priceCredit": 50,
                    "pieces": 12,
                    "cycleTime": 30,
                    "category_id": 3,
                },
                {
                    "id_service": 3,
                    "description": "Planchado 6pzs",
                    "price": 60,
                    "priceCredit": 50,
                    "pieces": 6,
                    "cycleTime": 40,
                    "category_id": 3,
                },
                {
                    "id_service": 4,
                    "description": "Pantalon Raya Planchado",
                    "price": 20,
                    "priceCredit": 10,
                    "pieces": 1,
                    "cycleTime": 5,
                    "category_id": 3,
                },
                {
                    "id_service": 6,
                    "description": "Planchado Prueba",
                    "price": 5,
                    "priceCredit": 5,
                    "pieces": 5,
                    "cycleTime": 5,
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

}

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });