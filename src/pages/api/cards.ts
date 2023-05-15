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

function randomAttribute(n: number, random: number) {
    const randomValue = Math.round(Math.random() * (random * 2 + 1)) - random;
    const value = n + randomValue;
    if (value < 1) return 1;
    if (value > 5) return 5;
    return value;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const size = req.query.size || 32;
    const random = Number(req.query.random) || 0;

    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${size}&has_breeds=1&api_key=${process.env.API_KEY}`);

    const cats = response.data.sort(() => Math.random() - 0.5);

    const trunfoIndex = req.query.trunfoIndex || Math.floor(Math.random() * (cats.length - 4)) + 4;

    res.status(200).json({
        cards: cats.map((cat: any, index: number) => {
            return {
                code: getCode(index),
                name: cat.breeds[0].name,
                country: cat.breeds[0].origin,
                image: cat.url,
                trunfo: index === trunfoIndex,
                attributes: {
                    intelligence: randomAttribute(cat.breeds[0].intelligence, random),
                    adaptability: randomAttribute(cat.breeds[0].adaptability, random),
                    affection_level: randomAttribute(cat.breeds[0].affection_level, random),
                    energy_level: randomAttribute(cat.breeds[0].energy_level, random),
                    social_needs: randomAttribute(cat.breeds[0].social_needs, random),
                    health_issues: randomAttribute(cat.breeds[0].health_issues, random),
                    vocalisation: randomAttribute(cat.breeds[0].vocalisation, random)
                }
            }
        })
    });
}
