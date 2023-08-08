import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaSignInAlt } from "react-icons/fa";

interface FormFields {
  address: string;
}

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "",
    },
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const required = {
    value: true,
    message: "Field is required",
  };
  const maxLength = {
    value: 40,
    message: "Field is too long",
  };

  const onSubmit = async (values: FormFields) => {
    setLoading(true);
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
                <FormControl isRequired isInvalid={!!errors.address}>
                  <Input
                    type="text"
                    {...register("address", { required, maxLength })}
                    mb={1}
                    placeholder="Wallet address that will receive the VOC tokens..."
                  />
                  {errors.address && (
                    <FormErrorMessage>
                      {errors.address?.message?.toString()}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <Button type="submit" isLoading={loading} colorScheme="green">
                  <Icon mr={2} as={FaSignInAlt} />
                  {t("Sign In")}
                </Button>
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
