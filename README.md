
Content of `webpack.config.js`
```

plugins: [
    new GenerateSW({
        manifestTransforms: [
            addTemplatedURLs({
                "Index": ["Pages/Index.cshtml*"]
            })
        ]
    })
]

```