import express, { Request } from 'express'
import cors from 'cors'
import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { winstonMiddleware } from './utils/logger'

const prisma = new PrismaClient()

const app = express()

app.use(cors())
app.use(express.json())
app.use(winstonMiddleware)
// 获取动漫列表
app.get('/anime', async (req, res) => {
    const { page, pageSize, name } = req.query
    let whereCondition: Prisma.AnimeWhereInput = {}

    if (typeof name === 'string') {
        whereCondition = {
            OR: [{ name: { contains: name } }, { alias: { array_contains: name } }],
        }
    }
    try {
        const { anime, total } = await prisma.$transaction(
            async (tx) => {
                const total = await tx.anime.count({
                    where: whereCondition,
                })
                const anime = await tx.anime.findMany({
                    where: whereCondition,
                    omit: {
                        createdAt: true,
                        updatedAt: true,
                    },
                    skip: page ? (Number(page) - 1) * Number(pageSize) : undefined,
                    take: pageSize ? Number(pageSize) : undefined,
                })
                return { total, anime }
            },
            { isolationLevel: 'Serializable' }
        )
        res.json({
            code: 200,
            message: '获取动漫列表成功',
            data: {
                list: anime,
                total,
            },
        })
    } catch {
        res.status(500).json({
            code: 500,
            message: '获取动漫列表失败',
            data: null,
        })
    }
})

interface IAnime {
    name: string
    alias: string
    description: string
    cover: string
    startUpdateTime: number
    isSerializing: boolean
    isCompleted: boolean
    totalEpisodes: number
    currentEpisode: number
}
// 添加动漫
app.post('/anime', async (req: Request<{}, {}, IAnime>, res) => {
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

    const { anime } = await prisma.$transaction(
        async (tx) => {
            const anime = await tx.anime.create({
                data: {
                    name,
                    alias,
                    description,
                    cover,
                    startUpdateTime,
                    isSerializing,
                    isCompleted,
                    totalEpisodes,
                    currentEpisode,
                },
            })

            for (let i = 1; i <= totalEpisodes; i++) {
                const airDate = dayjs
                    .unix(startUpdateTime)
                    .add(i - 1, 'week')
                    .unix()

                await tx.episode.create({
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
                await tx.schedule.create({
                    data: {
                        animeId: anime.id,
                    },
                })
            }
            return { anime }
        },
        { isolationLevel: 'Serializable' }
    )

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
            episodes: {
                orderBy: {
                    airDate: 'asc',
                },
            },
        },
    })
    if (!anime) {
        res.status(404).json({ message: '动漫不存在' })
        return
    }

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
app.post('/episode/postponed/:animeId', async (req, res) => {
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
            notes: `本周停更，下一集将于${dayjs.unix(episode.airDate).add(1, 'week').format('YYYY-MM-DD HH:mm')}播出。`,
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
            data: { airDate: dayjs.unix(episode.airDate).add(1, 'week').unix() },
        })
    }
    res.json(newEpisode)
})

// 删除停更记录
app.delete('/episode/postponed/:animeId', async (req, res) => {
    const { animeId } = req.params
    const { id } = req.body
    const episode = await prisma.episode.findUnique({
        where: {
            animeId: Number(animeId),
            id: Number(id),
            isPostponed: true,
        },
    })
    if (!episode) {
        res.status(404).json({ error: '找不到该停更记录' })
        return
    }
    try {
        await prisma.$transaction(async (tx) => {
            await tx.episode.delete({
                where: {
                    id: episode.id,
                },
            })
            const episodes = await tx.episode.findMany({
                where: {
                    animeId: Number(animeId),
                    airDate: {
                        gte: episode.airDate,
                    },
                },
            })
            for (const episode of episodes) {
                await tx.episode.update({
                    where: { id: episode.id },
                    data: { airDate: dayjs.unix(episode.airDate).subtract(1, 'week').unix() },
                })
            }
        })
        res.json({
            message: '删除停更记录成功',
            code: 200,
        })
    } catch {
        res.status(500).json({
            message: '删除停更记录失败',
            code: 500,
        })
    }
})

// 获取最近13天的动漫更新时间
app.get('/schedule', async (req, res) => {
    const today = dayjs()
    const startDate = today.subtract(6, 'day').unix()
    const endDate = today.add(6, 'day').unix()

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
                    gte: startDate.getTime(),
                    lte: endDate.getTime(),
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
