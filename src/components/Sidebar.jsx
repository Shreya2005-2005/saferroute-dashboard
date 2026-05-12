import { useState, useRef, useEffect } from 'react'

const PLACES = [
    { name: 'MG Road', lat: 12.9763, lon: 77.6033, area: 'Central' },
    { name: 'Whitefield', lat: 12.9698, lon: 77.7499, area: 'East' },
    { name: 'Koramangala', lat: 12.9352, lon: 77.6245, area: 'South' },
    { name: 'Indiranagar', lat: 12.9784, lon: 77.6408, area: 'East' },
    { name: 'Electronic City', lat: 12.8399, lon: 77.6770, area: 'South' },
    { name: 'Hebbal', lat: 13.0350, lon: 77.5970, area: 'North' },
    { name: 'Marathahalli', lat: 12.9591, lon: 77.6974, area: 'East' },
    { name: 'Jayanagar', lat: 12.9299, lon: 77.5830, area: 'South' },
    { name: 'Yeshwanthpur', lat: 13.0291, lon: 77.5510, area: 'West' },
    { name: 'Kempegowda Airport', lat: 13.1989, lon: 77.7068, area: 'North' },
    { name: 'Banashankari', lat: 12.9255, lon: 77.5468, area: 'South' },
    { name: 'BTM Layout', lat: 12.9166, lon: 77.6101, area: 'South' },
    { name: 'HSR Layout', lat: 12.9081, lon: 77.6476, area: 'South' },
    { name: 'Rajajinagar', lat: 12.9926, lon: 77.5559, area: 'West' },
    { name: 'Yelahanka', lat: 13.1007, lon: 77.5963, area: 'North' },
    { name: 'JP Nagar', lat: 12.9102, lon: 77.5836, area: 'South' },
    { name: 'Vijayanagar', lat: 12.9719, lon: 77.5288, area: 'West' },
    { name: 'Sarjapur Road', lat: 12.9010, lon: 77.6875, area: 'East' },
    { name: 'Bellandur', lat: 12.9259, lon: 77.6762, area: 'East' },
    { name: 'KR Puram', lat: 13.0086, lon: 77.6953, area: 'East' },
]

const BADGE = {
    'Very High Risk': 'vhigh', 'High Risk': 'high',
    'Medium Risk': 'medium', 'Low Risk': 'low', 'Very Low Risk': 'low'
}

