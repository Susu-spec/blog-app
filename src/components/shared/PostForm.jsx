import { Formik, Form, Field } from "formik";
import { Input, Button } from "@chakra-ui/react";
import {  useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { BlockNoteView } from "@blocknote/mantine";
import { HiXCircle } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { LuX } from "react-icons/lu";

export default function PostForm() {
    const navigate = useNavigate();
    const initialValues = {
        content: "",
    };

    const handleSubmit = async (values, actions) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
        }, 1000);
    };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting, setFieldValue, errors, touched }) => {
        const editor = useBlockNote({
          onChange: (editor) => {
            const json = editor.topLevelBlocks;
            setFieldValue("content", JSON.stringify(json));
          },
        });

        return (
          <Form className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h1 className="!text-4xl !font-semibold">
                        Create a New Post
                    </h1>
                    <button className="pointer" onClick={() => navigate(-1)}>
                        <HiXCircle size={48} color="bodyText" />
                    </button>
                </div>

                    {/* BlockNote Editor */}
                <div className="border rounded-lg min-h-[300px] mt-4">
                    <BlockNoteView editor={editor} />
                </div>
            </div>
            {/* Submit */}
            <Button rounded={"lg"} minW="8rem" className="self-end" colorScheme="teal" isLoading={isSubmitting} disabled={!!touched.content} type="submit">
              Upload
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}
