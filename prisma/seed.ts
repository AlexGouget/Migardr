import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { faker } from '@faker-js/faker';

async function main() {

        const TOTAL_USERS = 10

        for(let i = 0 ; i < TOTAL_USERS; i++) {
                await prisma.user.create({
                        data: {
                                name: faker.person.firstName(),
                                email: faker.internet.email(),
                                password: faker.internet.password()
                        }
                })
        }


        const TypesPoint =['Ceramic', 'Metal', 'Glass', 'Stone', 'Bone', 'Wood', 'Other']
        for(let point of TypesPoint) {

                await prisma.typepoint.create({
                        // @ts-ignore
                        data: {
                                libelle: point,
                                icon: `${point}.svg`,
                                description: faker.lorem.sentence()
                        }
                })
        }



        const TOTAL_PTS = 20
        const totalUsers = await prisma.user.count()
        for(let i = 0 ; i < TOTAL_PTS; i++) {
                await prisma.point.create({
                        // @ts-ignore
                        data: {
                                user: {
                                        connect: {
                                                id: Math.floor(Math.random() * totalUsers) + 1
                                        }
                                },
                                latitude: faker.location.latitude(),
                                longitude: faker.location.longitude(),
                                title: faker.lorem.sentence(),
                                yearDiscovery: faker.date.past().getFullYear(),
                                description: faker.lorem.sentence(),
                                year: faker.date.past().getFullYear(),
                                bc:  Math.random() >= 0.5,
                                typepoint: {
                                        connect: {
                                                id: Math.floor(Math.random() * TypesPoint.length) + 1
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