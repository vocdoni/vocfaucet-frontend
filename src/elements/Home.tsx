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
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaSignInAlt } from "react-icons/fa";
import { useAccount } from "wagmi";

interface FormFields {
  address: string;
}

const Home = () => {
  const { handleSubmit } = useForm({
    defaultValues: {
      address: "",
    },
  });
  const { client, account } = useClient();

  const { isConnected, address } = useAccount();
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  // Received code from OAuth provider (github, google, etc.)
  useEffect(() => {
    if (!client.wallet) return;

    const params: URLSearchParams = new URLSearchParams(window.location.search);
    const provider: string | null = params.get("provider");
    const code: string | null = params.get("code");
    const recipient: string | null = params.get("recipient");
    if (!code || !provider || !recipient) return;

    claimTokens(provider, code, recipient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const onSubmit = async (values: FormFields) => {
    if (!isConnected) throw new Error("Wallet not connected");

    setLoading(true);

    try {
      const prov = "github"; // TODO: This should come from the form

      const params: URLSearchParams = new URLSearchParams();
      params.append("provider", prov);
      params.append("recipient", address as string);
      const redirectURL: string = `${window.location.origin}${
        window.location.pathname
      }?${params.toString()}${window.location.hash}`;

      const response = await fetch(
        `${process.env.REACT_APP_FAUCET_URL}/oauth/authUrl/${prov}`,
        {
          method: "POST",
          body: JSON.stringify({
            redirectURL,
          }),
        }
      );
      const url = await response.text();
      // Redirect to the url
      window.location.href = url;
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
      const response = await fetch(
        `${process.env.REACT_APP_FAUCET_URL}/oauth/claim/${provider}/${code}/${recipient}`
      );
      const data = await response.json();

      // Claim the tokens with the SDK
      // if (typeof account !== "undefined") {
      //   const info = await client.collectFaucetTokens(data.faucetPackage);
      //   console.log("Claim tokens info", info);
      // } else {
      //   const info = await client.createAccount(data.faucetPackage);
      //   console.log("Created account with faucetPackage", info);
      // }

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
                To prevent faucet botting, you must sign in with Gmail or
                Github. We request read-only access.
              </Text>

              <Flex
                as="form"
                direction="column"
                onSubmit={handleSubmit(onSubmit)}
                gap={3}
              >
                {isConnected && (
                  <Button type="submit" isLoading={loading} colorScheme="green">
                    <Icon mr={2} as={FaSignInAlt} />
                    {t("Sign In")}
                  </Button>
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
