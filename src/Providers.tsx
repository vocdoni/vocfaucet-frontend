import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ClientProvider } from "@vocdoni/chakra-components";
import { WagmiConfig, useSigner } from "wagmi";
import { chains, wagmiClient } from "./constants/rainbow";
import { rainbowStyles, theme } from "./theme";
import { App } from "./App";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  useColorMode,
} from "@chakra-ui/react";
import { VocdoniEnvironment } from "./constants";
import { Signer } from "ethers";
import { useTranslation } from "react-i18next";
import { translations } from "./i18n/components";
import { datesLocale } from "./i18n/locales";
import { ClientEnv } from "@vocdoni/react-providers";

export const Providers = () => (
  <>
    <ChakraProvider theme={extendTheme(theme)}>
      <WagmiConfig client={wagmiClient}>
        <AppProviders />
      </WagmiConfig>
    </ChakraProvider>
  </>
);

export const AppProviders = () => {
  const { data: signer } = useSigner();
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();

  return (
    <RainbowKitProvider chains={chains} theme={rainbowStyles(colorMode)}>
      <ClientProvider
        env={VocdoniEnvironment as ClientEnv}
        signer={signer as Signer}
        locale={translations(t)}
        datesLocale={datesLocale(i18n.language)}
      >
        <ColorModeScript />
        <App />
      </ClientProvider>
    </RainbowKitProvider>
  );
};
