import index from "@green-api/whatsapp-api-client";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from 'moment';
moment.locale('es-mx');
const prisma = new PrismaClient();


export const getServicesReport = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const upperLimite = (moment(endDate).add(1, "days").toISOString());
    //const id = Number(req.params.id);

    const difDays = moment(endDate).diff(moment(startDate), 'days');

    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    console.log(difDays);

    try {

        //Buscamos los registros de order detail, los sumarizamos, tanto las unidades,
        //como los subtotales, pero prisma no permite recuperar las descripciones.

        const selfServiceSummary = await prisma.serviceOrderDetail.groupBy({
            //by: ['fk_selfService'],
            by: ["serviceDescription"],
            where: {
                AND: [

                    {
                        created: {
                            lte: upperLimite
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
                    {
                        cancelled: false
                    },
                ],
            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });
        console.log("selfServiceSummary")
        console.log(selfServiceSummary)

        const laundryServiceSummary = await prisma.serviceOrderDetail.groupBy({
            //by: ["fk_laundryService"],
            by: ["serviceDescription"],
            where: {
                AND: [

                    {
                        created: {
                            lte: upperLimite
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
                    {
                        cancelled: false
                    },
                ],
            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });

        console.log("laundryServiceSummary")
        console.log(laundryServiceSummary)

        const ironServiceSummary = await prisma.serviceOrderDetail.groupBy({
            //by: ["fk_ironService"],
            by: ["serviceDescription"],
            where: {
                AND: [

                    {
                        created: {
                            lte: upperLimite
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
                    {
                        cancelled: false
                    },
                ],
            },

            _sum: {
                units: true,
                subtotal: true,
            },

        });

        console.log("ironServiceSummary")
        console.log(ironServiceSummary)

        const drycleanServiceSummary = await prisma.serviceOrderDetail.groupBy({
            //by: ["fk_drycleanService"],
            by: ["serviceDescription"],
            where: {
                AND: [

                    {
                        created: {
                            lte: upperLimite
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
                    {
                        cancelled: false
                    },
                ],
            },

            _sum: {
                units: true,
                subtotal: true,
            },
        });

        console.log("drycleanServiceSummary")
        console.log(drycleanServiceSummary)

        const otherServiceSumary = await prisma.serviceOrderDetail.groupBy({
            //by: ["fk_otherService"],
            by: ["serviceDescription"],
            where: {
                AND: [

                    {
                        created: {
                            lte: upperLimite
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
                    {
                        cancelled: false
                    },
                ],
            },

            _sum: {
                units: true,
                subtotal: true,
            },
        });

        console.log("otherServiceSumary")
        console.log(otherServiceSumary)


        // ///conseguir ids de servicios por categoria en un array y sus correspondinetes descripciones en otro array
        let totalServiceSales = 0;
        let totalServiceNumber = 0;

        selfServiceSummary.forEach(service => {
            // let serviceDescription = selfServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_selfService);
            // service.description = service.serviceDescription
            totalServiceSales += service._sum.subtotal;
            totalServiceNumber += service._sum.units;
        });

        laundryServiceSummary.forEach(service => {
            // let serviceDescription = laundryServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_laundryService);
            // service.description = service.serviceDescription
            totalServiceSales += service._sum.subtotal;
            totalServiceNumber += service._sum.units;
        });

        ironServiceSummary.forEach(service => {
            // let serviceDescription = ironServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_ironService);
            // service.description = service.serviceDescription
            totalServiceSales += service._sum.subtotal;
            totalServiceNumber += service._sum.units;
        });

        drycleanServiceSummary.forEach(service => {
            // let serviceDescription = drycleanServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_drycleanService);
            // service.description = service.serviceDescription
            totalServiceSales += service._sum.subtotal;
            totalServiceNumber += service._sum.units;
        });

        otherServiceSumary.forEach(service => {
            // let serviceDescription = otherServiceCatalog.find(serviceItem => serviceItem.id_service === service.fk_otherService);
            // service.description = service.serviceDescription
            totalServiceSales += service._sum.subtotal;
            totalServiceNumber += service._sum.units;
        });

        const payStatusOrderSummary = await prisma.serviceOrder.groupBy({
            by: ["payStatus"],
            where: {
                AND: [

                    {
                        updatedAt: {
                            lte: upperLimite
                        },
                    },
                    {
                        updatedAt: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            orderStatus: "cancelled"
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

        const deliveryStatusOrderSummary = await prisma.serviceOrder.groupBy({
            by: ["orderStatus"],
            where: {
                AND: [

                    {
                        updatedAt: {
                            lte: upperLimite
                        },
                    },
                    {
                        updatedAt: {
                            gte: startDate
                        },
                    },
                    {
                        NOT: {
                            orderStatus: "cancelled"
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

        const cancelledOrderSummary = await prisma.serviceOrder.aggregate({

            where: {
                AND: [

                    {
                        updatedAt: {
                            lte: upperLimite
                        },
                    },
                    {
                        updatedAt: {
                            gte: startDate
                        },
                    },
                    {
                        orderStatus: "cancelled"
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

        // let totalDeliveryStatusSalesVerification = 0;
        // let totalDeliveryStatusOrdersVerification = 0;
        // let totalDeliveryStatusItemsVerification = 0;

        // deliveryStatusOrderSummary.forEach(item => {
        //     totalDeliveryStatusSalesVerification += item._sum.totalPrice;
        //     totalDeliveryStatusOrdersVerification += item._count.id_order;
        //     totalDeliveryStatusItemsVerification += item._sum.numberOfItems;
        // });

        // let totalPayStatusSalesVerification = 0;
        // let totalPayStatusNumberVerification = 0;
        // let totalPayStatusItemsVerification = 0;

        // payStatusOrderSummary.forEach(item => {
        //     totalPayStatusSalesVerification += item._sum.totalPrice;
        //     totalPayStatusNumberVerification += item._count.id_order;
        //     totalPayStatusItemsVerification += item._sum.numberOfItems;
        // });

        // console.log(totalServiceSalesVerification);
        // console.log(totalServiceNumberVerification);

        const response =
        {
            //Totales por servicios y categorias
            "selfServiceSummary": selfServiceSummary,
            "laundryServiceSummary": laundryServiceSummary,
            "ironServiceSummary": ironServiceSummary,
            "drycleanServiceSummary": drycleanServiceSummary,
            "otherServiceSumary": otherServiceSumary,
            "cancelledOrderSummary": cancelledOrderSummary,
            //Ordenes por su estado de pago
            "payStatusOrderSummary": payStatusOrderSummary,
            //Ordenes por su estado de entrega
            "deliveryStatusOrderSummary": deliveryStatusOrderSummary,
            //Sumario Basado en Ordenes de Servicio
            "totalServiceSalesVerification": totalServiceSales,
            "totalServiceNumberVerification": totalServiceNumber,
            //Suamario Basaso en Estatus de Entregas
            // "totalDeliveryStatusSalesVerification": totalDeliveryStatusSalesVerification,
            // "totalDeliveryStatusOrdersVerification": totalDeliveryStatusOrdersVerification,
            // "totalDeliveryStatusItemsVerification": totalDeliveryStatusItemsVerification,
            //Sumario basado en Estatus de Pago
            // "totalPayStatusSalesVerification": totalPayStatusSalesVerification,
            // "totalPayStatusNumberVerification": totalPayStatusNumberVerification,
            // "totalPayStatusItemsVerification": totalPayStatusItemsVerification,

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
    const upperLimite = (moment(endDate).add(1, "days").toISOString());
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
                                    lte: upperLimite
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
                            {
                                cancelled: false
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
                                    lte: upperLimite
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
                            {
                                cancelled: false
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
                                    lte: upperLimite
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
                            {
                                cancelled: false
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
                                    lte: upperLimite
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
                            {
                                cancelled: false
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
                                    lte: upperLimite
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
                            {
                                cancelled: false
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

        // summary[0].startDate = startDate;
        // summary[0].endDate = endDate;
        const response = {
            "summary": summary,
            "startDate": startDate,
            "endDate": endDate
        };

        res.status(200).json(response);

    } catch (e) {
        res.status(500).json({ msg: e.message });
    }

}

export const getSuppliesReport = async (req, res) => {

    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const upperLimite = (moment(endDate).add(1, "days").toISOString());

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
                            lte: upperLimite
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
        let totalSuppliesSales = 0;
        let totalSuppliesNumber = 0;

        suppliesSummary.forEach(supply => {
            let supplyDescription = suppliesCatalog.find(supplyItem => supplyItem.id_supply === supply.fk_supplyId);
            supply.description = supplyDescription.description
            totalSuppliesSales += supply._sum.subtotal;
            totalSuppliesNumber += supply._sum.units;
        });



        const response =
        {
            //Totales por servicios y categorias
            "suppliesSummary": suppliesSummary,

            //Sumario Basado en Ordenes de productos
            "totalSuppliesSalesVerification": totalSuppliesSales,
            "totalSuppliesNumberVerification": totalSuppliesNumber,

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
    const upperLimite = (moment(endDate).add(1, "days").toISOString());
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
                            lte: upperLimite
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

        // suppliesSummary.startDate = startDate;
        // suppliesSummary.endDate = endDate;
        // const response = suppliesSummary;

        const response =
        {
            "suppliesSummary": suppliesSummary,
            "startDate": startDate,
            "endDate": endDate
        }

        res.status(200).json(response);


    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getIncomeReport = async (req, res) => {

    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const upperLimite = (moment(endDate).add(1, "days").toISOString())

    const difDays = moment(endDate).diff(moment(startDate), 'days');

    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    console.log(upperLimite);
    console.log(difDays);


    try {

        const incomeSummary = await prisma.workshiftBalance.aggregate({


            _sum: {
                cashIncome: true,
                totalIncome: true,
                creditIncome: true,
                withdrawal: true,
                cancellations: true,
                totalIncome: true
            },
            where: {
                AND: [

                    {
                        created: {
                            lte: upperLimite
                        }
                    },
                    {
                        created: {
                            gte: startDate
                        }
                    },
                ],

            },
          
        });


        const response =
        {

            "incomeSummary": incomeSummary,
            "startDate": startDate,
            "endDate": endDate
        }

        res.status(200).json(response);

    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

