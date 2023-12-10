import index from "@green-api/whatsapp-api-client";
import { PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({

            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },
                category: {
                    select: {
                        categoryDescription: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: true,
                payment: true,
                deliveryDetail: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                    },
                },
            },
        });


        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getOrdersById = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findFirst({
            where: {
                id_order: Number(req.body.id)
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: true,
            },

        });

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getOrdersByIdUser = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                fk_user: Number(req.params.fk_user)
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersByIdClient = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                fk_client: Number(req.params.fk_client)
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersSelfService = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                fk_categoryId: 1
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                category: {
                    select: {
                        categoryDescription: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: {
                    select: {
                        units: true,
                        subtotal: true,
                        SelfService: {
                            select: {
                                description: true,
                                price: true,
                                machineType: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const getOrdersLaundry = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                fk_categoryId: 2
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },
                category: {
                    select: {
                        categoryDescription: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: {
                    select: {
                        units: true,
                        subtotal: true,
                        LaundryService: {
                            select: {
                                description: true,
                                price: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersIron = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {

                fk_categoryId: 3
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },
                category: {
                    select: {
                        categoryDescription: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: {
                    select: {
                        units: true,
                        subtotal: true,
                        IronService: {
                            select: {
                                description: true,
                                price: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}





export const getOrdersLaundryFinished = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND: [
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId: 2
                    }

                ]

            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: {
                    select: {
                        units: true,
                        subtotal: true,
                        LaundryService: {
                            select: {
                                description: true,
                                price: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersIronFinished = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND: [
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId: 3
                    }

                ]
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                ServiceOrderDetail: {
                    select: {
                        units: true,
                        subtotal: true,
                        IronService: {
                            select: {
                                description: true,
                                price: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const createOrder = async (req, res) => {

    try {
        const serviceOrder = await prisma.serviceOrder.create({
            data: req.body

        });
        res.status(201).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const createOrderMany = async (req, res) => {

    try {
        const orderMany = await prisma.serviceOrder.createMany({
            data: req.body

        });
        res.status(201).json(orderMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createLaudryServiceOrder = async (req, res) => {

    try {

        const laundryDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

        });
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_laundryService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_laundryService: item.fk_laundryService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const laundryQueue = await prisma.laundryQueue.create({
                    data: {
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString() + "-" + series.toString()),
                        fk_laundryService: serviceQueue.at(i).fk_laundryService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                        WashDetail: {
                            create: {
                                fk_idWashMachine: null,
                                fk_idStaffMember: null,
                            },
                        },

                        DryDetail: {
                            create: {
                                fk_idDryMachine: null,
                                fk_idStaffMember: null,
                            },
                        },
                    },
                });
                laundryDetail.push(laundryQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": laundryDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createOtherServiceOrder = async (req, res) => {

    try {

        const otherDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

        });
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_otherService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_otherService: item.fk_otherService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const otherQueue = await prisma.otherQueue.create({
                    data: {
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString() + "-" + series.toString()),
                        fk_otherService: serviceQueue.at(i).fk_otherService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,

                    },
                });
                otherDetail.push(otherQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": otherDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}




export const createSelfServiceOrder = async (req, res) => {

    try {

        const selfServiceDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

        });
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_selfService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_selfService: item.fk_selfService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const selfServiceQueue = await prisma.selfServiceQueue.create({
                    data: {
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString() + "-" + series.toString()),
                        fk_selfService: serviceQueue.at(i).fk_selfService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                    },
                });
                selfServiceDetail.push(selfServiceQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": selfServiceDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createIronServiceOrder = async (req, res) => {

    try {

        const ironServiceDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

        });
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_ironService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_ironService: item.fk_ironService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const ironQueue = await prisma.ironQueue.create({
                    data: {
                        //id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()+"-"+series.toString()),
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()),
                        fk_idIronService: serviceQueue.at(i).fk_ironService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                    },
                });
                ironServiceDetail.push(ironQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": ironServiceDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const createDrycleanServiceOrder = async (req, res) => {

    try {

        const drycleanServiceDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

        });
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_drycleanService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_drycleanService: item.fk_drycleanService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const drycleanQueue = await prisma.drycleanQueue.create({
                    data: {
                        //id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()+"-"+series.toString()),
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()),
                        fk_idDrycleanService: serviceQueue.at(i).fk_drycleanService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                    },
                });
                drycleanServiceDetail.push(drycleanQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": drycleanServiceDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


// export const createIronServiceOrder = async (req, res) => {

//     try {
//         console.log(req.body.services);
//         const services = req.body.services.at(0);
//         //const{id_service,quantity,price,category_id}=services;

//         const service = await prisma.service.findFirst({
//             where: {

//                 id_service: services.fk_Service,
//             },

//             include: {
//                 IronService: true,
//             },

//         });
//         console.log(service);


//         const serviceOrder = await prisma.serviceOrder.create({

//             data: req.body.serviceOrder

//         });

//         console.log(serviceOrder.id_order);

//         const orderDetail = await prisma.serviceOrderDetail.create({

//             data: {
//                 units: services.units,
//                 subtotal: services.subtotal,
//                 fk_Service: services.fk_Service,
//                 fk_ServiceOrder: serviceOrder.id_order
//             },

//         });


//         console.log(service.IronService.at(0));
//         const ironService = await prisma.IronQueue.create({

//             data: {
//                 ironService: {
//                     connect: { id_service: service.IronService.at(0).id_service },
//                 },
//                 serviceOrder: {
//                     connect: { id_order: serviceOrder.id_order },
//                 }
//             }

//         });

//         const response = {

//             "serviceOrder": serviceOrder,
//             "orderDetail": orderDetail,
//             "ironService": ironService
//         }

//         res.status(201).json(response);

//     } catch (e) {
//         res.status(400).json({ msg: e.message });
//     }
// }

// export const createSelfServiceOrder = async (req, res) => {

//     try {

//         const services = req.body.services;
//         const washServiceCreated = [];
//         const dryServiceCreated = [];
//         console.log(services);

//         //const{id_service,quantity,price,category_id}=services;

//         const serviceOrder = await prisma.serviceOrder.create({

//             data: req.body.serviceOrder

//         });

//         console.log(serviceOrder.id_order);

//         const serviceDetail = services.map(item => ({ ...item, fk_ServiceOrder: serviceOrder.id_order }));

//         //console.log(serviceOrder.id_order);

//         const orderDetail = await prisma.serviceOrderDetail.createMany({

//             data: serviceDetail,
//             // data:{
//             //     units:quantity,
//             //     subtotal:price,
//             //     fk_Service:id_service,
//             //     fk_ServiceOrder:serviceOrder.id_order
//             // },

//         });

//         serviceDetail.forEach(async element => {


//             let cicloTimes = element.units;
//             while (cicloTimes > 0) {

//                 var typeWashService = true;

//                 var serviceWash = await prisma.washService.findFirst({
//                     where: {
//                         fk_idService: element.fk_Service,
//                     },
//                 });

//                 console.log(serviceWash);

//                 if (serviceWash === null) {

//                     var serviceDry = await prisma.dryService.findFirst({
//                         where: {
//                             fk_idService: element.fk_Service
//                         },

//                     });

//                     console.log(serviceDry);

//                     typeWashService = false;

//                     var dryService = await prisma.laundryDryQueue.create({
//                         data: {
//                             dryService: {
//                                 connect: { id_dryService: serviceDry.id_dryService },
//                             },
//                             serviceOrder: {
//                                 connect: { id_order: serviceOrder.id_order },
//                             }
//                         }

//                     });

//                     console.log(dryService);

//                     //dryServiceCreated.push({dryService});


//                 } else {

//                     var washService = await prisma.laundryWashQueue.create({

//                         data: {
//                             washService: {
//                                 connect: { id_washService: serviceWash.id_washService },
//                             },
//                             serviceOrder: {
//                                 connect: { id_order: serviceOrder.id_order },
//                             }
//                         }

//                     });
//                     console.log(washService);

//                     //washServiceCreated.push({...washService});


//                 }

//                 cicloTimes--;

//             }


//         });


//         const response = {

//             "serviceOrder": serviceOrder,
//             "orderDetail": orderDetail,
//             //"washService": washServiceCreated.length,
//             //dryService": dryServiceCreated.length
//         }

//         res.status(201).json(response);

//     } catch (e) {
//         res.status(400).json({ msg: e.message });
//     }
// }


export const updateOrder = async (req, res) => {

    try {
        const serviceOrder = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const serviceOrder = await prisma.serviceOrder.delete({
            where: {
                id_order: Number(req.params.id)
            }
        });
        res.status(200).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteOrderAll = async (req, res) => {
    try {
        const serviceOrder = await prisma.serviceOrder.deleteMany({});
        res.status(200).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}