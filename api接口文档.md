# API 接口文档

## 获取动漫列表

-   **URL:** `/anime`
-   **方法:** GET
-   **请求参数:**
    -   类型:
        ```typescript
        interface GetAnimeListRequest {
            page?: number // 页码，默认值为 1
            pageSize?: number // 每页显示的条数，默认值为 10
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface GetAnimeListResponse {
            data: {
                id: number
                name: string
                alias: string[]
                description?: string
                cover?: string
                startUpdateTime: number
                isSerializing: boolean
                isCompleted: boolean
                totalEpisodes: number
                currentEpisode: number
            }[]
        }
        ```
    -   示例:
        ```json
        {
            "data": [
                {
                    "id": 1,
                    "name": "Example Anime",
                    "alias": ["别名1", "别名2"],
                    "description": "这是一个动漫描述",
                    "cover": "http://example.com/cover.jpg",
                    "startUpdateTime": 1633036800,
                    "isSerializing": true,
                    "isCompleted": false,
                    "totalEpisodes": 12,
                    "currentEpisode": 3
                }
            ]
        }
        ```

## 添加动漫

-   **URL:** `/anime`
-   **方法:** POST
-   **请求参数:**
    -   类型:
        ```typescript
        interface AddAnimeRequest {
            name: string
            alias: string[]
            description?: string
            cover?: string
            startUpdateTime: number
            isSerializing: boolean
            isCompleted: boolean
            totalEpisodes: number
            currentEpisode: number
        }
        ```
    -   示例:
        ```json
        {
            "name": "New Anime",
            "alias": ["新别名"],
            "description": "新动漫描述",
            "cover": "http://example.com/new-cover.jpg",
            "startUpdateTime": 1633036800,
            "isSerializing": true,
            "isCompleted": false,
            "totalEpisodes": 24,
            "currentEpisode": 1
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface AddAnimeResponse {
            data: {
                id: number
                name: string
                alias: string[]
                description?: string
                cover?: string
                startUpdateTime: number
                isSerializing: boolean
                isCompleted: boolean
                totalEpisodes: number
                currentEpisode: number
            }
        }
        ```
    -   示例:
        ```json
        {
            "data": {
                "id": 2,
                "name": "New Anime",
                "alias": ["新别名"],
                "description": "新动漫描述",
                "cover": "http://example.com/new-cover.jpg",
                "startUpdateTime": 1633036800,
                "isSerializing": true,
                "isCompleted": false,
                "totalEpisodes": 24,
                "currentEpisode": 1
            }
        }
        ```

## 删除动漫

-   **URL:** `/anime/:id`
-   **方法:** DELETE
-   **请求参数:**
    -   类型:
        ```typescript
        interface DeleteAnimeRequest {
            id: number // 动漫的ID
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface DeleteAnimeResponse {
            message: string
            code: number
        }
        ```
    -   示例:
        ```json
        {
            "message": "动漫删除成功",
            "code": 200
        }
        ```

## 获取动漫详情

-   **URL:** `/anime/:id`
-   **方法:** GET
-   **请求参数:**
    -   类型:
        ```typescript
        interface GetAnimeDetailRequest {
            id: number // 动漫的ID
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface GetAnimeDetailResponse {
            data: {
                id: number
                name: string
                alias: string[]
                description?: string
                cover?: string
                startUpdateTime: number
                isSerializing: boolean
                isCompleted: boolean
                totalEpisodes: number
                currentEpisode: number
                episodes: {
                    id: number
                    airDate: number
                    episodeNumber: string
                    title: string
                    duration?: number
                    synopsis?: string
                    isPostponed?: boolean
                    notes?: string
                    videoUrl?: string
                }[]
            }
        }
        ```
    -   示例:
        ```json
        {
            "data": {
                "id": 1,
                "name": "Example Anime",
                "alias": ["别名1", "别名2"],
                "description": "这是一个动漫描述",
                "cover": "http://example.com/cover.jpg",
                "startUpdateTime": 1633036800,
                "isSerializing": true,
                "isCompleted": false,
                "totalEpisodes": 12,
                "currentEpisode": 3,
                "episodes": [
                    {
                        "id": 1,
                        "airDate": 1633036800,
                        "episodeNumber": "1",
                        "title": "第1集",
                        "duration": 1440
                    }
                ]
            }
        }
        ```

## 更新动漫信息

-   **URL:** `/anime-info/:id`
-   **方法:** PUT
-   **请求参数:**
    -   类型:
        ```typescript
        interface UpdateAnimeRequest {
            id: number // 动漫的ID
            data: Partial<{
                name: string
                alias: string[]
                description?: string
                cover?: string
                startUpdateTime: number
                isSerializing: boolean
                isCompleted: boolean
                totalEpisodes: number
                currentEpisode: number
            }>
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface UpdateAnimeResponse {
            data: {
                id: number
                name: string
                alias: string[]
                description?: string
                cover?: string
                startUpdateTime: number
                isSerializing: boolean
                isCompleted: boolean
                totalEpisodes: number
                currentEpisode: number
            }
        }
        ```
    -   示例:
        ```json
        {
            "data": {
                "id": 1,
                "name": "Updated Anime",
                "alias": ["更新别名"],
                "description": "更新后的动漫描述",
                "cover": "http://example.com/updated-cover.jpg",
                "startUpdateTime": 1633036800,
                "isSerializing": false,
                "isCompleted": true,
                "totalEpisodes": 12,
                "currentEpisode": 12
            }
        }
        ```

