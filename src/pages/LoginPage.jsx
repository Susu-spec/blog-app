import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Box, Button, Card, Input, Spinner } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Link, useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState("");
    const [loading, setLoading] = useState(false);


    const LoginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Too short!").required("Required"),
    });


    const handleLogin = async (values, actions) => {
        setAuthError("");
        setLoading(true);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (error) {
            setAuthError(error.message);
            toaster.create({
                title: "Login failed",
                description: error.message,
                type: "error",
            })
        } else {
            navigate("/"); 
        }
        actions.setSubmitting(false);
        setLoading(false);
    };
    return (
        <div className="min-h-[100dvh] flex flex-col justify-center">
            <Box 
                minW={{
                    base: "60%",
                    sm: "20rem",
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
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin} 
                    >
                        {({ isSubmitting, isValid, dirty, errors, touched }) => {
                            
                            return (
                                <Form className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="!text-3xl !font-semibold !font-montserrat">
                                            Login
                                        </h1>
                                        <p className="text-[.625rem] !font-montserrat">Please log in to your account</p>
                                    </div>
                                    

                                    <div className="flex flex-col gap-3 items-center">
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
                                                <FormErrorMessage className="text-red-300 !text-xs !font-montserrat">{errors.email}</FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                        <Field name="password">
                                            {({ field }) => (
                                            <FormControl isInvalid={!!errors.password && touched.password} className="flex flex-col gap-2 w-full">
                                                <FormLabel htmlFor="password" className="!font-montserrat">Password</FormLabel>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    height="3rem"
                                                    borderRadius="lg"
                                                />
                                                <FormErrorMessage className="text-red-300 !text-xs !font-montserrat">{errors.password}</FormErrorMessage>
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
                                                    Logging in...
                                                </p> : 
                                                "Login"
                                            }
                                    </Button>
                                </Form>
                            )}}
                    </Formik>
                <p className="text-center !text-[.625rem]">
                    Haven't registered? 
                    <Link to="/signup" className="!ml-1 !underline">
                        Create an account
                    </Link>
                </p>
            </Box>
        </div>
    )
}