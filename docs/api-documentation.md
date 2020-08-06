# API Documentation

As part of the 5th issue, the BeiBoot project was extended with an API endpoint. This endpoint is complementary to the frontend ui and allows the request of image collections.
An image collection consists of already uploaded images. The number and the sorting of the images within the collection can be parameterized. 

API endpoint: **GET** `http://localhost:3000/api/images/collection`

## Query Parameters

| **Parameter**           | **Type**   | **Description**                                                                                                                                                                                                                                                                                                                        | **Required**  |
|---------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| _sortBy_              | String | Specifies how the images are sorted within the collection. <br></br>Valid values are: <br></br> `alphabetical` : Images are sorted alphabeticaly by the image name <br></br> `birthTime` : Images are sorted by the time of upload <br></br> `color` : Images are sorted by the hue value of their most vibrant color <br></br> `random` : Images are sorted random <br></br> If no _sortBy_ is specified, the images are sorted `alphabetical`. | Optional |
| _sortOrder_ | String | Specifies whether the images in the collection are sorted in ascending or descending order. <br></br> Valid values are: `ascending` and `descending`. <br></br>  If no _sortOrder_ is specified, an `ascending` order is taken by default. | Optional |
| _preferredImageCount_ | Int    | Specifies the number of images for the collection. Only positiv _Int_ values are allowed. If no _preferredImageCount_ is specified, all images are taken by default.                                                                                                                                                                                                       | Optional    | 
| _from_ | Int | Specifies the starting element in the collection. Only positiv _Int_ values are allowed. if no _from_ is specified, `0` is taken by default. | Optional |

### Response 

| Key             | Type                   | Description                                                                                                                              |
|-----------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `sortBy`          | String                 | Type of sorting                                                                                                                          |
| `sortOrder`       | String                 | Specifies whether the images in the collection are sorted in ascending or descending order                                              |
| `imageCount`      | Int                    | Number of images in the collection                                                                                                       |
| `from`          | Int                    | Specifies the starting element in the collection.                                                                                        |
| `imageCollection` | Array of image objects | An image object contains all information for one image of the collection. Most importantly the image name, image url and primary colors. |   


## Response

### Example Request 

`http://localhost:3000/api/images/collection?sortBy=color&imageCount=3&sortOrder=ascending`

### Example Response

```javascript
{
    "sortBy": "color",
    "sortOrder": "ascending",
    "imageCount": 3,
    "from": "3",
    "imageCollection": [
        {
            "id": "ogxXoMd6xh",
            "name": "CD0xj1FzCwY.jpg",
            "imagePath": "http//:localhost:3000/userData/ogxXoMd6xh/original",
            "imageDimensions": {
                "height": 1500,
                "width": 1000,
                "type": "png",
                "format": "portrait"
            },
            "imageStats": {
                "birthTime": "2020-08-06T15:39:05.800Z",
                "birthTimeMs": 1596728345799.7073,
                "size": 3671437
            },
            "primaryColors": [
                {
                    "name": "DarkVibrant",
                    "color": "#492d20",
                    "population": 4478
                },
                {
                    "name": "LightMuted",
                    "color": "#a9c8d4",
                    "population": 2887
                },
                {
                    "name": "LightVibrant",
                    "color": "#9bc4dc",
                    "population": 9
                },
                {
                    "name": "Muted",
                    "color": "#54849c",
                    "population": 9
                },
                {
                    "name": "DarkMuted",
                    "color": "#2d4454",
                    "population": 6
                },
                {
                    "name": "Vibrant",
                    "color": "#744c34",
                    "population": 1
                }
            ],
            "primaryColorDetails": {
                "hex": "#492d20",
                "chroma": 0.16078431372549018,
                "hue": 19.024390243902445,
                "sat": 0.5616438356164384,
                "val": 0.28627450980392155,
                "luma": 0.20380392156862745,
                "red": 73,
                "green": 45,
                "blue": 32
            }
        },
        {
            "id": "nlIZpwuDmy",
            "name": "9VZr0RO_CwQ.jpg",
            "imagePath": "http//:localhost:3000/userData/nlIZpwuDmy/original",
            "imageDimensions": {
                "height": 1000,
                "width": 1500,
                "type": "png",
                "format": "landscape"
            },
            "imageStats": {
                "birthTime": "2020-08-06T15:38:46.009Z",
                "birthTimeMs": 1596728326008.8518,
                "size": 2662111
            },
            "primaryColors": [
                {
                    "name": "DarkMuted",
                    "color": "#5f4030",
                    "population": 4451
                },
                {
                    "name": "LightMuted",
                    "color": "#abc4cf",
                    "population": 2941
                },
                {
                    "name": "Vibrant",
                    "color": "#1aaebd",
                    "population": 737
                },
                {
                    "name": "LightVibrant",
                    "color": "#8cbcd4",
                    "population": 1
                },
                {
                    "name": "DarkVibrant",
                    "color": "#6c542c",
                    "population": 1
                },
                {
                    "name": "Muted",
                    "color": "#ac6454",
                    "population": 1
                }
            ],
            "primaryColorDetails": {
                "hex": "#5f4030",
                "chroma": 0.1843137254901961,
                "hue": 20.425531914893618,
                "sat": 0.4947368421052632,
                "val": 0.37254901960784315,
                "luma": 0.2805490196078431,
                "red": 95,
                "green": 64,
                "blue": 48
            }
        },
        {
            "id": "dmr09hSDlP",
            "name": "YOjyt8aenzo.jpg",
            "imagePath": "http//:localhost:3000/userData/dmr09hSDlP/original",
            "imageDimensions": {
                "height": 1500,
                "width": 1000,
                "type": "png",
                "format": "portrait"
            },
            "imageStats": {
                "birthTime": "2020-08-06T15:40:31.282Z",
                "birthTimeMs": 1596728431281.8394,
                "size": 2860607
            },
            "primaryColors": [
                {
                    "name": "DarkMuted",
                    "color": "#3e3225",
                    "population": 7252
                },
                {
                    "name": "LightMuted",
                    "color": "#ccbca4",
                    "population": 9
                },
                {
                    "name": "DarkVibrant",
                    "color": "#863110",
                    "population": 6
                },
                {
                    "name": "Vibrant",
                    "color": "#bc7c54",
                    "population": 2
                },
                {
                    "name": "Muted",
                    "color": "#b48454",
                    "population": 1
                },
                {
                    "name": "LightVibrant",
                    "color": "#d9b69f",
                    "population": 0
                }
            ],
            "primaryColorDetails": {
                "hex": "#3e3225",
                "chroma": 0.0980392156862745,
                "hue": 31.199999999999996,
                "sat": 0.4032258064516128,
                "val": 0.24313725490196078,
                "luma": 0.20458823529411763,
                "red": 62,
                "green": 50,
                "blue": 37
            }
        }
    ]
}
```

