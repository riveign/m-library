import { makeExecutableSchema } from '@graphql-tools/schema'
import type { GraphQLContext } from './context'
import type { Track, Artist } from '@prisma/client'

const typeDefinitions = /* GraphQL */ `
  type Query {
    listTracks: [Track!]!
    listArtists: [Artist!]!
    artist(id: ID!): Artist
    track(id: ID!): Track
  }

  type Track {
    id: ID!
    title: String!
  }

  type Artist {
    id: ID!
    name: String!
    tracks: [Track!]!
  }

  type Mutation {
    createTrack(title: String!, artistId: String!): Track!
    createArtist(name: String!): Artist!
    artist(id: ID!): Artist
    track(id: ID!): Track
  }
`

const resolvers = {
  Query: {
    listTracks: async (parent: unknown, args: unknown, context: GraphQLContext) => {
      return await context.prisma.track.findMany()
    },
    listArtists: async (parent: unknown, args: unknown, context: GraphQLContext) => {
      return await context.prisma.artist.findMany()
    }
  },
  Track: {
    id: (parent: Track) => parent.id,
    title: (parent: Track) => parent.title
  },
  
  Artist: {
    id: (parent: Artist) => parent.id,
    name: (parent: Artist) => parent.name,
    tracks(parent: Artist, args: unknown, context: GraphQLContext) {
      return context.prisma.track.findMany({
        where: {
          artistId: parent.id
        }
      })
    }
  },

  Mutation: {
    async createTrack(
      parent: unknown, 
      args: { title: string, artistId: string },
      context: GraphQLContext
      ) {
        const newTrack = await context.prisma.track.create({
          data: {
            artistId: parseInt(args.artistId),
            title: args.title
          }
        })
        return newTrack
    },

    async createArtist(
      parent: unknown,
      args: { name: string },
      context: GraphQLContext
    ) {
      const newArtist = await context.prisma.artist.create({
        data: {
          name: args.name
        }
      })
      return newArtist
    },

    async artist(
      parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) {
      const artist = await context.prisma.artist.findUnique({
        where: {
          id: parseInt(args.id)
        }
      })
      return artist
    },

    async track(
      parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) {
      const track = await context.prisma.track.findUnique({
        where: {
          id: parseInt(args.id)
        }
      })
      return track
    }
  } 
}
 
export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})