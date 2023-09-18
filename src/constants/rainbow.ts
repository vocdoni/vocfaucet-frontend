import { Wallet, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient } from "wagmi";
import type { Chain } from "wagmi/chains";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { oAuthWallet } from "@vocdoni/rainbowkit-wallets";

const vocdoni = {
  ...mainnet,
  // we need id zero to bypass the switch chain behavior
  id: 0,
  name: "Vocdoni",
  network: "none",
} as const satisfies Chain;

export const { chains, provider } = configureChains(
  [vocdoni],
  [publicProvider()]
);

const projectId = "vocdoni-faucet";
const appName = "Vocdoni's Voting Protocol Faucet";

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      metaMaskWallet({ chains, projectId }),
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName }),
    ],
  },
  {
    groupName: "Social",
    wallets: [
      oAuthWallet({
        chains,
        name: "Github",
        iconUrl: "https://i.ibb.co/db4ppPM/github-mark.png",
        options: {
          oAuthServiceUrl: "https://oauth.vocdoni.net/",
          oAuthServiceProvider: "github",
        },
      }) as Wallet,
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
