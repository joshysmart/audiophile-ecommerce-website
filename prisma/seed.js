const { PrismaClient } = require('@prisma/client')
const product = require('./product.json')
const user = require('./user.json')

const prisma = new PrismaClient()

async function seed() {
  // Connect the client
  await prisma.$connect()
  // add products to database
  await Promise.all(
    getProducts().map(product => {
      return prisma.product.create({
        data: product
      })
    }),
  )
  // add users to database
  await Promise.all(
    getUsers().map(user => {
      return prisma.user.create({
        data: user
      })
    }),
  )
}

seed()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

function getProducts() {
  return product
}

function getUsers() {
  return user
}

