import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useClient } from "@vocdoni/react-providers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";
import { useAccount } from "wagmi";
import useFaucet from "../hooks/useFaucet";

const Home = () => {
  const {
    client,
    account,
    loading: accoutLoading,
    loaded: accoutLoaded,
  } = useClient();

  const { isConnected } = useAccount();
  const { t } = useTranslation();
  const toast = useToast();
  const { oAuthSignInURL, faucetReceipt } = useFaucet();
  const [loading, setLoading] = useState<boolean>(false);

  // Received code from OAuth provider (github, google, etc.)
  useEffect(() => {
    if (!client.wallet) return;
    if (accoutLoading.account) return; // If it's loading, we know it's not ready yet
    if (!accoutLoaded.account) return; // We need the account to be loaded (final status)

    const params: URLSearchParams = new URLSearchParams(window.location.search);
    const provider: string | null = params.get("provider");
    const code: string | null = params.get("code");
    const recipient: string | null = params.get("recipient");
    if (!code || !provider || !recipient) return;

    claimTokens(provider, code, recipient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, accoutLoading]);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      window.location.href = await oAuthSignInURL(provider);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const claimTokens = async (
    provider: string,
    code: string,
    recipient: string
  ) => {
    setLoading(true);
    const loadingToast = toast({
      title: t("form.claim.loading_title"),
      description: t("form.claim.loading_description"),
      status: "loading",
    });

    try {
      // Get the faucet receipt
      const data = await faucetReceipt(provider, code, recipient);
      console.log("claimTokens", data);

      // Claim the tokens with the SDK
      if (typeof account !== "undefined") {
        await client.collectFaucetTokens(data.faucetPackage);
      } else {
        await client.createAccount({
          faucetPackage: data.faucetPackage,
        });
      }

      toast.close(loadingToast);
      toast({
        title: t("form.claim.success_title"),
        description: t("form.claim.success_description"),
        status: "success",
        duration: 4000,
      });
    } catch (error) {
      console.log(error);
      toast.close(loadingToast);
      toast({
        title: t("form.claim.error_title"),
        description: t("form.claim.error_description"),
        status: "error",
        duration: 4000,
      });
    }

    setLoading(false);
  };

  return (
    <Flex direction="column" gap={4}>
      <Grid templateColumns={"repeat(1, 1fr)"} gap={2}>
        <GridItem display="flex" justifyContent="center" alignItems="center">
          <Box width={"80%"}>
            <Heading as={"h1"} size={"xl"}>
              Vocdoni Tokens Faucet
            </Heading>
            <Text variant="p" mt={10} mb={10}>
              For developing with Vocdoni, you need tokens for certain actions
              (create an election, change election status, etc.). The nº of
              tokens you will need to create an election will be determined by
              different factors lik census size, election duration, election
              params, etc.
            </Text>
          </Box>
        </GridItem>

        <GridItem display="flex" justifyContent="center" alignItems="center">
          <Card width={"80%"}>
            <CardBody>
              <Heading as={"h2"} size={"sm"}>
                Request Tokens
              </Heading>
              <Text variant="p" mb={5} mt={5}>
                To prevent faucet botting, you must connect your web3 wallet and
                sign in. We request read-only access.
              </Text>

              <Flex direction="column" gap={3}>
                {isConnected && (
                  <Flex direction="row" gap="2">
                    <Button
                      type="submit"
                      isLoading={loading}
                      colorScheme="purple"
                      onClick={() => handleSignIn("github")}
                    >
                      <Icon mr={2} as={FaGithub} />
                      {t("Sign In with Github")}
                    </Button>

                    {/* <Button
                      type="submit"
                      isLoading={loading}
                      colorScheme="blackAlpha"
                    >
                      <Icon mr={2} as={FaGoogle} />
                      {t("Sign In with Google")}
                    </Button>

                    <Button
                      type="submit"
                      isLoading={loading}
                      colorScheme="facebook"
                    >
                      <Icon mr={2} as={FaFacebook} />
                      {t("Sign In with Facebook")}
                    </Button>

                    <Button
                      type="submit"
                      isLoading={loading}
                      colorScheme="linkedin"
                    >
                      <Icon mr={2} as={FaLinkedin} />
                      {t("Sign In with LinkedIn")}
                    </Button> */}
                  </Flex>
                )}

                {!isConnected && (
                  <ConnectButton
                    chainStatus="none"
                    showBalance={false}
                    label={t("menu.connect").toString()}
                  />
                )}
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={10}
        >
          <Card width={"80%"}>
            <CardBody>
              <Heading as={"h2"} size={"sm"}>
                General Information
              </Heading>
              <Text variant="p" mb={5} mt={5}>
                When you request dev tokens, you'll receive 250 tokens. <br />
                You can claim from the faucet once every 24 hours.
              </Text>
              <Text variant="p" mb={10}>
                If you need more tokens for developing on top of the Vocdoni
                stack, you can connect with us at tokens (at) vocdoni.io
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
    // <h2>Know more about Vocdoni</h2>
  );
};

export default Home;
