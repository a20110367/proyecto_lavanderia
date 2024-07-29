import index from "@green-api/whatsapp-api-client";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from 'moment';
moment.locale('es-mx');
const prisma = new PrismaClient();


// export const getGeneralReport = async (req, res) => {
//     try {
//         const response = await prisma.serviceOrder.findMany({


//             include: {
//                 client: {
//                     select: {
//                         name: true,
//                         firstLN: true,
//                         secondLN: true,
//                         email: true,
//                         phone: true,
//                     },
//                 },
//                 category: {
//                     select: {
//                         categoryDescription: true,
//                     }
//                 },
//                 user: {
//                     select: {
//                         name: true,
//                         firstLN: true,
//                         secondLN: true,
//                     },
//                 },
//                 ServiceOrderDetail: true,
//                 payment: true,
//                 deliveryDetail: {
//                     select: {
//                         user: {
//                             select: {
//                                 name: true,
//                                 firstLN: true,
//                                 secondLN: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });


//         res.status(200).json(response);
//     } catch (e) {
//         res.status(500).json({ msg: e.message });
//     }
// }

export const getServicesReport = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    //const id = Number(req.params.id);

    const difDays = moment(endDate).diff(moment(startDate), 'days');

    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    console.log(difDays);

    try {

        //Buscamos los registros de order detail, los sumarizamos, tanto las unidades,
        //como los subtotales, pero prisma no permite recuperar las descripciones.

        const selfServiceSummary = await prisma.serviceOrderDetail.groupBy({
            by: ['fk_selfService'],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            fk_selfService: null
                        }
                    },
                ],

            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });

        const laundryServiceSummary = await prisma.serviceOrderDetail.groupBy({
            by: ["fk_laundryService"],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            fk_laundryService: null
                        }
                    },
                ],


            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });

        const ironServiceSummary = await prisma.serviceOrderDetail.groupBy({
            by: ["fk_ironService"],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            fk_ironService: null
                        }
                    },
                ],


            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });

        const drycleanServiceSummary = await prisma.serviceOrderDetail.groupBy({
            by: ["fk_drycleanService"],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            fk_drycleanService: null
                        }
                    },
                ],


            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });

        const otherServiceSumary = await prisma.serviceOrderDetail.groupBy({
            by: ["fk_otherService"],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            fk_otherService: null
                        }
                    },
                ],


            },

            _sum: {
                units: true,
                subtotal: true,
            },


        });

        //Ahora hay que recuperar catalogos por categoria, para despues formatear el json final
        const selfServiceCatalog = await prisma.selfService.findMany({

            select: {
                id_service: true,
                description: true,
            }


        });
        const laundryServiceCatalog = await prisma.laundryService.findMany({

            select: {
                id_service: true,
                description: true,
            }


        });

        const ironServiceCatalog = await prisma.ironService.findMany({

            select: {
                id_service: true,
                description: true,
            }


        });

        const drycleanServiceCatalog = await prisma.drycleanService.findMany({

            select: {
                id_service: true,
                description: true,
            }


        });

        const otherServiceCatalog = await prisma.otherService.findMany({

            select: {
                id_service: true,
                description: true,
            }


        });
        ///conseguir ids de servicios por categoria en un array y sus correspondinetes descripciones en otro array
        let totalServiceSalesVerification = 0;
        let totalServiceNumberVerification = 0;

        selfServiceSummary.forEach(service => {
            let serviceDescription = selfServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_selfService);
            service.description = serviceDescription.description
            totalServiceSalesVerification += service._sum.subtotal;
            totalServiceNumberVerification += service._sum.units;
        });

        laundryServiceSummary.forEach(service => {
            let serviceDescription = laundryServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_laundryService);
            service.description = serviceDescription.description
            totalServiceSalesVerification += service._sum.subtotal;
            totalServiceNumberVerification += service._sum.units;
        });

        ironServiceSummary.forEach(service => {
            let serviceDescription = ironServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_ironService);
            service.description = serviceDescription.description
            totalServiceSalesVerification += service._sum.subtotal;
            totalServiceNumberVerification += service._sum.units;
        });

        drycleanServiceSummary.forEach(service => {
            let serviceDescription = drycleanServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_drycleanService);
            service.description = serviceDescription.description
            totalServiceSalesVerification += service._sum.subtotal;
            totalServiceNumberVerification += service._sum.units;
        });

        otherServiceSumary.forEach(service => {
            let serviceDescription = otherServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_otherService);
            service.description = serviceDescription.description
            totalServiceSalesVerification += service._sum.subtotal;
            totalServiceNumberVerification += service._sum.units;
        });

        const payStatusOrderSummary = await prisma.serviceOrder.groupBy({
            by: ["payStatus"],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },

                ],


            },
            _count: {
                id_order: true,
            },
            _sum: {
                totalPrice: true,
                numberOfItems: true,
            },


        });

        const deliverySatusOrderSummary = await prisma.serviceOrder.groupBy({
            by: ["orderStatus"],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },

                ],


            },
            _count: {
                id_order: true,
            },
            _sum: {
                totalPrice: true,
                numberOfItems: true
            },


        });

        let totalDeliveryStatusSalesVerification = 0;
        let totalDeliveryStatusOrdersVerification = 0;
        let totalDeliveryStatusItemsVerification = 0;

        deliverySatusOrderSummary.forEach(item => {
            totalDeliveryStatusSalesVerification += item._sum.totalPrice;
            totalDeliveryStatusOrdersVerification += item._count.id_order;
            totalDeliveryStatusItemsVerification += item._sum.numberOfItems;
        });

        let totalPayStatusSalesVerification = 0;
        let totalPayStatusNumberVerification = 0;
        let totalPayStatusItemsVerification = 0;

        payStatusOrderSummary.forEach(item => {
            totalPayStatusSalesVerification += item._sum.totalPrice;
            totalPayStatusNumberVerification += item._count.id_order;
            totalPayStatusItemsVerification += item._sum.numberOfItems;
        });

        const response =
        {
            //Totales por servicios y categorias
            "selfServiceSummary": selfServiceSummary,
            "laundryServiceSummary": laundryServiceSummary,
            "ironServiceSummary": ironServiceSummary,
            "drycleanServiceSummary": drycleanServiceSummary,
            "otherServiceSumary": otherServiceSumary,
            //Ordenes por su estado de pago
            "payStatusOrderSummary": payStatusOrderSummary,
            //Ordenes por su estado de entrega
            "deliverySatusOrderSummary": deliverySatusOrderSummary,
            //Sumario Basado en Ordenes de Servicio
            "totalServiceSalesVerification": totalServiceSalesVerification,
            "totalServiceNumberVerification": totalServiceNumberVerification,
            //Suamario Basaso en Estatus de Entregas
            "totalDeliveryStatusSalesVerification": totalDeliveryStatusSalesVerification,
            "totalDeliveryStatusOrdersVerification": totalDeliveryStatusOrdersVerification,
            "totalDeliveryStatusItemsVerification": totalDeliveryStatusItemsVerification,
            //Sumario basado en Estatus de Pago
            "totalPayStatusSalesVerification": totalPayStatusSalesVerification,
            "totalPayStatusNumberVerification": totalPayStatusNumberVerification,
            "totalPayStatusItemsVerification": totalPayStatusItemsVerification,

            "startDate": startDate,
            "endDate": endDate


        }

        res.status(200).json(response);

    } catch (e) {
        res.status(500).json({ msg: e.message });
    }

}


