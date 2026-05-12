import { useState, useEffect } from 'react'

export default function ShareModal({ code, onClose, apiBase }) {
    const trackUrl = `${apiBase}/location/track/${code}`
    const [displayedCode, setDisplayedCode] = useState('')
    const [copiedLink, setCopiedLink] = useState(false)

    // Typewriter effect for code
    useEffect(() => {
        let index = 0
        setDisplayedCode('')
        const interval = setInterval(() => {
            if (index < code.length) {
                setDisplayedCode(code.slice(0, index + 1))
                index++
            } else {
                clearInterval(interval)
            }
        }, 100)
        return () => clearInterval(interval)
    }, [code])

    const copyCode = () => {
        navigator.clipboard.writeText(code).then(() => alert('Code copied!'))
    }

    const copyLink = () => {
        navigator.clipboard.writeText(trackUrl).then(() => {
            setCopiedLink(true)
            setTimeout(() => setCopiedLink(false), 2000)
        })
    }

    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-title">📍 Live Location Sharing Active</div>
                <div className="modal-sub">Your location is updating every 5 seconds</div>

                <div className="modal-code-box">
                    <div className="modal-code">{displayedCode}</div>
                    <div className="modal-url">{trackUrl}</div>
                </div>

                <div className="modal-steps">
                    <div className="modal-step">
                        <div className="step-num">1</div>
                        <div>Share the code <strong>{code}</strong> with your contact via WhatsApp, SMS, or any message app</div>
                    </div>
                    <div className="modal-step">
                        <div className="step-num">2</div>
                        <div>They open <strong>localhost:8000/location/track/{code}</strong> in their browser to see your live location</div>
                    </div>
                    <div className="modal-step">
                        <div className="step-num">3</div>
                        <div>Your location updates automatically every 5 seconds as long as this tab is open</div>
                    </div>
                </div>

                <button
                    onClick={copyCode}
                    style={{
                        width: '100%', padding: '10px', marginBottom: '8px',
                        background: 'var(--teal)', border: 'none', borderRadius: '8px',
                        color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                    }}
                >
                    Copy Code: {code}
                </button>
                <button
                    onClick={copyLink}
                    style={{
                        width: '100%', padding: '10px', marginBottom: '8px',
                        background: copiedLink ? 'var(--teal)' : 'var(--blue)', 
                        border: 'none', borderRadius: '8px',
                        color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {copiedLink ? '✓ Link Copied!' : '🔗 Copy Full Link'}
                </button>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    )
}