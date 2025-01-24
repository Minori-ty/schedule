import express, { Request } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
const app = express()

app.use(cors())
app.use(express.json())

// 添加动漫
app.post('/anime', async (req, res) => {
    const {
        name,
        alias,
        description,
        cover,
        startUpdateTime,
        isSerializing,
        isCompleted,
        totalEpisodes,
        currentEpisode,
    } = req.body
    const anime = await prisma.anime.create({
        data: {
            name,
            alias,
            description,
            cover,
            startUpdateTime: new Date(startUpdateTime),
            isSerializing,
            isCompleted,
            totalEpisodes,
            currentEpisode,
        },
    })
    for (let i = 1; i <= totalEpisodes; i++) {
        const airDate = dayjs(startUpdateTime)
            .add(i - 1, 'week')
            .toDate()
        await prisma.episode.create({
            data: {
                animeId: anime.id,
                airDate: airDate,
                episodeNumber: i.toString(),
                title: `第${i}集`,
                duration: 24 * 60,
            },
        })
    }
    if (isSerializing) {
        await prisma.schedule.create({
            data: {
                animeId: anime.id,
            },
        })
    }
    res.json(anime)
})

// 搜索动漫
app.get('/anime', async (req, res) => {
    const { page = 1, pageSize = 10, name } = req.query
    console.log(name)

    const anime = await prisma.anime.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: name as string,
                    },
                },
                {
                    alias: {
                        array_contains: name,
                    },
                },
            ],
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
    })
    res.json(anime)
})

// 删除动漫
app.delete('/anime/:id', async (req, res) => {
    const { id } = req.params
    try {
        // 直接删除 Anime，级联删除会自动处理相关的 Episode 和 Schedule
        const anime = await prisma.anime.delete({
            where: { id: Number(id) },
        })
        res.json({
            message: '动漫删除成功',
            code: 200,
        })
    } catch (error) {
        console.error('Error deleting anime:', error)
        res.status(500).json({
            message: '无法删除动漫',
            code: 500,
        })
    }
})

// 获取动漫详情
app.get('/anime/:id', async (req, res) => {
    const { id } = req.params
    const anime = await prisma.anime.findUnique({
        where: { id: Number(id), episodes: { some: {} } },
        include: {
            episodes: true,
        },
    })
    res.json(anime)
})

// 更新动漫信息
app.put('/anime-info/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body
    const anime = await prisma.anime.update({
        where: { id: Number(id) },
        data,
    })
    res.json(anime)
})

interface IEpisode {
    id?: number
    title?: string
    duration?: number
    videoUrl?: string
    synopsis?: string
    notes?: string
}
// 更新动漫集数信息
app.put('/episode/:animeId', async (req: Request<{ animeId: string }, {}, IEpisode>, res) => {
    const { animeId } = req.params
    const data = req.body
    const episode = await prisma.episode.update({
        where: { animeId: Number(animeId), id: Number(data.id) },
        data,
    })

    res.json(episode)
})

// 添加停更集数
app.post('/episode-postponed/:animeId', async (req, res) => {
    const { animeId } = req.params
    const { id } = req.body
    const episode = await prisma.episode.findUnique({
        where: {
            animeId: Number(animeId),
            id: Number(id),
        },
    })
    if (!episode) {
        res.status(404).json({ error: '找不到该集数' })
        return
    }
    const newEpisode = await prisma.episode.create({
        data: {
            animeId: episode.animeId,
            airDate: episode.airDate,
            episodeNumber: '本周停更',
            isPostponed: true,
            title: '本周停更',
            notes: `本周停更，下一集将于${dayjs(episode.airDate).add(1, 'week').format('YYYY-MM-DD HH:mm')}播出。`,
        },
    })
    const episodes = await prisma.episode.findMany({
        where: {
            animeId: Number(animeId),
            airDate: {
                gte: episode.airDate,
            },
            id: {
                not: newEpisode.id,
            },
        },
    })
    for (const episode of episodes) {
        await prisma.episode.update({
            where: { id: episode.id },
            data: { airDate: dayjs(episode.airDate).add(1, 'week').toDate() },
        })
    }
    res.json(newEpisode)
})

// 获取最近13天的动漫更新时间
app.get('/schedule', async (req, res) => {
    const today = dayjs()
    const startDate = today.subtract(6, 'day').toDate()
    const endDate = today.add(6, 'day').toDate()

    try {
        const episodes = await prisma.episode.findMany({
            where: {
                airDate: {
                    gte: startDate,
                    lte: endDate,
                },
                anime: {
                    schedules: {
                        some: {}, // 确保有 schedule 关联
                    },
                },
            },
            include: {
                anime: true, // 不包含 anime 信息
            },
            orderBy: {
                airDate: 'asc',
            },
        })

        const data = episodes.map((episode) => {
            return {
                id: episode.anime.id,
                name: episode.anime.name,
                episodeNumber: episode.episodeNumber,
                updateTime: episode.airDate,
                synopsis: episode.synopsis,
                notes: episode.notes,
                cover: episode.anime.cover,
                url: episode.videoUrl,
            }
        })

        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: '无法获取剧集信息' })
    }
})

// 获取这一周的动漫更新时间
app.get('/schedule-week', async (req, res) => {
    const today = dayjs()
    const startDate = today.startOf('week').toDate()
    const endDate = today.endOf('week').toDate()

    try {
        const episodes = await prisma.episode.findMany({
            where: {
                airDate: {
                    gte: startDate,
                    lte: endDate,
                },
                anime: {
                    schedules: {
                        some: {}, // 确保有 schedule 关联
                    },
                },
            },
            include: {
                anime: true,
            },
            orderBy: {
                airDate: 'asc',
            },
        })

        const data = episodes.map((episode) => {
            return {
                id: episode.anime.id,
                name: episode.anime.name,
                episodeNumber: episode.episodeNumber,
                updateTime: episode.airDate,
                synopsis: episode.synopsis,
                notes: episode.notes,
                cover: episode.anime.cover,
                url: episode.videoUrl,
            }
        })

        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: '无法获取剧集信息' })
    }
})

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`run http://localhost:${port}`)
})