export const getServicesReportById = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const categoryId = Number(req.params.categoryId);
    const serviceId = Number(req.params.serviceId);

    const difDays = moment(endDate).diff(moment(startDate), 'days');

    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    console.log(difDays);

    let summary;
    let descriptionService;


    try {

        //Buscamos los registros de order detail, los sumarizamos, tanto las unidades,
        //como los subtotales, pero prisma no permite recuperar las descripciones.

        switch (categoryId) {
            case 1: {

                summary = await prisma.serviceOrderDetail.groupBy({
                    by: ['fk_selfService'],
                    where: {
                        AND: [

                            {
                                created: {
                                    lte: endDate
                                },
                            },
                            {
                                created: {
                                    gte: startDate
                                },
                            },
                            {

                                fk_selfService: serviceId

                            },
                        ],

                    },

                    _sum: {
                        units: true,
                        subtotal: true,
                    },

                });

                descriptionService = await prisma.selfService.findFirst({

                    where: {
                        id_service: serviceId,
                    },

                    select: {
                        description: true,
                    }


                });

                summary[0].description = descriptionService.description;
            }
                break;

            case 2: {

                summary = await prisma.serviceOrderDetail.groupBy({
                    by: ["fk_laundryService"],
                    where: {
                        AND: [

                            {
                                created: {
                                    lte: endDate
                                },
                            },
                            {
                                created: {
                                    gte: startDate
                                },
                            },
                            {
                                fk_laundryService: serviceId
                            },
                        ],


                    },

                    _sum: {
                        units: true,
                        subtotal: true,
                    },

                });


                descriptionService = await prisma.laundryService.findFirst({

                    where: {
                        id_service: serviceId
                    },

                    select: {
                        description: true,
                    }


                });

                summary[0].description = descriptionService.description;

            }
                break;

            case 3: {

                summary = await prisma.serviceOrderDetail.groupBy({
                    by: ["fk_ironService"],
                    where: {
                        AND: [

                            {
                                created: {
                                    lte: endDate
                                },
                            },
                            {
                                created: {
                                    gte: startDate
                                },
                            },

                            {

                                fk_ironService: serviceId

                            },
                        ],
                    },

                    _sum: {
                        units: true,
                        subtotal: true,
                    },

                });

                descriptionService = await prisma.ironService.findFirst({

                    where: {
                        id_service: serviceId
                    },

                    select: {
                        description: true,
                    }
                });

                summary[0].description = descriptionService.description;

            }
                break;

            case 4: {
                summary = await prisma.serviceOrderDetail.groupBy({
                    by: ["fk_drycleanService"],
                    where: {
                        AND: [

                            {
                                created: {
                                    lte: endDate
                                },
                            },
                            {
                                created: {
                                    gte: startDate
                                },
                            },
                            {

                                fk_drycleanService: serviceId

                            },

                        ],


                    },

                    _sum: {
                        units: true,
                        subtotal: true,
                    },

                });

                descriptionService = await prisma.drycleanService.findFirst({

                    where: {
                        id_service: serviceId
                    },

                    select: {
                        description: true,
                    }
                });

                summary[0].description = descriptionService.description;

            }
                break;

            case 5: {

                summary = await prisma.serviceOrderDetail.groupBy({
                    by: ["fk_otherService"],
                    where: {
                        AND: [

                            {
                                created: {
                                    lte: endDate
                                },
                            },
                            {
                                created: {
                                    gte: startDate
                                },
                            },
                            {

                                fk_otherService: serviceId

                            },
                        ],


                    },

                    _sum: {
                        units: true,
                        subtotal: true,
                    },
                });

                descriptionService = await prisma.otherService.findFirst({
                    where: {
                        id_service: serviceId
                    },

                    select: {
                        description: true,
                    }

                });

                summary[0].description = descriptionService.description;
            }
                break;

            default: {
                summary = [];
                summary[0].description = null;
            }
                break;
        }


        const response = summary;


        res.status(200).json(response);

    } catch (e) {
        res.status(500).json({ msg: e.message });
    }

}

