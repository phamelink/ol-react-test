import { Feature } from "ol"
import { Point } from "ol/geom"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import Map from "ol/Map"
import "ol/ol.css"
import { fromLonLat } from "ol/proj"
import OSM from "ol/source/OSM"
import VectorSource from "ol/source/Vector"
import View from "ol/View"
import type { FunctionComponent, PropsWithChildren } from "react"
import { useEffect, useRef } from "react"

const TMap: FunctionComponent<PropsWithChildren<{ coordinates: number[] }>> = ({
	children,
	coordinates,
}) => {
	const transformedCoordinates = fromLonLat(coordinates)

	const mapElement = useRef<HTMLDivElement>(null)
	const mapRef = useRef<Map>()

	useEffect(() => {
		const point = new Point(transformedCoordinates)
		const feature = new Feature({ geometry: point })
		const drawSource = new VectorSource({ wrapX: false, features: [feature] })

		if (mapElement.current && !mapRef.current) {
			mapRef.current = new Map({
				target: mapElement.current ?? undefined,
				layers: [
					new TileLayer({
						source: new OSM(),
					}),
					new VectorLayer({
						source: drawSource,
					}),
				],
				view: new View({
					center: transformedCoordinates,
					zoom: 2,
				}),
			})
		}
	}, [transformedCoordinates])

	return (
		<div
			id="map"
			className="map"
			style={{ height: "100%", width: "100%" }}
			ref={mapElement}>
			{children}
		</div>
	)
}

export default TMap
