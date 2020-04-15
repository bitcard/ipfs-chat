/* eslint-env browser */
import React, { useState, useEffect } from 'react'
import EventEmitter from 'events'
import Header from './Header'
import Metrics from './Metrics'
import Chat from './Chat'
import { getOrCreatePeerInfo } from '../libs/peer-info'
import '../styles/index.css'

export default function App ({
  createLibp2p
}) {
  const [peerInfo, setPeerInfo] = useState(null)
  const [libp2p, setLibp2p] = useState(null)
  const [started, setStarted] = useState(false)
  const eventBus = new EventEmitter()

  /**
   * Leverage use effect to act on state changes
   */
  useEffect(() => {
    // If we don't have a PeerInfo, let's get or create it
    // This will attempt to leverage localStorage so we can reuse our key
    if (!peerInfo) {
      console.info('Getting our PeerInfo')
      getOrCreatePeerInfo().then(setPeerInfo)
      return
    }

    // If the libp2p instance is not created, create it with our PeerInfo instance
    if (!libp2p) {
      console.info('Creating our Libp2p instance')
      setLibp2p(
        // bind event listeners on the new libp2p instance
        // so we can let the user know it's state
        createLibp2p(peerInfo)
          .on('start', () => setStarted(true))
          .on('stop', () => setStarted(false))
      )
      return
    }
  })

  return (
    <div className='avenir flex flex-column h-100'>
      <div className='flex-none'>
        <Header started={started} />
      </div>
      <div className='flex h-100'>
        <Metrics libp2p={libp2p} eventBus={eventBus} />
        <Chat libp2p={libp2p} eventBus={eventBus} />
      </div>
    </div>
  )
}
