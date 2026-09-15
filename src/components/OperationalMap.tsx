import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
// Headquarters — SCBD, Jakarta. Adjust to your exact office coordinates.
const HQ_COORDS: [number, number] = [106.8090, -6.2247];
const HQ_ADDRESS = 'SCBD Area, Jakarta, Indonesia';

// Operational area — from drawing.geojson
const OPERATIONAL_AREA = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [105.77087804466645, -6.364686221361551],
                    [106.4394632843278, -6.364686221361551],
                    [106.4394632843278, -5.8332466718871405],
                    [105.77087804466645, -5.8332466718871405],
                    [105.77087804466645, -6.364686221361551],
                ]],
            },
            properties: null,
        },
    ],
} as GeoJSON.FeatureCollection;

type DirectionsState =
    | { status: 'idle' }
    | { status: 'locating' }
    | { status: 'routing' }
    | { status: 'ready'; distanceKm: string; durationLabel: string }
    | { status: 'error'; message: string };

function formatDuration(seconds: number) {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
}

function boundsOf(coords: [number, number][]): mapboxgl.LngLatBoundsLike {
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [lng, lat] of coords) {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
    }
    return [[minLng, minLat], [maxLng, maxLat]];
}

// ─────────────────────────────────────────────
// MAP
// ─────────────────────────────────────────────
export function OperationalMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const [tokenMissing, setTokenMissing] = useState(false);
    const [directions, setDirections] = useState<DirectionsState>({ status: 'idle' });

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Init map ──
    useEffect(() => {
        const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
        if (!token || !containerRef.current) {
            setTokenMissing(true);
            return;
        }
        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/standard',
            center: HQ_COORDS,
            zoom: 10,
            pitch: reducedMotion ? 0 : 55,
            bearing: reducedMotion ? 0 : -17,
            antialias: true,
        });
        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

        // Mapbox measures the container's size once at construction time.
        // If the container's height isn't fully settled yet (common with
        // flex/animated layouts), the canvas collapses to a thin strip and
        // never corrects itself unless we explicitly tell it to re-measure.
        const resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(containerRef.current);
        // Also force one resize on the next frame, after layout has settled.
        requestAnimationFrame(() => map.resize());

        map.on('style.load', () => {
            map.setConfigProperty('basemap', 'lightPreset', 'dusk');
            map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);

            map.addSource('operational-area', { type: 'geojson', data: OPERATIONAL_AREA });
            map.addLayer({
                id: 'operational-area-fill',
                type: 'fill',
                source: 'operational-area',
                paint: { 'fill-color': '#F26522', 'fill-opacity': 0.1 },
            });
            map.addLayer({
                id: 'operational-area-outline',
                type: 'line',
                source: 'operational-area',
                paint: { 'line-color': '#F26522', 'line-width': 1.5, 'line-opacity': 0.6 },
            });

            const areaCoords = (OPERATIONAL_AREA.features[0].geometry as GeoJSON.Polygon).coordinates[0] as [number, number][];
            map.fitBounds(boundsOf(areaCoords), { padding: 60, duration: 0 });

            if (!reducedMotion) {
                window.setTimeout(() => {
                    map.flyTo({ center: HQ_COORDS, zoom: 14, pitch: 55, bearing: -17, duration: 3000, essential: true });
                }, 500);
            }
        });

        // HQ marker
        const hqEl = document.createElement('div');
        hqEl.className = 'map-marker map-marker--hq';
        hqEl.innerHTML = '<span class="map-marker-dot"></span><span class="map-marker-pulse"></span>';
        new mapboxgl.Marker({ element: hqEl, anchor: 'center' }).setLngLat(HQ_COORDS).addTo(map);

        return () => {
            resizeObserver.disconnect();
            map.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Get directions: geolocate → Mapbox Directions API → draw route ──
    const getDirections = useCallback(() => {
        const map = mapRef.current;
        const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
        if (!map || !token) return;

        if (!('geolocation' in navigator)) {
            setDirections({ status: 'error', message: 'Geolocation is not supported by your browser.' });
            return;
        }

        setDirections({ status: 'locating' });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude];
                setDirections({ status: 'routing' });

                try {
                    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userCoords[0]},${userCoords[1]};${HQ_COORDS[0]},${HQ_COORDS[1]}?geometries=geojson&overview=full&access_token=${token}`;
                    const res = await fetch(url);
                    if (!res.ok) throw new Error('Directions request failed');
                    const data = await res.json();
                    const route = data.routes?.[0];
                    if (!route) throw new Error('No route found');

                    const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
                        type: 'Feature',
                        geometry: route.geometry,
                        properties: {},
                    };

                    if (map.getSource('route')) {
                        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
                    } else {
                        map.addSource('route', { type: 'geojson', data: routeGeoJSON });
                        map.addLayer({
                            id: 'route-glow',
                            type: 'line',
                            source: 'route',
                            layout: { 'line-cap': 'round', 'line-join': 'round' },
                            paint: { 'line-color': '#F26522', 'line-width': 10, 'line-opacity': 0.18, 'line-blur': 4 },
                        });
                        map.addLayer({
                            id: 'route-line',
                            type: 'line',
                            source: 'route',
                            layout: { 'line-cap': 'round', 'line-join': 'round' },
                            paint: { 'line-color': '#F26522', 'line-width': 4 },
                        });
                    }

                    if (!userMarkerRef.current) {
                        const userEl = document.createElement('div');
                        userEl.className = 'map-marker map-marker--user';
                        userEl.innerHTML = '<span class="map-marker-dot"></span><span class="map-marker-pulse"></span>';
                        userMarkerRef.current = new mapboxgl.Marker({ element: userEl, anchor: 'center' })
                            .setLngLat(userCoords)
                            .addTo(map);
                    } else {
                        userMarkerRef.current.setLngLat(userCoords);
                    }

                    const routeCoords = route.geometry.coordinates as [number, number][];
                    map.fitBounds(boundsOf(routeCoords), {
                        padding: { top: 80, bottom: 140, left: 60, right: 60 },
                        pitch: reducedMotion ? 0 : 45,
                        duration: reducedMotion ? 0 : 1600,
                    });

                    setDirections({
                        status: 'ready',
                        distanceKm: (route.distance / 1000).toFixed(1),
                        durationLabel: formatDuration(route.duration),
                    });
                } catch {
                    setDirections({ status: 'error', message: "Couldn't calculate a route. Try again." });
                }
            },
            () => {
                setDirections({ status: 'error', message: 'Location access denied. Enable it to get directions.' });
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }, [reducedMotion]);

    if (tokenMissing) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-widest px-6 text-center">
                Map unavailable — set VITE_MAPBOX_TOKEN
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <div
                ref={containerRef}
                className="absolute inset-0"
                style={{ width: '100%', height: '100%' }}
                role="img"
                aria-label={`3D map showing Digdaya Teknokraf's operational area and headquarters at ${HQ_ADDRESS}`}
            />

            {/* Corner accents — consistent with the contact form frame */}
            {[
                'top-0 left-0 border-t border-l',
                'top-0 right-0 border-t border-r',
                'bottom-0 left-0 border-b border-l',
                'bottom-0 right-0 border-b border-r',
            ].map((cls, i) => (
                <span
                    key={i}
                    className={`absolute w-4 h-4 border-[var(--brand)]/60 pointer-events-none ${cls}`}
                    style={{ margin: '-1px' }}
                />
            ))}

            {/* Directions panel */}
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/70 backdrop-blur-sm border border-white/10 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Headquarters</p>
                        <p className="font-mono text-xs text-white/80 mt-1">{HQ_ADDRESS}</p>
                    </div>
                    <button
                        type="button"
                        onClick={getDirections}
                        disabled={directions.status === 'locating' || directions.status === 'routing'}
                        className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-3 bg-[var(--brand)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)]"
                    >
                        {directions.status === 'locating' && 'Locating…'}
                        {directions.status === 'routing' && 'Routing…'}
                        {(directions.status === 'idle' || directions.status === 'ready') && 'Get directions'}
                        {directions.status === 'error' && 'Retry'}
                    </button>
                </div>

                {directions.status === 'ready' && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand)] mt-3">
                        {directions.distanceKm} km · {directions.durationLabel} by car
                    </p>
                )}
                {directions.status === 'error' && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mt-3">
                        {directions.message}
                    </p>
                )}
            </div>

            <style>{`
                .map-marker { position: relative; width: 16px; height: 16px; }
                .map-marker-dot {
                    position: absolute; inset: 0; margin: auto;
                    width: 10px; height: 10px; border-radius: 50%;
                    box-shadow: 0 0 0 2px rgba(7,7,7,0.85);
                }
                .map-marker-pulse {
                    position: absolute; inset: 0; margin: auto;
                    width: 10px; height: 10px; border-radius: 50%;
                    opacity: 0.55;
                    animation: map-marker-pulse 2.2s cubic-bezier(0.16,1,0.3,1) infinite;
                }
                .map-marker--hq .map-marker-dot,
                .map-marker--hq .map-marker-pulse { background: #F26522; }
                .map-marker--user .map-marker-dot,
                .map-marker--user .map-marker-pulse { background: #4A9EFF; }
                @keyframes map-marker-pulse {
                    0% { transform: scale(1); opacity: 0.55; }
                    100% { transform: scale(3.4); opacity: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .map-marker-pulse { animation: none; opacity: 0; }
                }
                .mapboxgl-ctrl-attrib { font-size: 9px; }
            `}</style>
        </div>
    );
}