export const getSuppliesReport = async (req, res) => {

    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    //const id = Number(req.params.id);

    const difDays = moment(endDate).diff(moment(startDate), 'days');

    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    console.log(difDays);


    try {

        //Buscamos los registros de supplyOrderDetail, los sumarizamos, tanto las unidades,
        //como los subtotales, pero prisma no permite recuperar las descripciones.

        const suppliesSummary = await prisma.supplyOrderDetail.groupBy({
            by: ['fk_supplyId'],
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    }
                ],

            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });



        //Ahora hay que recuperar catalogos por categoria, para despues formatear el json final
        const suppliesCatalog = await prisma.supply.findMany({

            select: {
                id_supply: true,
                description: true,
            }


        });

        ///conseguir ids de servicios por categoria en un array y sus correspondinetes descripciones en otro array
        let totalSuppliesSalesVerification = 0;
        let totalSuppliesNumberVerification = 0;

        suppliesSummary.forEach(supply => {
            let supplyDescription = suppliesCatalog.find(supplyItem => supplyItem.id_supply === supply.fk_supplyId);
            supply.description = supplyDescription.description
            totalSuppliesSalesVerification += supply._sum.subtotal;
            totalSuppliesNumberVerification += supply._sum.units;
        });



        const response =
        {
            //Totales por servicios y categorias
            "suppliesSummary": suppliesSummary,

            //Sumario Basado en Ordenes de Servicio
            "totalSuppliesSalesVerification": totalSuppliesSalesVerification,
            "totalSuppliesNumberVerification": totalSuppliesNumberVerification,

            "startDate": startDate,
            "endDate": endDate


        }

        res.status(200).json(response);


    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getSuppliesReportById = async (req, res) => {

    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const supplyId = Number(req.params.supplyId);

    const difDays = moment(endDate).diff(moment(startDate), 'days');

    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    console.log(difDays);


    try {

        //Buscamos los registros de supplyOrderDetail, los sumarizamos, tanto las unidades,
        //como los subtotales, pero prisma no permite recuperar las descripciones.

        const suppliesSummary = await prisma.supplyOrderDetail.aggregate({
            _sum: {
                units: true,
                subtotal: true,

            },
            where: {
                AND: [

                    {
                        created: {
                            lte: endDate
                        },
                    },
                    {
                        created: {
                            gte: startDate
                        },
                    },
                    {
                        fk_supplyId: supplyId
                    },

                ],

            }

        });

        const supplyDescription = await prisma.supply.findFirst({
            where: {
                id_supply: supplyId
            },

            select: {
                description: true,
            }


        });

        console.log(suppliesSummary)
        console.log(supplyDescription)
        suppliesSummary.description = supplyDescription.description;



        // //Ahora hay que recuperar catalogos por categoria, para despues formatear el json final
        // const suppliesCatalog = await prisma.supply.findMany({

        //     select: {
        //         id_supply: true,
        //         description: true,
        //     }


        // });

        // ///conseguir ids de servicios por categoria en un array y sus correspondinetes descripciones en otro array
        // let totalSuppliesSalesVerification = 0;
        // let totalSuppliesNumberVerification = 0;

        // suppliesSummary.forEach(supply => {
        //     let supplyDescription = suppliesCatalog.find(supplyItem => supplyItem.id_supply === supply.fk_supplyId);
        //     supply.description = supplyDescription.description
        //     totalSuppliesSalesVerification += supply._sum.subtotal;
        //     totalSuppliesNumberVerification += supply._sum.units;
        // });



        // const response =
        // {
        //     //Totales por servicios y categorias
        //     "suppliesSummary": suppliesSummary,

        //     //Sumario Basado en Ordenes de Servicio
        //     "totalSuppliesSalesVerification": totalSuppliesSalesVerification,
        //     "totalSuppliesNumberVerification": totalSuppliesNumberVerification,

        //     "startDate": startDate,
        //     "endDate": endDate


        // }

        res.status(200).json(suppliesSummary);


    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}