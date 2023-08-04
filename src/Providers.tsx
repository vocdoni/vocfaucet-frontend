import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ClientProvider } from '@vocdoni/chakra-components'
import { EnvOptions } from '@vocdoni/sdk'
import { WagmiConfig, useSigner } from 'wagmi'
import { chains, wagmiClient } from './constants/rainbow'
import { rainbowStyles, theme } from './theme'
import { App } from './App'
import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { VocdoniEnvironment } from './constants'
import { Signer } from 'ethers'

export const Providers = () => (
  <>
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <AppProviders />
      </WagmiConfig>
    </ChakraProvider>
  </>
)

export const AppProviders = () => {
  const { data: signer } = useSigner()
  const { colorMode } = useColorMode()

  return (
    <RainbowKitProvider chains={chains} theme={rainbowStyles(colorMode)}>
        <ClientProvider env={VocdoniEnvironment as EnvOptions} signer={signer as Signer}>
          <App />
        </ClientProvider>
    </RainbowKitProvider>
  )
}
