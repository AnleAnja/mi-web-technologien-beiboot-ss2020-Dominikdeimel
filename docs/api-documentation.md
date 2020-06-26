# API Documentation

As part of the 5th issue, the BeiBoot project was extended with an API endpoint. This endpoint is complementary to the frontend ui and allows the request of image collections.
An image collection consists of already uploaded images. The number and the sorting of the images within the collection can be parameterized. 

API endpoint: **GET** `http://localhost:3000/collection`

### Query Parameters

| **Parameter**           | **Type**   | **Description**                                                                                                                                                                                                                                                                                                                        | **Required**  |
|---------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| sortBy              | String | Specifies the order in which the images are sorted within the collection. <br></br>Valid values are: <br></br> `alphabetical` Images are sorted alphabeticaly by the image name <br></br> `birthTime` Images are sorted by the time of upload <br></br> `color` = Images are sorted by the hue value of their most vibrant color <br></br> `random` = Images are sorted random | Required |
| preferredImageCount | Int    | Specifies the number of images for the collection. Only positiv _Int_ values are allowed. If no _preferredImageCount_ is specified, all pictures are taken by default.                                                                                                                                                                                                      | Optional     |

### Response 

| Key             | Type                   | Description                                                                                                                                          |
|-----------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sortBy`          | String                 | Type of sorting                                                                                                                                      |
| `imageCount`      | Int                    | Number of images in the collection                                                                                                                   |
| `imageCollection` | Array of image objects | An image object contains all information for one image of the collection. Most importantly the image name, image url and primary colors. If the images are sorted by `color` a `primaryColorDetails` object is also added, which contains information about the most vibrant color of the image.   |

An example response can be found [here]().

### Example Response

```json
{
    "sortBy": "color",
    "imageCount": 3,
    "imageCollection": [
        {
            "id": "q03K3gx6Ey",
            "name": "iPt41beW5rs.jpg",
            "imagePath": "http//:localhost:3000/userData/q03K3gx6Ey/original",
            "imageStats": {
                "birthTime": "2020-06-25T21:13:15.529Z",
                "birthTimeMs": 1593119595528.8777,
                "size": 4636247
            },
            "primaryColors": [
                {
                    "name": "LightMuted",
                    "color": "#d3bebb",
                    "population": 7176
                },
                {
                    "name": "Muted",
                    "color": "#65718a",
                    "population": 6902
                },
                {
                    "name": "DarkMuted",
                    "color": "#2b384f",
                    "population": 6055
                },
                {
                    "name": "Vibrant",
                    "color": "#b07236",
                    "population": 45
                },
                {
                    "name": "DarkVibrant",
                    "color": "#183872",
                    "population": 5
                },
                {
                    "name": "LightVibrant",
                    "color": "#dfbc99",
                    "population": 0
                }
            ],
            "primaryColorDetails": {
                "hex": "#d3bebb",
                "chroma": 0.09411764705882353,
                "hue": 7.500000000000045,
                "sat": 0.1137440758293839,
                "val": 0.8274509803921568,
                "luma": 0.7685098039215685,
                "red": 211,
                "green": 190,
                "blue": 187
            }
        },
        {
            "id": "J00mVEqOkd",
            "name": "5nMrFGU9dek.jpg",
            "imagePath": "http//:localhost:3000/userData/J00mVEqOkd/original",
            "imageStats": {
                "birthTime": "2020-06-25T21:12:23.620Z",
                "birthTimeMs": 1593119543620.2976,
                "size": 2377959
            },
            "primaryColors": [
                {
                    "name": "DarkVibrant",
                    "color": "#731704",
                    "population": 271
                },
                {
                    "name": "Vibrant",
                    "color": "#fba215",
                    "population": 158
                },
                {
                    "name": "Muted",
                    "color": "#8d857b",
                    "population": 51
                },
                {
                    "name": "LightVibrant",
                    "color": "#eebb7a",
                    "population": 30
                },
                {
                    "name": "LightMuted",
                    "color": "#d3c2ba",
                    "population": 29
                },
                {
                    "name": "DarkMuted",
                    "color": "#473328",
                    "population": 22
                }
            ],
            "primaryColorDetails": {
                "hex": "#731704",
                "chroma": 0.43529411764705883,
                "hue": 10.27027027027027,
                "sat": 0.9652173913043478,
                "val": 0.45098039215686275,
                "luma": 0.19023529411764706,
                "red": 115,
                "green": 23,
                "blue": 4
            }
        },
        {
            "id": "hrXyTWSYZr",
            "name": "fckcmcbPF14.jpg",
            "imagePath": "http//:localhost:3000/userData/hrXyTWSYZr/original",
            "imageStats": {
                "birthTime": "2020-06-25T21:12:56.282Z",
                "birthTimeMs": 1593119576282.17,
                "size": 6435062
            },
            "primaryColors": [
                {
                    "name": "Muted",
                    "color": "#94634f",
                    "population": 6627
                },
                {
                    "name": "DarkMuted",
                    "color": "#5c3838",
                    "population": 3167
                },
                {
                    "name": "Vibrant",
                    "color": "#25759c",
                    "population": 563
                },
                {
                    "name": "LightMuted",
                    "color": "#aabcc6",
                    "population": 275
                },
                {
                    "name": "DarkVibrant",
                    "color": "#042064",
                    "population": 2
                },
                {
                    "name": "LightVibrant",
                    "color": "#94accc",
                    "population": 1
                }
            ],
            "primaryColorDetails": {
                "hex": "#94634f",
                "chroma": 0.2705882352941177,
                "hue": 17.391304347826086,
                "sat": 0.46621621621621623,
                "val": 0.5803921568627451,
                "luma": 0.4372549019607843,
                "red": 148,
                "green": 99,
                "blue": 79
            }
        }
    ]
}
```

