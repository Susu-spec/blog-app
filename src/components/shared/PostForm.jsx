import { Formik, Form, Field } from "formik";
import { Input, Button, Spinner, Box, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import {  useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { HiXCircle } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { LuX } from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { toaster } from "../ui/toaster";
import React, { useState } from "react";

export default function PostForm({ post }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([])

    const initialValues = {
        content: post?.content || "",
    };
    const isEdit = Boolean(post);

    const handleFileChange = (e) => {
      if (e.target.files) {
        setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
      }
    }
  const handleSubmit = async (values, actions) => {
    setLoading(true);

    try {
      const user = supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let response;

      if (values.id) {
        // update
        response = await supabase
          .from("posts")
          .update({
            // title: values.title,
            cover_image: values.cover_image,
            content: values.content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", values.id)
          .select();
      } else {
        // insert
        response = await supabase
          .from("posts")
          .insert([
            {
              // title: values.title,
              cover_image: values.cover_image,
              content: values.content,
              author_id: user.data.user.id,
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

          <Form>
            <Grid
              templateColumns={{ base: "1fr", md: "3fr 1fr" }}
              gap={4}
              alignItems="center"
              width="100%" 
              height="100%" 
              minH={"400px"}
            >
              <GridItem
                width="100%" 
                height="100%" 
              >
                <Box 
                  width="100%" 
                  height="100%" 
                  borderWidth="1px" 
                  borderColor="formBorder"
                  rounded="lg" 
                  p={6} 
                  display="flex" 
                  flexDir="column"
                  justifyContent="space-between"
                  shadow="2xl"
                  minH="400px"
                >
                  
                  <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                          <h1 className="!text-4xl !font-semibold">
                              {isEdit ? "Update Post" : "Create a New Post"}
                          </h1>
                          <button 
                            className="pointer" 
                            onClick={() => navigate(-1)} 
                            type="button"
                            aria-label="Close">
                              <HiXCircle size={48} color="bodyText" />
                          </button>
                      </div>
                  </div>
                  {/* Submit */}
                  <Button 
                    rounded={"lg"} 
                    minW="8rem" 
                    className="self-end" 
                    colorScheme="teal" 
                    isLoading={loading || isSubmitting} 
                    type="submit"
                    display="flex"
                    gap={2}
                    alignItems={"center"}
                  >
                    {loading && <Spinner size={"sm"} mr={2} />}
                    {isEdit ? "Update" : "Create"}
                  </Button>
                </Box>
              </GridItem>

              <GridItem alignSelf="self-start">
                {/* Cover Image  */}
                <VStack
                  borderWidth="1px" 
                  borderColor="formBorder"
                  rounded="lg"
                  p={4}
                  spacing={4}
                  cursor="pointer"
                  shadow="2xl" 
                >
                  <Box w="100%" h="200px" bg="gray.100" rounded="md">
                    {uploadedFiles.length === 0 ? (
                      <Box textAlign="center" pt={20}>No images yet</Box>
                    ) : (
                      <VStack spacing={2}>
                        {uploadedFiles.map((file, i) => (
                          <Box key={i} w="full" p={2} bg="gray.200" rounded="md">
                            {file.name}
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </Box>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    variant="filled"
                  />
                </VStack>
              </GridItem>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
