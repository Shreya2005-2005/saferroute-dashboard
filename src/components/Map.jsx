import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

function FitBounds({ coords }) {
    const map = useMap()
    useEffect(() => {
        if (coords?.length) map.fitBounds(coords.map(c => [c[1], c[0]]), { padding: [40, 40] })
    }, [coords, map])
    return null
}

export default function Map({ heatmap, currentRoute, routes, active }) {
    const routeCoords = currentRoute?.coords || []

    return (
        <MapContainer center={[12.9716, 77.5946]} zoom={12}
            style={{ width: '100%', height: '100%' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/* Accident heatmap dots */}
            {heatmap.map((pt, i) => (
                <CircleMarker key={i} center={[pt.lat, pt.lon]} radius={5}
                    pathOptions={{
                        fillColor: pt.intensity > 0.7 ? '#e63946' : pt.intensity > 0.4 ? '#ff9f1c' : '#ffd60a',
                        fillOpacity: 0.5, color: 'none'
                    }}>
                    <Popup>{pt.reason}<br />Risk: {(pt.intensity * 100).toFixed(0)}%</Popup>
                </CircleMarker>
            ))}

            {/* Both routes — dim the inactive one */}
            {routes && <>
                <Polyline
                    positions={routes.fastest_route.coords.map(c => [c[1], c[0]])}
                    pathOptions={{ color: '#ff9f1c', weight: active === 'fastest' ? 5 : 2, opacity: active === 'fastest' ? 1 : 0.3 }}
                />
                {(routes.safest_routes || [routes.safest_route]).map((r, i) => (
                    <Polyline
                        key={r.route_type || i}
                        positions={r.coords.map(c => [c[1], c[0]])}
                        pathOptions={{
                            color: i === 0 ? '#2ec4b6' : '#a855f7',
                            weight: active === r.route_type ? 5 : 2,
                            opacity: active === r.route_type ? 1 : 0.3
                        }}
                    />
                ))}
            </>}

            {/* Risk spots on active route */}
            {currentRoute?.risk_points?.map((pt, i) => (
                <CircleMarker key={i} center={[pt.lat, pt.lon]} radius={9}
                    pathOptions={{
                        color: pt.score > 0.7 ? '#e63946' : '#ff9f1c',
                        fillColor: pt.score > 0.7 ? '#e63946' : '#ff9f1c',
                        fillOpacity: 0.8, weight: 2
                    }}>
                    <Popup><b>{pt.reason}</b><br />Risk: {(pt.score * 100).toFixed(0)}%</Popup>
                </CircleMarker>
            ))}

            {routeCoords.length > 0 && <FitBounds coords={routeCoords} />}
        </MapContainer>
    )
}