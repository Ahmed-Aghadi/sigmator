import DeckGL from "@deck.gl/react"
import { LineLayer, PolygonLayer } from "@deck.gl/layers"
import { HexagonLayer } from "@deck.gl/aggregation-layers"
import { Map } from "react-map-gl"
import { MapView, FirstPersonView, Deck } from "@deck.gl/core"
import { useEffect, useRef, useState } from "react"
import FileSaver from "file-saver"

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -97,
    latitude: 40,
    zoom: 3,
    pitch: 60,
}

const begin = new Date().toISOString().split("T")[0]
const end = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0] // 1 month from now

// API URL
const API_URL =
    "https://api.v2.emissions-api.org/api/v2/carbonmonoxide/geo.json" +
    "?country=IN&begin=2022-09-07&end=2022-10-07"

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiYWhtZWRhZ2hhZGkiLCJhIjoiY2w5dmVlYzVlMHYxMzNvczk1M3A3ZG0wYSJ9.7zEDgRFhsfIQsw6a0Y0ybg"
//
export default function Main() {
    const [image, setImage] = useState()
    const layers = [
        new HexagonLayer({
            id: "hexagon-layer",
            extruded: true,
            radius: 30000,
            data: API_URL,
            dataTransform: (d) => {
                console.log("done123")
                // convToImg()
                // handleDownload()
                return d.features
            },
            elevationScale: 300,
            getColorValue: (points) =>
                points.reduce((sum, point) => sum + point.properties.value, 0) / points.length,
            getElevationValue: (points) =>
                points.reduce((sum, point) => sum + point.properties.value, 0) / points.length,
            getPosition: (d) => d.geometry.coordinates,
        }),
    ]

    // useEffect(() => {
    //     ;(async () =>
    //         console.log(await await (await fetch("http://localhost:3000/api/hello")).json()))()
    //     // ;(async () => console.log(await await (await fetch(API_URL)).json()))()
    // }, [])

    // useEffect(() => {
    //     const deckCust = new Deck({
    //         container: "cnt",
    //         mapboxApiAccessToken: MAPBOX_ACCESS_TOKEN,
    //         mapStyle: "mapbox://styles/mapbox/dark-v9",
    //         initialViewState: INITIAL_VIEW_STATE,
    //         controller: true,
    //         // onLoad: (d) => {
    //         //     console.log("done1", d)
    //         //     // convToImg1(d)
    //         // },
    //         // onViewStateChange: (d) => {
    //         //     console.log("done2", d)
    //         //     // convToImg1(d)
    //         // },
    //         layers: [
    //             new HexagonLayer({
    //                 extruded: true,
    //                 radius: 30000,
    //                 data: API_URL,
    //                 dataTransform: (d) => {
    //                     console.log("done", d)
    //                     console.log(deckCust)
    //                     // handleDownload1()
    //                     // convToImg1()
    //                     return d.features
    //                 },
    //                 elevationScale: 300,
    //                 getColorValue: (points) =>
    //                     points.reduce((sum, point) => sum + point.properties.value, 0) /
    //                     points.length,
    //                 getElevationValue: (points) =>
    //                     points.reduce((sum, point) => sum + point.properties.value, 0) /
    //                     points.length,
    //                 getPosition: (d) => d.geometry.coordinates,
    //             }),
    //         ],
    //     })

    //     const handleDownload1 = async () => {
    //         await new Promise((r) => setTimeout(r, 4000))
    //         console.log("inside handleDownload")
    //         const fileName = "Map.png"

    //         // if (!refMap.current || !refDeckgl.current) {
    //         //     return
    //         // }
    //         // const mapGL = refMap.current.getMap()
    //         console.log(deckCust)
    //         const deck = deckCust

    //         // const mapboxCanvas = mapGL.getCanvas()
    //         deck.redraw(true)
    //         const deckglCanvas = deck.canvas

    //         let merge = document.createElement("canvas")
    //         merge.width = deckglCanvas.width
    //         merge.height = deckglCanvas.height

    //         var context = merge.getContext("2d")

    //         // context.globalAlpha = 1.0
    //         // context.drawImage(mapboxCanvas, 0, 0)
    //         context.globalAlpha = 1.0
    //         context.drawImage(deckglCanvas, 0, 0)
    //         // console.log(merge.toDataURL())

    //         // merge.toBlob((blob) => {
    //         //     FileSaver.saveAs(blob)
    //         // })
    //     }

    //     const convToImg1 = (d) => {
    //         console.log("inside d")
    //         // console.log(deckCust)
    //         // await new Promise((r) => setTimeout(r, 4000))
    //         // let can1 = deckCust.canvas
    //         // let can1 = document.getElementById("deckgl-overlay")
    //         let can1 = d.gl.canvas
    //         can1.toBlob(function (blob) {
    //             const anchor = document.createElement("a")
    //             const url = URL.createObjectURL(blob)
    //             anchor.href = url
    //             anchor.download = "canvas.png"
    //             document.body.appendChild(anchor)
    //             anchor.click()
    //             document.body.removeChild(anchor)
    //             URL.revokeObjectURL(url)
    //         }, "image/png")
    //         // // can1.getContext("webgl2", { preserveDrawingBuffer: true })
    //         // let canvasUrl = can1.toDataURL("image/png")
    //         // console.log(canvasUrl)
    //         // // setImage(canvasUrl)
    //         // const createEl = document.createElement("a")
    //         // createEl.href = canvasUrl
    //         // createEl.download = "download-this-canvas"
    //         // createEl.click()
    //         // createEl.remove()
    //     }
    //     // console.log(deckCust.canvas.getContext("2d"))
    //     // let canvasUrl = deckCust.canvas.toDataURL("image/png")
    //     // console.log(canvasUrl)
    //     // setImage(canvasUrl)
    //     // const createEl = document.createElement("a")
    //     // createEl.href = canvasUrl
    //     // createEl.download = "download-this-canvas"
    //     // createEl.click()
    //     // createEl.remove()
    // })

    const convToImg = async () => {
        await new Promise((r) => setTimeout(r, 4000))
        let can1 = document.getElementById("deckgl-overlay")
        const collection = document.getElementsByClassName("mapboxgl-canvas")
        let coll
        for (let i = 0; i < collection.length; i++) {
            if (collection[i].tagName == "CANVAS") {
                coll = collection[i]
                break
            }
        }
        if (!coll) {
            console.log("no canvas found")
            return
        }
        // // // let ctx1 = can1.getContext("webgl2")
        // // // let ctx2 = coll.getContext("webgl")
        // // // ctx1.drawImage(ctx2, 0, 0)
        // // can1.drawImage(coll, 0, 0)
        // // let imageFormed = can1.toDataURL("image/png")
        // can1.toBlob((blob) => {
        //     const a = document.createElement("a")
        //     document.body.appendChild(a)
        //     a.style.display = "none"
        //     const url = window.URL.createObjectURL(blob)
        //     a.href = url
        //     a.download = "abc.png"
        //     a.click()
        //     // saveBlob(blob, "abc.png")
        //     console.log(blob)
        //     let tmp = URL.createObjectURL(blob)
        //     console.log("----------------------------")
        //     console.log(tmp)
        //     setImage(tmp)
        // })
        // // setImage(imageFormed)
    }

    const refMap = useRef()
    const refDeckgl = useRef()

    const handleDownload = async () => {
        await new Promise((r) => setTimeout(r, 4000))
        console.log("inside handleDownload")
        const fileName = "Map.png"

        if (!refMap.current || !refDeckgl.current) {
            return
        }
        const mapGL = refMap.current.getMap()
        const deck = refDeckgl.current.deck

        const mapboxCanvas = mapGL.getCanvas()
        deck.redraw(true)
        const deckglCanvas = deck.canvas

        let merge = document.createElement("canvas")
        merge.width = mapboxCanvas.width
        merge.height = mapboxCanvas.height

        var context = merge.getContext("2d")

        context.globalAlpha = 1.0
        context.drawImage(mapboxCanvas, 0, 0)
        context.globalAlpha = 1.0
        context.drawImage(deckglCanvas, 0, 0)

        merge.toBlob((blob) => {
            FileSaver.saveAs(blob)
        })
    }

    return (
        <div>
            <div id="cnt"></div>
            <DeckGL
                ref={refDeckgl}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
            >
                <Map
                    ref={refMap}
                    preserveDrawingBuffer={true}
                    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                />
            </DeckGL>
            {image && <img src={image} />}
            <canvas id="canva" />
        </div>
    )
}

// <HexagonLayer
//         id="hexagon-layer"
//         extruded={true}
//         radius="30000"
//         data={API_URL}
//         dataTransform={(d) => d.features}
//         elevationScale="300"
//         getColorValue={(points) =>
//             points.reduce((sum, point) => sum + point.properties.value, 0) /
//             points.length
//         }
//         getElevationValue={(points) =>
//             points.reduce((sum, point) => sum + point.properties.value, 0) /
//             points.length
//         }
//         getPosition={(d) => d.geometry.coordinates}
// />
