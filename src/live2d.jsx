import { createRoot } from 'react-dom/client'
import './index.css'
import Live2DApp from './Live2DApp.jsx'

const rawGameId = typeof window !== 'undefined' ? window.__LIVE2D_GAME_ID__ : 0;
const numericGameId = Number.isFinite(Number(rawGameId)) ? Number(rawGameId) : 0;
const parsedGameId = numericGameId === 1 ? 1 : 0;

createRoot(document.getElementById('root')).render(
    <Live2DApp gameId={parsedGameId} />
)
