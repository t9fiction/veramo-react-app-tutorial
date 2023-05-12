import React, { useEffect, useState } from 'react'
import './App.css'

import { agent } from './veramo/setup'

declare global {
  interface Window {
    ethereum?: any;
  }
}


function App() {
  const [didDoc, setDidDoc] = useState<any>()

  const resolve = async () => {
    const doc = await agent.resolveDid({
      didUrl: 'did:ethr:goerli:0x6acf3bb1ef0ee84559de2bc2bd9d91532062a730',
    })

    setDidDoc(doc)
  }

  const configureMetaMask = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask extension not found')
      }

      // Request MetaMask access to the current Ethereum account
      await window.ethereum.enable()

      // Add the Ethereum address to the agent's DID resolver
      await agent.didManagerAddEthrDid({
        provider: window.ethereum,
        alias: 'MetaMask',
        kms: 'local',
      })

      // Resolve the DID document with the updated agent configuration
      resolve()
    } catch (error) {
      console.error('MetaMask configuration error:', error)
    }
  }

  useEffect(() => {
    configureMetaMask()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <pre id="result">{didDoc && JSON.stringify(didDoc, null, 2)}</pre>
      </header>
    </div>
  )
}

export default App
