# API 接口文档

## 添加动漫

-   **请求地址**: `/anime`
-   **请求方法**: POST
-   **请求参数**:
    -   `name` (string): 动漫名称
    -   `alias` (array): 动漫别名
    -   `description` (string, optional): 动漫描述
    -   `cover` (string, optional): 动漫封面图片 URL
    -   `startUpdateTime` (string): 动漫开始更新时间，格式为 `YYYY-MM-DD HH:mm`
    -   `isSerializing` (boolean): 是否正在连载
    -   `isCompleted` (boolean): 是否已完结
    -   `totalEpisodes` (number): 总集数
    -   `currentEpisode` (number): 当前集数
-   **请求参数示例**:
    ```json
    {
        "name": "进击的巨人",
        "alias": ["Attack on Titan"],
        "description": "一部关于人类与巨人之间战争的动漫。",
        "cover": "http://example.com/cover.jpg",
        "startUpdateTime": "2023-01-01 15:00",
        "isSerializing": true,
        "isCompleted": false,
        "totalEpisodes": 25,
        "currentEpisode": 1
    }
    ```
-   **返回数据**:
    -   `id` (number): 动漫 ID
    -   其他与请求参数相同
-   **返回数据示例**:
    ```json
    {
        "id": 1,
        "name": "进击的巨人",
        "alias": ["Attack on Titan"],
        "description": "一部关于人类与巨人之间战争的动漫。",
        "cover": "http://example.com/cover.jpg",
        "startUpdateTime": "2023-01-01T00:00:00.000Z",
        "isSerializing": true,
        "isCompleted": false,
        "totalEpisodes": 25,
        "currentEpisode": 1
    }
    ```

## 搜索动漫

-   **请求地址**: `/anime`
-   **请求方法**: GET
-   **请求参数**:
    -   `page` (number, optional): 页码，默认值为 1
    -   `pageSize` (number, optional): 每页显示的条数，默认值为 10
    -   `name` (string, optional): 动漫名称或别名的搜索关键字
-   **请求参数示例**:
    ```
    /anime?page=1&pageSize=10&name=巨人
    ```
-   **返回数据**: 动漫列表，每个动漫包含以下字段：
    -   `id` (number): 动漫 ID
    -   `name` (string): 动漫名称
    -   `alias` (array): 动漫别名
    -   其他字段与添加动漫接口相同
-   **返回数据示例**:
    ```json
    [
        {
            "id": 1,
            "name": "进击的巨人",
            "alias": ["Attack on Titan"],
            "description": "一部关于人类与巨人之间战争的动漫。",
            "cover": "http://example.com/cover.jpg",
            "startUpdateTime": "2023-01-01T00:00:00.000Z",
            "isSerializing": true,
            "isCompleted": false,
            "totalEpisodes": 25,
            "currentEpisode": 1
        }
    ]
    ```

## 删除动漫

-   **请求地址**: `/anime/:id`
-   **请求方法**: DELETE
-   **请求参数**:
    -   `id` (number): 动漫 ID
-   **请求参数示例**:
    ```
    /anime/1
    ```
-   **返回数据**:
    -   `message` (string): 操作结果信息
    -   `code` (number): 状态码
-   **返回数据示例**:
    ```json
    {
        "message": "动漫删除成功",
        "code": 200
    }
    ```

## 获取动漫详情

-   **请求地址**: `/anime/:id`
-   **请求方法**: GET
-   **请求参数**:
    -   `id` (number): 动漫 ID
-   **请求参数示例**:
    ```
    /anime/1
    ```
-   **返回数据**: 动漫详情，包括集数信息
-   **返回数据示例**:
    ```json
    {
        "id": 1,
        "name": "进击的巨人",
        "alias": ["Attack on Titan"],
        "description": "一部关于人类与巨人之间战争的动漫。",
        "cover": "http://example.com/cover.jpg",
        "startUpdateTime": "2023-01-01T00:00:00.000Z",
        "isSerializing": true,
        "isCompleted": false,
        "totalEpisodes": 25,
        "currentEpisode": 1,
        "episodes": [
            {
                "id": 1,
                "airDate": "2023-01-01T00:00:00.000Z",
                "episodeNumber": "1",
                "title": "第1集",
                "duration": 1440,
                "synopsis": null,
                "notes": null,
                "videoUrl": null,
                "updatedAt": "2023-01-01T00:00:00.000Z",
                "animeId": 1
            }
        ]
    }
    ```

