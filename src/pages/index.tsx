import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import { useMemo } from 'react'

type SuperTrunfoCard = {
  code: string
  name: string
  country: string
  image: string
  trunfo: boolean
  attributes: {
    intelligence: number
    adaptability: number
    affection_level: number
    energy_level: number
    social_needs: number
    health_issues: number
    vocalisation: number
  }
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
function getCode(index: number) {
  const letter = Math.floor(index / 4);
  const number = index % 4 + 1;
  return `${ALPHABET[letter]}${number}`
}

export async function getServerSideProps() {
  const cats = await axios.get(process.env.API_URL as string)

  const trunfoIndex = Math.floor(Math.random() * (cats.data.length - 4)) + 4

  return {
    props: {
      cards: cats.data.map((cat: any, index: number) => {
        return {
          code: getCode(index),
          name: cat.breeds[0].name,
          country: cat.breeds[0].origin,
          image: cat.url,
          trunfo: index === trunfoIndex,
          attributes: {
            intelligence: cat.breeds[0].intelligence,
            adaptability: cat.breeds[0].adaptability,
            affection_level: cat.breeds[0].affection_level,
            energy_level: cat.breeds[0].energy_level,
            social_needs: cat.breeds[0].social_needs,
            health_issues: cat.breeds[0].health_issues,
            vocalisation: cat.breeds[0].vocalisation
          }
        }
      })
    }
  }
}

type HomeProps = {
  cards: SuperTrunfoCard[]
}

export default function Home({ cards }: HomeProps) {

  const attributes = useMemo(() => [
    { name: 'intelligence', label: 'Inteligência' },
    { name: 'adaptability', label: 'Adaptabilidade' },
    { name: 'affection_level', label: 'Afeição' },
    { name: 'energy_level', label: 'Energia' },
    { name: 'social_needs', label: 'Social' },
    { name: 'health_issues', label: 'Saúde' },
    { name: 'vocalisation', label: 'Vocalização' }
  ], [])

  return (
    <>
      <Head>
        <title>Super Miaufo</title>
        <meta name="description" content="Super Miaufo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center' }}>Super Miaufo</h1>
        <div className={styles.container}>
          {cards.map((card, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardHeader}>
                <span>{card.code}</span>
                <span style={{ width: '100%', textAlign: 'center' }}>
                  {card.country}
                </span>
              </div>
              <div className={styles.cardImage}>
                <img src={card.image} alt={card.name} />
                {card.trunfo && <div className={styles.trunfo}>SUPER MIAUFO</div>}
              </div>
              <div>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <strong>{card.name}</strong>
                </div>
                <table className={styles.attributes}>
                  <tbody>
                    {attributes.map(attribute => (
                      <tr key={attribute.name}>
                        <td>{attribute.label}</td>
                        <td>{(card.attributes as any)[attribute.name]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
