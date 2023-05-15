export type SuperTrunfoCard = {
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