function PlaceDropdown({ label, placeholder, isDest, onSelect, value, onClear }) {
    const [query, setQuery] = useState(value || '')
    const [open, setOpen] = useState(false)
    const [idx, setIdx] = useState(-1)
    const inputRef = useRef(null)
    const dropRef = useRef(null)

    useEffect(() => { setQuery(value || '') }, [value])

    const filtered = query.length === 0
        ? PLACES
        : PLACES.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

    const pick = (p) => {
        setQuery(p.name); setOpen(false); setIdx(-1); onSelect(p)
    }

    const handleKey = (e) => {
        if (!open) { setOpen(true); return }
        if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, filtered.length - 1)) }
        if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
        if (e.key === 'Enter' && idx >= 0) { pick(filtered[idx]) }
        if (e.key === 'Escape') { setOpen(false) }
    }

    const clear = () => { setQuery(''); onClear(); inputRef.current?.focus() }

    return (
        <div className="place-search">
            <div className="place-label">
                <div className="dot" style={{ background: isDest ? 'var(--teal)' : 'var(--orange)' }} />
                {label}
            </div>
            <div className="place-input-wrap">
                <span className="place-input-icon">{isDest ? '🏁' : '📍'}</span>
                <input
                    ref={inputRef}
                    className={`place-input ${isDest ? 'is-dest' : ''} ${query ? 'has-value' : ''}`}
                    placeholder={placeholder}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true); setIdx(-1) }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 160)}
                    onKeyDown={handleKey}
                    autoComplete="off"
                />
                {query && (
                    <button className="place-clear" onClick={clear} type="button">×</button>
                )}
            </div>

            {open && filtered.length > 0 && (
                <div className="dropdown" ref={dropRef}>
                    {filtered.slice(0, 8).map((p, i) => (
                        <div
                            key={p.name}
                            className={`dropdown-item ${i === idx ? 'highlighted' : ''}`}
                            onMouseDown={() => pick(p)}
                            onMouseEnter={() => setIdx(i)}
                        >
                            <span className="di-icon">{isDest ? '🏁' : '📍'}</span>
                            <span className="di-name">{p.name}</span>
                            <span className="di-coords">{p.area}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Sidebar({ onSearch, routes, active, setActive, loading }) {
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [startName, setStartName] = useState('')
    const [endName, setEndName] = useState('')

    const swap = () => {
        const tmp = start; setStart(end); setEnd(tmp)
        const tmpN = startName; setStartName(endName); setEndName(tmpN)
    }

    const search = () => {
        if (!start || !end) return alert('Please select both start and destination')
        onSearch(start.lat, start.lon, end.lat, end.lon)
    }

    // Build all route cards including safest_routes array
    const allRoutes = routes ? [
        { key: 'fastest', r: routes.fastest_route, label: '⚡ Fastest Route', cls: 'fast-card' },
        ...(routes.safest_routes || [routes.safest_route]).map((r, i) => ({
            key: r.route_type || `safest_${i + 1}`,
            r,
            label: r.route_label || `🛡 Safest Route #${i + 1}`,
            cls: 'safe-card'
        })),
    ] : []

    // shown = whichever route card is currently selected
    const shown = routes
        ? active === 'fastest'
            ? routes.fastest_route
            : active === 'balanced'
                ? routes.safest_routes?.[0] || routes.safest_route
                : active === 'cautious'
                    ? routes.safest_routes?.[1] || routes.safest_route
                    : routes.safest_route
        : null
    return (
        <aside className="sidebar">

            {/* Route Planner */}
            <div className="sec">
                <div className="sec-title">Plan Your Route</div>

                <PlaceDropdown
                    label="Starting Point"
                    placeholder="Where are you starting from?"
                    isDest={false}
                    value={startName}
                    onSelect={p => { setStart(p); setStartName(p.name) }}
                    onClear={() => { setStart(null); setStartName('') }}
                />

                <div className="swap-btn" onClick={swap} title="Swap start and destination">⇅</div>

                <PlaceDropdown
                    label="Destination"
                    placeholder="Where do you want to go?"
                    isDest={true}
                    value={endName}
                    onSelect={p => { setEnd(p); setEndName(p.name) }}
                    onClear={() => { setEnd(null); setEndName('') }}
                />

                <button
                    className={`find-btn ${loading ? 'loading' : ''} ${start && end && !loading ? 'ready' : ''}`}
                    onClick={search}
                    disabled={loading || !start || !end}
                >
                    <div className="find-btn-inner">
                        {loading
                            ? <><div className="spinner" /> Analysing route safety...</>
                            : <><span>🔍</span> Find Safest &amp; Fastest Route</>
                        }
                    </div>
                </button>
            </div>

            {/* Loading text */}
            {loading && (
                <div className="loading-text">
                    <div className="spinner" />
                    Checking accident data along {start?.name} → {end?.name}...
                </div>
            )}

            {/* Route Comparison */}
            {routes && (
                <div className="sec">
                    <div className="sec-title">Route Comparison</div>

                    {allRoutes.map(({ key, r, label, cls }) => (
                        <div
                            key={key}
                            className={`route-card ${cls} ${active === key ? 'active' : ''}`}
                            onClick={() => setActive(key)}
                            style={{ animationDelay: key === 'balanced' ? '0.1s' : key === 'cautious' ? '0.2s' : '0s' }}
                        >
                            <div className="rc-header">
                                <div className="rc-type">{label}</div>
                                {active === key && <div className="rc-checkmark">✓</div>}
                                <div className={`badge ${BADGE[r.risk_label] || 'low'}`}>{r.risk_label}</div>
                            </div>
                            <div className="rc-meta">
                                <div className="rc-stat">
                                    <div className="rc-stat-val">{r.distance_km} km</div>
                                    <div className="rc-stat-label">Distance</div>
                                </div>
                                <div className="rc-stat">
                                    <div className="rc-stat-val">{r.duration_min} min</div>
                                    <div className="rc-stat-label">Duration</div>
                                </div>
                                <div className="rc-stat">
                                    <div className="rc-stat-val">{(r.risk_score * 100).toFixed(0)}%</div>
                                    <div className="rc-stat-label">Risk Score</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {routes.comparison && (
                        <div className="compare-row">
                            <span>Extra time (safer): <b>{routes.comparison.time_difference_min} min</b></span>
                            <span>Extra dist: <b>{routes.comparison.distance_difference_km} km</b></span>
                        </div>
                    )}

                    {/* Risk Comparison Meter */}
                    <div className="risk-meter">
                        <div className="risk-meter-title">Risk Comparison</div>
                        {allRoutes.map(({ key, r, label }) => (
                            <div className="risk-meter-row" key={key}>
                                <div className="risk-meter-label">
                                    <span className="risk-meter-name">{label}</span>
                                    <span className="risk-meter-value">{(r.risk_score * 100).toFixed(0)}%</span>
                                </div>
                                <div className="risk-meter-bar-bg">
                                    <div
                                        className={`risk-meter-bar-fill ${r.risk_score > 0.6 ? 'high-risk' : 'low-risk'}`}
                                        style={{ width: `${r.risk_score * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Risk Points */}
            {shown && (
                <div className="sec">
                    <div className="sec-title">
                        ⚠ Risk Points · {shown.route_label || active} Route
                    </div>
                    {(!shown.risk_points || shown.risk_points.length === 0) && (
                        <div style={{ color: 'var(--teal)', fontSize: 13, padding: '4px 0' }}>
                            ✅ No major risk points detected on this route
                        </div>
                    )}
                    {shown.risk_points?.slice(0, 10).map((pt, i) => (
                        <div
                            key={i}
                            className="risk-item"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="rdot" style={{
                                background: pt.score > 0.7 ? 'var(--red)'
                                    : pt.score > 0.4 ? 'var(--orange)' : 'var(--teal)'
                            }} />
                            <div>
                                <div className="risk-reason">{pt.reason}</div>
                                <div className="risk-score-text">
                                    Risk: {(pt.score * 100).toFixed(0)}% · {pt.level}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </aside>
    )
}