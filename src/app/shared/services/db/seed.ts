import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { items } from './schema'
import { config } from 'dotenv'

config({ path: '.env.local' })

const { envServer } = await import('@/config/env')

const client = postgres(envServer.DATABASE_URL, { prepare: false })
const db = drizzle(client)

const booksData = [
  {
    title: 'The Great Gatsby',
    description:
      'A portrait of the Jazz Age in all of its decadence and excess. Nick Carraway narrates the tragic story of Jay Gatsby and his obsession with the beautiful Daisy Buchanan.',
    imageUrl: 'https://i0.wp.com/americanwritersmuseum.org/wp-content/uploads/2018/02/CK-3.jpg',
  },
  {
    title: 'To Kill a Mockingbird',
    description:
      'Set in the American South during the 1930s, this novel follows young Scout Finch as her father Atticus defends a Black man falsely accused of a crime.',
    imageUrl: 'https://m.media-amazon.com/images/I/81O7u0dGaWL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: '1984',
    description:
      "George Orwell's haunting vision of a totalitarian future society where Big Brother watches every move. Winston Smith dares to rebel against the oppressive Party.",
    imageUrl: 'https://m.media-amazon.com/images/I/61HkdyBpKOL.jpg',
  },
  {
    title: 'Pride and Prejudice',
    description:
      "Jane Austen's beloved tale of Elizabeth Bennet navigating issues of manners, upbringing, morality, education, and marriage in early 19th-century England.",
    imageUrl: 'https://m.media-amazon.com/images/I/71CvWDPcVEL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'The Catcher in the Rye',
    description:
      "Holden Caulfield's first-person narrative of his experiences in New York City after being expelled from prep school. A defining novel of teenage alienation.",
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR91ejaiI0BKhtU6qxLhoymx3gmondfOEhlhWqfxPZJao5emO2lMuXneXI&s=10',
  },
  {
    title: 'Brave New World',
    description:
      "Aldous Huxley's vision of a future society where people are engineered and conditioned into happiness through technology and social control.",
    imageUrl: 'https://m.media-amazon.com/images/I/71GNqqXuN3L._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'The Hobbit',
    description:
      'Bilbo Baggins, a comfortable hobbit, is swept into an epic quest by the wizard Gandalf and a company of dwarves to reclaim their mountain home from the dragon Smaug.',
    imageUrl: 'https://m.media-amazon.com/images/I/712cDO7d73L._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'Fahrenheit 451',
    description:
      "Ray Bradbury's dystopian story of Guy Montag, a fireman who burns books in a future society where they are outlawed, who begins to question his life.",
    imageUrl: 'https://m.media-amazon.com/images/I/61GaWVM6ZlL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'The Alchemist',
    description:
      "Paulo Coelho's philosophical novel about a young Andalusian shepherd who yearns to travel in search of a worldly treasure as extravagant as any ever found.",
    imageUrl: 'https://m.media-amazon.com/images/I/61OuRVln3BL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'Dune',
    description:
      "Frank Herbert's science fiction masterpiece set in the distant future on the desert planet Arrakis. Follows Paul Atreides as he navigates political intrigue and destiny.",
    imageUrl: 'https://m.media-amazon.com/images/I/81DMp7F91LL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'The Master and Margarita',
    description:
      "Mikhail Bulgakov's satirical novel about the Devil's visit to Soviet Moscow and the parallel story of Pontius Pilate and Jesus. A masterpiece of Russian literature.",
    imageUrl: 'https://m.media-amazon.com/images/I/A16dyqJRpnL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'Norwegian Wood',
    description:
      "Haruki Murakami's nostalgic story of loss and sexuality set in Tokyo during the 1960s student revolution, told through the memories of Toru Watanabe.",
    imageUrl: 'https://m.media-amazon.com/images/I/712SInGyh5L.jpg',
  },
]

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    await db.delete(items)
    console.log('✓ Cleared existing items')

    const inserted = await db.insert(items).values(booksData).returning()
    console.log(`✓ Inserted ${inserted.length} books`)

    console.log('✅ Seeding complete!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
