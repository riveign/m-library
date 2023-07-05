import { makeExecutableSchema } from '@graphql-tools/schema'
import type { GraphQLContext } from './context'
import type { Track } from '@prisma/client'

const typeDefinitions = /* GraphQL */ `
  type Query {
    listTracks: [Track!]!
  }

  type Track {
    id: ID!
    title: String!
  }

  type Mutation {
    createTrack(title: String!): Track!
  }
`

const resolvers = {
  Query: {
    listTracks: async (parent: unknown, args: unknown, context: GraphQLContext) => {
      return await context.prisma.track.findMany()
    }
  },
  Track: {
    id: (parent: Track) => parent.id,
    title: (parent: Track) => parent.title
  },

  Mutation: {
    async createTrack(
      parent: unknown, 
      args: { title: string },
      context: GraphQLContext
      ) {
        const newTrack = await context.prisma.track.create({
          data: {
            title: args.title
          }
        })
        return newTrack
    }
  } 
}
 
export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})