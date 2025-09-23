import PasswordField from "@/components/shared/PasswordField";
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Box, Button, Input, Spinner } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router";
import * as Yup from "yup";

export default function SignupPage() {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState("");
    const [loading, setLoading] = useState(false);
    

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Required"),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    });

    const handleSignup = async (values, actions) => {
        setAuthError("");
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
        });

        if (error) {
            setAuthError(error.message);
            toaster.create({
                title: "Signup failed",
                description: error.message,
                type: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toaster.create({
                title: "Account created!",
                description: "Check your email to confirm your account.",
                type: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/login");
        }

        actions.setSubmitting(false);
        setLoading(false);
    };


    return (
        <div className="min-h-[100dvh] flex flex-col justify-center">
            <Box 
                minW={{
                    base: "90%",
                    sm: "90%",
                    md: "25rem",
                    lg: "30rem",
                }} 
                marginY="auto" 
                marginX="auto" 
                padding={6} 
                boxShadow="lg" 
                height="100%"
                borderRadius="2xl"
                backgroundColor="buttonBg"
                display="flex"
                flexDir="column"
                gap={4}
            >
                <Formik
                    initialValues={{ name: "", email: "", password: "", confirmPassword: ""}}
                    validationSchema={SignupSchema}
                    onSubmit={handleSignup}
                    >
                        {({ isSubmitting, isValid, dirty, errors, touched }) => {
                            return (
                                <Form className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="!text-3xl !font-semibold !font-montserrat">
                                            Create an account
                                        </h1>
                                        <p className="text-[.625rem] !font-montserrat">Please input your details</p>
                                    </div>

                                    <div className="flex flex-col gap-3 items-center">
                                        <Field name="name">
                                            {({ field }) => (
                                            <FormControl isInvalid={!!errors.name && touched.name} className="flex flex-col gap-2 w-full">
                                                <FormLabel htmlFor="name" className="!font-montserrat">Name</FormLabel>
                                                <Input
                                                    {...field} 
                                                    id="name"
                                                    type="text" 
                                                    placeholder="Your Preferred Author Name" 
                                                    height="3rem"
                                                    borderRadius="lg"
                                                />
                                                <FormErrorMessage className="text-red-300 !text-xs !font-montserrat">
                                                    {errors.name}
                                                </FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                         <Field name="email">
                                            {({ field }) => (
                                            <FormControl isInvalid={!!errors.email && touched.email} className="flex flex-col gap-2 w-full">
                                                <FormLabel htmlFor="email" className="!font-montserrat">Email</FormLabel>
                                                <Input
                                                    {...field} 
                                                    id="email" 
                                                    type="email" 
                                                    placeholder="Email" 
                                                    height="3rem"
                                                    borderRadius="lg"
                                                />
                                                <FormErrorMessage className="text-red-300 !text-xs !font-montserrat">
                                                    {errors.email}
                                                </FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                        <Field name="password">
                                            {({ field }) => (
                                            <FormControl isInvalid={!!errors.password && touched.password} className="flex flex-col gap-2 w-full">
                                                <FormLabel htmlFor="password" className="!font-montserrat">
                                                    Password
                                                </FormLabel>
                                                <PasswordField {...field} placeholder="Password" />
                                                <FormErrorMessage className="text-red-300 !text-xs !font-montserrat">
                                                    {errors.password}
                                                </FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                        <Field name="confirmPassword">
                                            {({ field }) => (
                                            <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword} className="flex flex-col gap-2 w-full">
                                                <FormLabel htmlFor="confirmPassword" className="!font-montserrat">
                                                    Confirm Password
                                                </FormLabel>
                                                <PasswordField {...field} placeholder="Confirm Password" />
                                                <FormErrorMessage className="text-red-300 !text-xs !font-montserrat">
                                                    {errors.confirmPassword}
                                                </FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                    </div>
                                    {authError && (
                                        <div className="text-red-300 !text-xs !font-montserrat">
                                            {authError}
                                        </div>
                                    )}

                                    
                                    <Button
                                        disabled={isSubmitting || !isValid || !dirty}
                                        isLoading={loading || isSubmitting}
                                        width="60%"
                                        marginX="auto"
                                        borderRadius="md"
                                        boxShadow="lg"
                                        className="!font-montserrat"
                                        type="submit"
                                        >
                                            {isSubmitting ? 
                                                <p className="flex items-center">
                                                    <Spinner size="sm" mr={4} />
                                                    Creating...
                                                </p> : 
                                                "Create"
                                            }
                                    </Button>
                                </Form>
                            )
                        }}
                    </Formik>
            </Box>
        </div>
    )
}