## 更新动漫信息

-   **请求地址**: `/anime-info/:id`
-   **请求方法**: PUT
-   **请求参数**:
    -   `id` (number): 动漫 ID
    -   其他字段与添加动漫接口相同
-   **请求参数示例**:
    ```json
    {
        "name": "进击的巨人",
        "description": "更新后的描述"
    }
    ```
-   **返回数据**: 更新后的动漫信息
-   **返回数据示例**:
    ```json
    {
        "id": 1,
        "name": "进击的巨人",
        "alias": ["Attack on Titan"],
        "description": "更新后的描述",
        "cover": "http://example.com/cover.jpg",
        "startUpdateTime": "2023-01-01T00:00:00.000Z",
        "isSerializing": true,
        "isCompleted": false,
        "totalEpisodes": 25,
        "currentEpisode": 1
    }
    ```

## 更新动漫集数信息

-   **请求地址**: `/episode/:animeId`
-   **请求方法**: PUT
-   **请求参数**:
    -   `animeId` (number): 动漫 ID
    -   `id` (number): 集数 ID
    -   `title` (string, optional): 集数标题
    -   `duration` (number, optional): 集数时长，单位为分钟
    -   `videoUrl` (string, optional): 视频链接
    -   `synopsis` (string, optional): 剧情介绍
    -   `notes` (string, optional): 特殊情况备注
-   **请求参数示例**:
    ```json
    {
        "id": 1,
        "title": "第1集更新",
        "duration": 1500
    }
    ```
-   **返回数据**: 更新后的集数信息
-   **返回数据示例**:
    ```json
    {
        "id": 1,
        "airDate": "2023-01-01T00:00:00.000Z",
        "episodeNumber": "1",
        "title": "第1集更新",
        "duration": 1500,
        "synopsis": null,
        "notes": null,
        "videoUrl": null,
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "animeId": 1
    }
    ```

## 添加停更集数

-   **请求地址**: `/episode-postponed/:animeId`
-   **请求方法**: POST
-   **请求参数**:
    -   `animeId` (number): 动漫 ID
    -   `id` (number): 集数 ID
-   **请求参数示例**:
    ```json
    {
        "id": 1
    }
    ```
-   **返回数据**: 新增的停更集数信息
-   **返回数据示例**:
    ```json
    {
        "id": 2,
        "airDate": "2023-01-01T00:00:00.000Z",
        "episodeNumber": "本周停更",
        "title": "本周停更",
        "duration": null,
        "synopsis": null,
        "notes": "本周停更，下一集将于2023-01-08 00:00播出。",
        "videoUrl": null,
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "animeId": 1
    }
    ```

## 获取最近 13 天的动漫更新时间

-   **请求地址**: `/schedule`
-   **请求方法**: GET
-   **请求参数**: 无
-   **返回数据**: 包含最近 13 天内更新的集数信息
-   **返回数据示例**:
    ```json
    [
        {
            "name": "进击的巨人",
            "episodeNumber": "1",
            "updateTime": "2023-01-01T00:00:00.000Z",
            "synopsis": null,
            "notes": null,
            "cover": "http://example.com/cover.jpg",
            "url": null
        }
    ]
    ```

## 获取这一周的动漫更新时间

-   **请求地址**: `/schedule-week`
-   **请求方法**: GET
-   **请求参数**: 无
-   **返回数据**: 包含本周内更新的集数信息
-   **返回数据示例**:
    ```json
    [
        {
            "name": "进击的巨人",
            "episodeNumber": "1",
            "updateTime": "2023-01-01T00:00:00.000Z",
            "synopsis": null,
            "notes": null,
            "cover": "http://example.com/cover.jpg",
            "url": null
        }
    ]
    ```