## 搜索动漫

-   **URL:** `/search-anime`
-   **方法:** GET
-   **请求参数:**
    -   类型:
        ```typescript
        interface SearchAnimeRequest {
            page?: number // 页码，默认值为 1
            pageSize?: number // 每页显示的条数，默认值为 10
            name: string // 动漫名称或别名
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface SearchAnimeResponse {
            data: {
                id: number
                name: string
                alias: string[]
                description?: string
                cover?: string
                startUpdateTime: number
                isSerializing: boolean
                isCompleted: boolean
                totalEpisodes: number
                currentEpisode: number
            }[]
        }
        ```
    -   示例:
        ```json
        {
            "data": [
                {
                    "id": 1,
                    "name": "Example Anime",
                    "alias": ["别名1", "别名2"],
                    "description": "这是一个动漫描述",
                    "cover": "http://example.com/cover.jpg",
                    "startUpdateTime": 1633036800,
                    "isSerializing": true,
                    "isCompleted": false,
                    "totalEpisodes": 12,
                    "currentEpisode": 3
                }
            ]
        }
        ```

## 更新动漫集数信息

-   **URL:** `/episode/:animeId`
-   **方法:** PUT
-   **请求参数:**
    -   类型:
        ```typescript
        interface UpdateEpisodeRequest {
            animeId: number // 动漫的ID
            data: Partial<{
                id: number
                airDate: number
                episodeNumber: string
                title: string
                duration?: number
                synopsis?: string
                isPostponed?: boolean
                notes?: string
                videoUrl?: string
            }>
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface UpdateEpisodeResponse {
            data: {
                id: number
                airDate: number
                episodeNumber: string
                title: string
                duration?: number
                synopsis?: string
                isPostponed?: boolean
                notes?: string
                videoUrl?: string
            }
        }
        ```
    -   示例:
        ```json
        {
            "data": {
                "id": 1,
                "airDate": 1633036800,
                "episodeNumber": "1",
                "title": "第1集",
                "duration": 1440,
                "synopsis": "剧情介绍",
                "notes": "备注信息",
                "videoUrl": "http://example.com/video.mp4"
            }
        }
        ```

## 添加停更集数

-   **URL:** `/episode-postponed/:animeId`
-   **方法:** POST
-   **请求参数:**
    -   类型:
        ```typescript
        interface AddPostponedEpisodeRequest {
            animeId: number // 动漫的ID
            id: number // 集数的ID
        }
        ```
-   **返回数据:**
    -   类型:
        ```typescript
        interface AddPostponedEpisodeResponse {
            data: {
                id: number
                airDate: number
                episodeNumber: string
                title: string
                notes: string
                isPostponed: boolean
            }
        }
        ```
    -   示例:
        ```json
        {
            "data": {
                "id": 2,
                "airDate": 1633036800,
                "episodeNumber": "本周停更",
                "title": "本周停更",
                "notes": "本周停更，下一集将于2023-10-10 12:00播出。",
                "isPostponed": true
            }
        }
        ```

## 获取最近 13 天的动漫更新时间

-   **URL:** `/schedule`
-   **方法:** GET
-   **返回数据:**
    -   类型:
        ```typescript
        interface GetScheduleResponse {
            data: {
                id: number
                name: string
                episodeNumber: string
                updateTime: number
                synopsis?: string
                notes?: string
                cover?: string
                url?: string
            }[]
        }
        ```
    -   示例:
        ```json
        {
            "data": [
                {
                    "id": 1,
                    "name": "Example Anime",
                    "episodeNumber": "1",
                    "updateTime": 1633036800,
                    "synopsis": "剧情介绍",
                    "notes": "备注信息",
                    "cover": "http://example.com/cover.jpg",
                    "url": "http://example.com/video.mp4"
                }
            ]
        }
        ```

## 获取这一周的动漫更新时间

-   **URL:** `/schedule-week`
-   **方法:** GET
-   **返回数据:**
    -   类型:
        ```typescript
        interface GetWeeklyScheduleResponse {
            data: {
                id: number
                name: string
                episodeNumber: string
                updateTime: number
                synopsis?: string
                notes?: string
                cover?: string
                url?: string
            }[]
        }
        ```
    -   示例:
        ```json
        {
            "data": [
                {
                    "id": 1,
                    "name": "Example Anime",
                    "episodeNumber": "1",
                    "updateTime": 1633036800,
                    "synopsis": "剧情介绍",
                    "notes": "备注信息",
                    "cover": "http://example.com/cover.jpg",
                    "url": "http://example.com/video.mp4"
                }
            ]
        }
        ```
