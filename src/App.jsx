import { useState, useEffect } from 'react'
import axios from 'axios'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import './App.css'

const API = 'https://web-production-ae1a6.up.railway.app'

export default function App() {
  const [heatmap, setHeatmap] = useState([])
  const [routes, setRoutes] = useState(null)
  const [active, setActive] = useState('safest')
  const [loading, setLoading] = useState(false)
  const [shareCode, setShareCode] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  useEffect(() => {
    axios.get(`${API}/heatmap`).then(r => setHeatmap(r.data.data))
  }, [])

  const findRoutes = async (sLat, sLon, eLat, eLon) => {
    setLoading(true)
    setRoutes(null)
    try {
      const { data } = await axios.post(`${API}/route`, {
        start_lat: sLat, start_lon: sLon,
        end_lat: eLat, end_lon: eLon
      })
      setRoutes(data)
      setActive('safest')

      // Trigger pulse effect
      setPulseEffect(true)
      setTimeout(() => setPulseEffect(false), 600)

      // Show toast notification
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch {
      alert('Could not find route. Make sure backend is running.')
    }
    setLoading(false)
  }

  const shareLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported')
    navigator.geolocation.getCurrentPosition(async pos => {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase()
      await axios.post(`${API}/location/share`, {
        user_id: 'user1',
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        share_code: code
      })
      setShareCode(code)
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(p =>
          axios.post(`${API}/location/share`, {
            user_id: 'user1',
            lat: p.coords.latitude,
            lon: p.coords.longitude,
            share_code: code
          })
        )
      }, 5000)
    })
  }

  const currentRoute = routes
    ? (active === 'fastest' ? routes.fastest_route : routes.safest_route)
    : null

  return (
    <div className={`app ${pulseEffect ? 'pulse-bg' : ''}`}>
      <header className="header">
        <div className="logo">Safer<span>Route</span> AI</div>
        <span className="subtitle">
          Bangalore Accident Intelligence
          <span className="live-indicator"></span>
        </span>
        <div className="header-right">
          <button className="btn-share" onClick={shareLocation}>
            📍 Share Live Location
          </button>
          {shareCode && (
            <span
              className="share-code"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const link = `https://web-production-ae1a6.up.railway.app/track/${shareCode}`
                navigator.clipboard.writeText(link)
                alert(`Link copied!\n\nSend this to anyone:\n${link}`)
              }}
            >
              📍 Live · {shareCode} · Click to copy link
            </span>
          )}
        </div>
      </header>

      <div className="main">
        <Sidebar
          onSearch={findRoutes}
          routes={routes}
          active={active}
          setActive={setActive}
          loading={loading}
          shareCode={shareCode}
        />
        <div className="map-wrap">
          <Map
            heatmap={heatmap}
            currentRoute={currentRoute}
            routes={routes}
            active={active}
          />
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          <div className="toast-icon">✓</div>
          <span>Routes calculated — safest route selected</span>
        </div>
      )}
    </div>
  )
}