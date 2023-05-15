import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useMemo, useState } from 'react'
import { SuperTrunfoCard } from '@/core/SuperTrunfoCard'
import { useRouter } from 'next/router'

async function fetchCards(query?: {
  size?: string
  trunfoIndex?: string,
  random?: string
}): Promise<SuperTrunfoCard[]> {
  const data = await fetch(`${window.location.origin}/api/cards?${new URLSearchParams({
    size: query?.size || '',
    trunfoIndex: query?.trunfoIndex || '',
    random: query?.random || ''
  }).toString()}`)
    .then(response => response.json())

  return data.cards
}

export default function Home() {
  const router = useRouter()

  const query = router.query

  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState<SuperTrunfoCard[]>([])

  const attributes = useMemo(() => [
    { name: 'intelligence', label: 'Inteligência' },
    { name: 'adaptability', label: 'Adaptabilidade' },
    { name: 'affection_level', label: 'Afeição' },
    { name: 'energy_level', label: 'Energia' },
    { name: 'social_needs', label: 'Social' },
    { name: 'health_issues', label: 'Saúde' },
    { name: 'vocalisation', label: 'Vocalização' }
  ], [])

  const custom = useMemo(() => [
    { name: 'size', label: 'Tamanho do baralho' },
    { name: 'trunfoIndex', label: 'Carta trunfo' },
    { name: 'random', label: 'Aleatório' }
  ], [])

  useEffect(() => {
    if (window === undefined) return;
    if (!router.isReady) return;
    const size: string | undefined = (query as any).size
    const trunfoIndex: string | undefined = (query as any).trunfoIndex
    const random: string | undefined = (query as any).random
    setIsLoading(true)
    fetchCards({ size, trunfoIndex, random }).then(cards => {
      setCards(cards)
      setIsLoading(false)
    })
  }, [router.isReady, query])

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
        <form className={styles.custom}>
          {custom.map(attribute => (
            <input
              key={attribute.name}
              type="text"
              id={attribute.name}
              name={attribute.name}
              placeholder={attribute.label}
              defaultValue={(router.query as any)[attribute.name]}
            />
          ))}
          <button type="submit">Gerar</button>
        </form>
        <div className={styles.container}>
          {isLoading && (<div className={styles.loading}>Carregando...</div>)}
          {!isLoading && cards.map((card, index) => (
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
                <div style={{ width: '100%', textAlign: 'center', borderBottom: '1px solid #ccc', padding: '5px 0' }}>
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
