import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Button, Flex, Input, Stack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

export default function PostForm() {
    const initialValues = {
        title: "",
        subtitle: "",
        img: "",
        summary: "",
        content: ""
    }

    const handleSubmit = (values, actions) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
        }, 1000)
    }
    
    return (
       <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {(props) => (
                <Form>
                    <Field name="title" validate={
                        (value) => {
                            let error;
                            if (!value) {
                                error= "Title is required"
                            }
                        }
                    }>
                        {({ field, form }) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                                <FormLabel>Title</FormLabel>
                                <Input {...field} placeholder="Title" />
                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>

                            </FormControl>
                        )}
                    </Field>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        isLoading={props.isSubmitting}
                        type='submit'
                    >
                        Submit
                    </Button>
                </Form>
            )}

       </Formik>
    )
}