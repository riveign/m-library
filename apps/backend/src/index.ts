import { PrismaClient } from '@prisma/client'
import { execute, parse } from 'graphql'
import { schema } from './schema'

const prisma = new PrismaClient()

async function main() {
    const myQuery = parse( /* GraphQL */ `
        query {
            hello
        } 
    `)

    const result = await execute({
        schema,
        document: myQuery,
    })
    console.log(result)
}

main()
//     .then(() => prisma.$disconnect())
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//     }
// )
