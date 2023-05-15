import { SuperTrunfoCard } from '@/core/SuperTrunfoCard';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
function getCode(index: number) {
    const letter = Math.floor(index / 4);
    const number = index % 4 + 1;
    return `${ALPHABET[letter]}${number}`
}

type Data = {
    cards: SuperTrunfoCard[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    console.log(req.query)

    const size = req.query.size || 32;

    const cats = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${size}&has_breeds=1&api_key=${process.env.API_KEY}`);

    const trunfoIndex = req.query.trunfoIndex || Math.floor(Math.random() * (cats.data.length - 4)) + 4;

    res.status(200).json({
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
    });
}
