const sample = {
    "merchandise": {
        "__typename": "ProductVariant",
        "id": "gid://shopify/ProductVariant/0",
        "product": {
            "hasTags": [
                {
                    "tag": "bronze",
                    "hasTag": false
                },
                {
                    "tag": "silver",
                    "hasTag": false
                },
                {
                    "tag": "gold",
                    "hasTag": false
                }
            ]
        }
    }
}

let input = {
    "cart": {
        "lines": [
        ]
    },
    "discountNode": {
        "metafield": {
            "value": "[{\"tag\":\"bronze\",\"percentOff\":\"5\"},{\"tag\":\"silver\",\"percentOff\":\"10\"},{\"tag\":\"gold\",\"percentOff\":\"20\"}]"
        }
    }
}

for (let i = 0; i < 100; i++) {
    const line = JSON.parse(JSON.stringify(sample));
    line.merchandise.id = `gid://shopify/ProductVariant/000${i+1}`
    line.merchandise.product.hasTags = [
        {
            "tag": "bronze",
            "hasTag": i%5 == 0
        },
        {
            "tag": "silver",
            "hasTag": i%7 == 0
        },
        {
            "tag": "gold",
            "hasTag": i%17 == 0
        }
    ]
    input.cart.lines.push(line);
}

console.log(JSON.stringify(input, null, 2));