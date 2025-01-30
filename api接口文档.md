# API 接口文档

## 获取动漫列表

-   **请求地址**: `GET /anime`
-   **请求参数**:
    -   `page` (可选): 当前页码，类型: `number`
    -   `pageSize` (可选): 每页数量，类型: `number`
    -   `name` (可选): 动漫名称或别名，类型: `string`
-   **返回数据结构**:
    ```json
    {
        "code": 200,
        "message": "获取动漫列表成功",
        "data": {
            "list": [
                {
                    "id": 1,
                    "name": "动漫名称",
                    "alias": ["别名1", "别名2"],
                    "cover": "封面链接",
                    "totalEpisodes": 12,
                    "currentEpisode": 5
                }
            ],
            "total": 100
        }
    }
    ```

## 添加动漫

-   **请求地址**: `POST /anime`
-   **请求参数**:
    -   `name`: 动漫名称，类型: `string`
    -   `alias`: 动漫别名，类型: `string[]`
    -   `description`: 动漫描述，类型: `string`
    -   `cover`: 动漫封面链接，类型: `string`
    -   `startUpdateTime`: 开始更新时间，类型: `number`
    -   `isSerializing`: 是否连载中，类型: `boolean`
    -   `isCompleted`: 是否完结，类型: `boolean`
    -   `totalEpisodes`: 总集数，类型: `number`
    -   `currentEpisode`: 当前集数，类型: `number`
-   **返回数据结构**:
    ```json
    {
        "id": 1,
        "name": "动漫名称",
        "alias": ["别名1", "别名2"],
        "cover": "封面链接",
        "totalEpisodes": 12,
        "currentEpisode": 5
    }
    ```

## 删除动漫

-   **请求地址**: `DELETE /anime/:id`
-   **请求参数**:
    -   `id`: 动漫 ID，类型: `number`
-   **返回数据结构**:
    ```json
    {
        "message": "动漫删除成功",
        "code": 200
    }
    ```

## 获取动漫详情

-   **请求地址**: `GET /anime/:id`
-   **请求参数**:
    -   `id`: 动漫 ID，类型: `number`
-   **返回数据结构**:
    ```json
    {
        "id": 1,
        "name": "动漫名称",
        "episodes": [
            {
                "id": 1,
                "title": "第1集",
                "airDate": 1620000000
            }
        ]
    }
    ```

## 更新动漫信息

-   **请求地址**: `PUT /anime-info/:id`
-   **请求参数**:
    -   `id`: 动漫 ID，类型: `number`
    -   `data`: 更新的数据，类型: `object`
-   **返回数据结构**:
    ```json
    {
        "id": 1,
        "name": "更新后的动漫名称"
    }
    ```

## 更新动漫集数信息

-   **请求地址**: `PUT /episode/:animeId`
-   **请求参数**:
    -   `animeId`: 动漫 ID，类型: `number`
    -   `data`: 更新的数据，类型: `object`
-   **返回数据结构**:
    ```json
    {
        "id": 1,
        "title": "更新后的集数标题"
    }
    ```

## 添加停更集数

-   **请求地址**: `POST /episode/postponed/:animeId`
-   **请求参数**:
    -   `animeId`: 动漫 ID，类型: `number`
    -   `id`: 集数 ID，类型: `number`
-   **返回数据结构**:
    ```json
    {
        "id": 2,
        "title": "本周停更"
    }
    ```

## 删除停更记录

-   **请求地址**: `DELETE /episode/postponed/:animeId`
-   **请求参数**:
    -   `animeId`: 动漫 ID，类型: `number`
    -   `id`: 集数 ID，类型: `number`
-   **返回数据结构**:
    ```json
    {
        "message": "删除停更记录成功",
        "code": 200
    }
    ```

## 获取最近 13 天的动漫更新时间

-   **请求地址**: `GET /schedule`
-   **请求参数**: 无
-   **返回数据结构**:
    ```json
    [
        {
            "id": 1,
            "name": "动漫名称",
            "episodeNumber": "第1集",
            "updateTime": 1620000000,
            "synopsis": "剧情简介",
            "notes": "备注",
            "cover": "封面链接",
            "url": "视频链接"
        }
    ]
    ```

## 获取这一周的动漫更新时间

-   **请求地址**: `GET /schedule-week`
-   **请求参数**: 无
-   **返回数据结构**:
    ```json
    [
        {
            "id": 1,
            "name": "动漫名称",
            "episodeNumber": "第1集",
            "updateTime": 1620000000,
            "synopsis": "剧情简介",
            "notes": "备注",
            "cover": "封面链接",
            "url": "视频链接"
        }
    ]
    ```
