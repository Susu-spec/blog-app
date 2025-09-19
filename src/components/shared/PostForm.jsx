import { Formik, Form, Field } from "formik";
import { Input, Button, Spinner } from "@chakra-ui/react";
import {  useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { HiXCircle } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { LuX } from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { toaster } from "../ui/toaster";
import { useState } from "react";

export default function PostForm({ post }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const initialValues = {
        content: post?.content || "",
    };
    const isEdit = Boolean(post);

  const handleSubmit = async (values, actions) => {
    setLoading(true);
    try {
      let response;

      if (values.id) {
        response = await supabase
          .from("posts")
          .update({
            title: values.title,
            content: values.content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", values.id)
          .select();
      } else {
        response = await supabase
          .from("posts")
          .insert([
            {
              title: values.title,
              content: values.content,
              created_at: new Date().toISOString(),
            },
          ])
          .select();
      }

      if (response.error) throw response.error;
      
      toaster.create({
          title: isEdit ? "Post updated" : "Post created",
          description: "Redirecting to posts...",
          type: "info",
      })

      actions.setSubmitting(false);
      navigate("/posts");
    } catch (error) {
      console.error("Error saving post:", error.message);
      actions.setSubmitting(false);
      toaster.create({
          title: "Error",
          description: error.message,
          type: "error",
      })
    }
    setLoading(false);
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
                        {isEdit ? "Update Post" : "Create a New Post"}
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
            <Button 
              rounded={"lg"} 
              minW="8rem" 
              className="self-end" 
              colorScheme="teal" 
              isLoading={loading || isSubmitting} 
              // disabled={!!touched.content} 
              type="submit"
              display="flex"
              gap={2}
              alignItems={"center"}
            >
              {loading && <Spinner size={"sm"} mr={2} />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}
