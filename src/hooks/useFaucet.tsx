import { useAccount } from "wagmi";

const useFaucet = () => {
  const { isConnected, address } = useAccount();

  const oAuthSignInURL = async (provider: string): Promise<string> => {
    if (!isConnected) throw new Error("Wallet not connected");

    const params: URLSearchParams = new URLSearchParams();
    params.append("provider", provider);
    params.append("recipient", address as string);
    const redirectURL: string = `${window.location.origin}${
      window.location.pathname
    }?${params.toString()}${window.location.hash}`;

    const response = await fetch(
      `${import.meta.env.REACT_APP_FAUCET_URL}/oauth/authUrl/${provider}`,
      {
        method: "POST",
        body: JSON.stringify({
          redirectURL,
        }),
      }
    );
    const res = await response.json();
    if (!res.ok) throw new Error(res.reason);
    return Buffer.from(res.data, "base64").toString("binary");
  };

  const faucetReceipt = async (
    provider: string,
    code: string,
    recipient: string
  ): Promise<any> => {
    const response = await fetch(
      `${
        import.meta.env.REACT_APP_FAUCET_URL
      }/oauth/claim/${provider}/${code}/${recipient}`
    );
    const res = await response.json();
    if (!res.ok) throw new Error(res.reason);
    return Buffer.from(res.data, "base64").toString("binary");
  };

  return {
    oAuthSignInURL,
    faucetReceipt,
  };
};

export default useFaucet;
