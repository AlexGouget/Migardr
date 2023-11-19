import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { faker } from '@faker-js/faker';

async function main() {

        const TOTAL_USERS = 10

        // for(let i = 0 ; i < TOTAL_USERS; i++) {
        //         await prisma.user.create({
        //                 data: {
        //                         name: faker.person.firstName(),
        //                         email: faker.internet.email(),
        //                         password: faker.internet.password()
        //                 }
        //         })
        // }


        // const TypesPoint =['Ceramic', 'Metal', 'Stone', 'Bone', 'Other']
        // for(let point of TypesPoint) {
        //
        //         await prisma.typepoint.create({
        //                 // @ts-ignore
        //                 data: {
        //                         libelle: point,
        //                         icon: `${point}.svg`,
        //                         description: faker.lorem.sentence()
        //                 }
        //         })
        // }


        const users = await prisma.user.findMany()
        const TypesPoint = await prisma.typepoint.findMany()

        const TOTAL_PTS = 20
        const totalUsers = await prisma.user.count()
        for(let i = 0 ; i < TOTAL_PTS; i++) {
                await prisma.point.create({
                        // @ts-ignore
                        data: {
                                user: {
                                        connect: {
                                                id: users[Math.floor(Math.random() * totalUsers)].id
                                        }
                                },
                                latitude: faker.location.latitude(),
                                longitude: faker.location.longitude(),
                                title: faker.lorem.sentence(),
                                yearDiscovery: faker.date.past().getFullYear(),
                                description: faker.lorem.sentence(),
                                content: faker.lorem.paragraphs(10),
                                year: faker.date.past().getFullYear(),
                                bc:  Math.random() >= 0.5,
                                urlimage: {
                                        create: {
                                                url: '/uploads/default.jpg',
                                                filename: 'default.jpg',
                                                mimetype: 'image/jpeg'
                                        }
                                },
                                slug: faker.lorem.slug(5),
                                typepoint: {
                                        connect: {
                                                id: TypesPoint[Math.floor(Math.random() * TypesPoint.length)].id
                                        }
                                }
                        }}
                        )

        }
}
main()
    .then(async () => {
            await prisma.$disconnect()
    })
    .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
    })