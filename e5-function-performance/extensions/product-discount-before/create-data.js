const sample = {
    "merchandise": {
        "__typename": "ProductVariant",
        "id": "gid://shopify/ProductVariant/0",
        "sku": "",
        "title": null,
        "weight": 5,
        "requiresShipping": true,
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
            ],
            "id": "gid://shopify/Product/7329301659670",
            "title": "Creek Stone"
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
            "hasTag": i%17 == 0
        },
        {
            "tag": "silver",
            "hasTag": i%27 == 0
        },
        {
            "tag": "gold",
            "hasTag": i%51 == 0
        }
    ]
    input.cart.lines.push(line);
}

console.log(JSON.stringify(input, null, 2));