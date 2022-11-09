import StaticMaps from "staticmaps"
import fs from "fs"

export default async function handler(req, res) {
    const { country, userAddress, begin, end } = req.query
    const API_URL =
        "https://api.v2.emissions-api.org/api/v2/carbonmonoxide/geo.json" +
        `?country=${country}&begin=${begin}&end=${end}`
    console.log("API_URL", API_URL)
    const imageBuffer = await generateImage(API_URL)
    res.setHeader("Content-Type", "image/jpg")
    res.send(imageBuffer)
}

const generateImage = async (API_URL) => {
    const options = {
        width: 1200,
        height: 800,
    }
    const map = new StaticMaps(options)
    const apiRes = await fetch(API_URL)
    console.log("__________")
    const apiJson = await apiRes.json()
    const ftrs = apiJson.features
    // let max = 0
    let minLon = 180,
        minLat = 180,
        maxLon = -180,
        maxLat = -180
    let array = []
    for (let i = 0; i < ftrs.length; i++) {
        const point = ftrs[i]
        array.push(point.properties.value)
        const lon = point.geometry.coordinates[0]
        const lat = point.geometry.coordinates[1]
        if (lon < minLon) {
            minLon = lon
        }
        if (lat < minLat) {
            minLat = lat
        }
        if (lon > maxLon) {
            maxLon = lon
        }
        if (lat > maxLat) {
            maxLat = lat
        }
        // if (point.properties.value > max) {
        //     max = point.properties.value
        // }
    }
    array.sort()
    const colArr = [
        "#ffffcc",
        "#ffeda0",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#fc4e2a",
        "#e31a1c",
        "#bd0026",
        "#800026",
    ]
    const percentColors = getPercentColors(array, colArr)
    for (let i = 0; i < ftrs.length; i++) {
        const point = ftrs[i]
        const circle = {
            coord: point.geometry.coordinates,
            radius: 30000,
            fill: generateColor(point.properties.value, percentColors),
            width: 0,
        }
        map.addCircle(circle)
    }
    // console.log("max", max)
    const center = [(minLon + maxLon) / 2, (minLat + maxLat) / 2]
    console.log("center", center)
    await map.render(center, 3)

    const buf = await map.image.buffer("image/jpeg", { quality: 100 })
    // fs.writeFile(`map.jpg`, buf, () => console.log("writing done"))
    // console.log(buf)

    return buf

    // await map.image.save("try.png")
}

// const percentColors = [
//     { pct: 0.02, color: { r: 0xff, g: 0xff, b: 0xb2 } },
//     { pct: 0.04, color: { r: 0xfe, g: 0xcc, b: 0x5c } },
//     { pct: 0.06, color: { r: 0xfd, g: 0x8d, b: 0x3c } },
//     { pct: 0.08, color: { r: 0xf0, g: 0x3b, b: 0x20 } },
//     { pct: 1.0, color: { r: 0xbd, g: 0x00, b: 0x26 } },
// ]

const getPercentColors = (arr, colArr) => {
    const arrLen = arr.length
    const colArrLen = colArr.length
    let start = 0
    const val = arrLen / colArrLen
    const res = []
    // console.log("colArrLen", colArrLen)
    // console.log("arrLen", arrLen)
    // console.log("colArr", colArr)
    // const rStart = parseInt("0x" + colArr[0].substring(1, 3))
    // const gStart = parseInt("0x" + colArr[0].substring(3, 5))
    // const bStart = parseInt("0x" + colArr[0].substring(5, 7))
    // res.push({ pct: 0.0, color: { r: rStart, g: gStart, b: bStart } })
    for (let i = 1; i <= colArrLen; i++) {
        // console.log("colArr[i-1]", colArr[i - 1])
        const r = parseInt("0x" + colArr[i - 1].substring(1, 3))
        const g = parseInt("0x" + colArr[i - 1].substring(3, 5))
        const b = parseInt("0x" + colArr[i - 1].substring(5, 7))
        // console.log("val", val)
        // console.log("Math.ceil", Math.ceil(val * i))
        // console.log("pct", arr[Math.ceil(val * i)])
        const index = Math.ceil(start)
        start += val
        res.push({ pct: arr[index >= arrLen ? arrLen - 1 : index], color: { r: r, g: g, b: b } })
        // if (point.properties.value > max) {
        //     max = point.properties.value
        // }
    }
    const rLast = parseInt("0x" + colArr[colArrLen - 1].substring(1, 3))
    const gLast = parseInt("0x" + colArr[colArrLen - 1].substring(3, 5))
    const bLast = parseInt("0x" + colArr[colArrLen - 1].substring(5, 7))
    res.push({ pct: 1.0, color: { r: rLast, g: gLast, b: bLast } })
    console.log("res", res)
    return res
}
var getColorForPercentage = function (pct, percentColors) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break
        }
    }
    var lower = percentColors[i - 1]
    var upper = percentColors[i]
    var range = upper.pct - lower.pct
    var rangePct = (pct - lower.pct) / range
    var pctLower = 1 - rangePct
    var pctUpper = rangePct
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
    }
    return color
    // return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}

function generateColor(x, percentColors) {
    const clr = getColorForPercentage(x, percentColors)
    return rgbToHex(clr.r, clr.g, clr.b)
    // return rgbToHex(255 - 255 * x, 255 * x, 0)
}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}
