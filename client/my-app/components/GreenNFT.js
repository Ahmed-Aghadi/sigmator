import DeckGL from "@deck.gl/react"
import { LineLayer, PolygonLayer } from "@deck.gl/layers"
import { HexagonLayer } from "@deck.gl/aggregation-layers"
import { Map } from "react-map-gl"
import { MapView, FirstPersonView, Deck } from "@deck.gl/core"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { climateNFTCollectionURI, countryCodes } from "../constants"
import { Badge } from "@mantine/core"

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -97,
    latitude: 40,
    zoom: 3,
    pitch: 60,
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
export default function Main() {
    const refMap = useRef()
    const refDeckgl = useRef()
    const router = useRouter()
    const [layers, setLayers] = useState([])
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
    const [country, setCountry] = useState("")
    const [beginDate, setBeginDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [isFound, setIsFound] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (router.isReady) {
            setData()
        }
    }, [router.isReady])

    const setData = async () => {
        const res = await fetch(`https://${climateNFTCollectionURI}.revise.link/${router.query.id}`)
        const data = await res.json()
        console.log("data", data)
        if (data.message) {
            setIsFound(false)
            setLoading(false)
            return
        }
        setIsFound(true)
        const country = data.attributes[0].value
        const begin = data.attributes[1].value
        const end = data.attributes[2].value
        setCountry(country)
        setBeginDate(begin)
        setEndDate(end)

        const API_URL =
            "https://api.v2.emissions-api.org/api/v2/carbonmonoxide/geo.json" +
            `?country=${country}&begin=${begin}&end=${end}`

        // const API_URL =
        //     "https://api.v2.emissions-api.org/api/v2/carbonmonoxide/geo.json" +
        //     "?country=US&begin=2019-05-01&end=2019-05-04"

        console.log("API_URL", API_URL)

        setLayers([
            new HexagonLayer({
                id: "hexagon-layer",
                extruded: true,
                radius: 30000,
                data: API_URL,
                dataTransform: (d) => {
                    console.log("DONE", d)
                    return d.features
                },
                elevationScale: 300,
                getColorValue: (points) =>
                    points.reduce((sum, point) => sum + point.properties.value, 0) / points.length,
                getElevationValue: (points) =>
                    points.reduce((sum, point) => sum + point.properties.value, 0) / points.length,
                getPosition: (d) => d.geometry.coordinates,
            }),
        ])

        const apiRes = await fetch(API_URL)
        const apiJson = await apiRes.json()
        console.log("apiJson", apiJson)
        const ftrs = apiJson.features
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
        }
        const center = [(minLon + maxLon) / 2, (minLat + maxLat) / 2]
        setViewState((oldViewState) => ({
            ...oldViewState,
            longitude: center[0],
            latitude: center[1],
        }))
        setLoading(false)
    }

    return (
        <div>
            {isFound && (
                <>
                    <div style={{ position: "absolute", opacity: "0.8", zIndex: 100 }}>
                        <Badge color="green" size="xl" variant="filled">
                            {countryCodes[country]}
                        </Badge>
                        <Badge ml="sm" color="green" size="sm" variant="filled">
                            {beginDate}
                        </Badge>
                        <Badge ml="sm" color="green" size="sm" variant="filled">
                            {endDate}
                        </Badge>
                    </div>
                    <DeckGL
                        ref={refDeckgl}
                        initialViewState={viewState}
                        controller={true}
                        layers={layers}
                    >
                        <Map
                            ref={refMap}
                            preserveDrawingBuffer={true}
                            mapboxAccessToken={
                                "pk.eyJ1IjoiYWhtZWRhZ2hhZGkiLCJhIjoiY2w5dmVlYzVlMHYxMzNvczk1M3A3ZG0wYSJ9.7zEDgRFhsfIQsw6a0Y0ybg"
                            }
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                        />
                    </DeckGL>
                </>
            )}
        </div>
    )
}
