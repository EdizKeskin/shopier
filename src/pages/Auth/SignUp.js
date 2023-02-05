import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Flex,
  FormControl,
  Box,
  Heading,
  Button,
  Alert,
  AlertIcon,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  IconButton,
  ButtonGroup,
  Text,
  InputRightElement,
  InputGroup,
  FormErrorMessage,
  AlertDescription,
} from "@chakra-ui/react";
import altogic from "../../api/altogic";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { Formik } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { usePreferences } from "../../context/preferencesContext";

function SignUp() {
  const bg = useColorModeValue("gray.100", "gray.700");
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { animations } = usePreferences();

  const handleShow = () => setShow(!show);
  const handleShowConfirm = () => setShowConfirm(!showConfirm);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Required field."),
  });

  async function signin(provider) {
    const { errors } = altogic.auth.signInWithProvider(provider, {
      admin: false,
    });

    if (errors) return setError(errors);
  }

  async function handleSubmit(values, bag) {
    const { name, email, password } = values;
    const { errors, user } = await altogic.auth.signUpWithEmail(
      email,
      password,
      {
        name: name,
        admin: false,
      }
    );

    if (errors) return setError(errors);

    if (user.emailVerified === false) {
      navigate("/verification");
    } else {
      navigate("/");
    }
    bag.resetForm();
  }

  return (
    <Flex
      align="center"
      justifyContent="center"
      data-aos={animations === true ? "fade-up" : "none"}
    >
      <Flex align={"center"} justify={"center"} mt={6}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} alignItems={"center"} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign Up
            </Heading>
          </Stack>
          {state && state.errors && (
            <Alert status="error" borderRadius={"md"}>
              <AlertIcon />
              <AlertDescription>This email is already in use.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert status="error" borderRadius={"md"}>
              <AlertIcon />
              <AlertDescription>{error.items[0].message}</AlertDescription>
            </Alert>
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              passwordConfirm: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              errors,
              touched,
              values,
              isSubmitting,
              isValid,
            }) => (
              <Box
                bgColor={bg}
                backdropFilter={"blur(2px)"}
                boxShadow="dark-lg"
                p="10"
                mt="100px"
                width={{ base: "100%", md: "500px" }}
                mx="10px"
                mb={{ base: "20px", md: "0" }}
                borderRadius="lg"
                maxHeight={"fit-content"}
              >
                <Stack spacing={4}>
                  <form onSubmit={handleSubmit}>
                    <FormControl
                      id="name"
                      isRequired
                      isInvalid={touched.name && errors.name}
                    >
                      <FormLabel>Username</FormLabel>
                      <Input
                        type="text"
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        isInvalid={touched.name && errors.name}
                        placeholder="Enter your username"
                      />

                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      id="email"
                      mt={3}
                      isRequired
                      isInvalid={touched.email && errors.email}
                    >
                      <FormLabel>Email address</FormLabel>
                      <Input
                        type="email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        isInvalid={touched.email && errors.email}
                        placeholder="Enter your email"
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      id="password"
                      mt={3}
                      isRequired
                      isInvalid={touched.password && errors.password}
                    >
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={show ? "text" : "password"}
                          value={values.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          isInvalid={touched.password && errors.password}
                          placeholder="Enter your password"
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            bg="transparent !important"
                            justifyContent="flex-end"
                            onClick={handleShow}
                            icon={
                              show ? (
                                <AiOutlineEyeInvisible size={"25px"} />
                              ) : (
                                <AiOutlineEye size={"25px"} />
                              )
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      id="passwordConfirm"
                      mt={1}
                      isRequired
                      isInvalid={
                        touched.passwordConfirm && errors.passwordConfirm
                      }
                    >
                      <FormLabel>Password Confirm</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirm ? "text" : "password"}
                          value={values.passwordConfirm}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          isInvalid={
                            touched.passwordConfirm && errors.passwordConfirm
                          }
                          placeholder="Confirm your password"
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            bg="transparent !important"
                            justifyContent="flex-end"
                            onClick={handleShowConfirm}
                            icon={
                              showConfirm ? (
                                <AiOutlineEyeInvisible size={"25px"} />
                              ) : (
                                <AiOutlineEye size={"25px"} />
                              )
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <Stack spacing={10}>
                      <Flex direction="column">
                        <Button
                          bg={"blue.400"}
                          color={"white"}
                          _hover={{
                            bg: "blue.500",
                          }}
                          mt={3}
                          type="submit"
                          disabled={isSubmitting || !isValid}
                        >
                          Sign up
                        </Button>

                        <Link to="/signin">
                          <Button
                            colorScheme="teal"
                            variant="link"
                            width="full"
                            mt={3}
                            color="gray.500"
                            fontSize="sm"
                          >
                            Already have an account?
                          </Button>
                        </Link>
                        <Text fontSize="sm" textAlign="center">
                          Or sign in with
                        </Text>
                        <ButtonGroup
                          justifyContent={"center"}
                          textAlign={"center"}
                          mt={3}
                        >
                          <IconButton
                            colorScheme="teal"
                            onClick={(event) => {
                              event.preventDefault();
                              signin("google");
                            }}
                            icon={<FaGoogle />}
                          />

                          <IconButton
                            colorScheme="teal"
                            onClick={(event) => {
                              event.preventDefault();
                              signin("github");
                            }}
                            icon={<FaGithub />}
                          />

                          <IconButton
                            colorScheme="teal"
                            onClick={(event) => {
                              event.preventDefault();
                              signin("discord");
                            }}
                            icon={<FaDiscord />}
                          />
                        </ButtonGroup>
                      </Flex>
                    </Stack>
                  </form>
                </Stack>
              </Box>
            )}
          </Formik>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default SignUp;
