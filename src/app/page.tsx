'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const address = account.addresses?.[0]

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Web3 Wallet</h1>
          <p className="text-muted-foreground">
            Connect your wallet to get started
          </p>
        </div>

        {account.status === 'connected' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Account
              </CardTitle>
              <CardDescription>Your connected wallet information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-500">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Address
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 text-sm bg-muted rounded">
                      {address ? formatAddress(address) : 'N/A'}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyAddress}
                      className="h-8 w-8"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Chain ID
                  </span>
                  <span className="text-sm font-mono">{account.chainId}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => disconnect()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>
                Choose a wallet to connect to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="w-full justify-start"
                  variant="outline"
                  disabled={status === 'pending'}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {connector.name}
                </Button>
              ))}
              {status === 'pending' && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Connecting...
                </p>
              )}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error.message}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
