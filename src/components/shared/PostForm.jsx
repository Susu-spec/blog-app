import { Formik, Form, Field } from "formik";
import { 
  Input, 
  Button, 
  Spinner, 
  Box, 
  Flex, 
  Grid, 
  GridItem, 
  VStack, 
  Image, 
  Progress, 
  Textarea,
  Text
} from "@chakra-ui/react";
import {  useBlockNote, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { HiXCircle } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { LuX } from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { toaster } from "../ui/toaster";
import React, { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { FormLabel } from "@chakra-ui/form-control";

export default function PostForm({ post }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const initialValues = {
    id: post?.id || "",
    title: post?.title || "",
    description: post?.description || "",
    cover_image: post?.cover_image || null,
    content: post?.content || "",
  };

  const isEdit = Boolean(post);
  const editor = useBlockNote();

  const handleFileChange = (e) => {
    setFileUploading(true);
    setTimeout(() => {
      setFileUploading(false);
    }, 2000);
  }

  const handleSubmit = async (values, actions) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const user = data?.user;

      if (!user) {
        console.error("User not signed in");
        throw new Error("Not authenticated");
      }

      let coverUrl = post?.cover_image || null;

      // Upload cover image if it's a file
      if (values.cover_image instanceof File) {
        const file = values.cover_image;
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("post-covers")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("post-covers")
          .getPublicUrl(filePath);

        coverUrl = data.publicUrl;
      }

      let response;
      if (values.id) {
        // update
        response = await supabase
          .from("posts")
          .update({
            title: values.title,
            description: values.description,
            cover_image: coverUrl,
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
              title: values.title,
              description: values.description,
              cover_image: coverUrl,
              content: values.content,
              author_id: user.id,
              created_at: new Date().toISOString(),
            },
          ])
          .select();
      }

      if (response.error) throw response.error;

      toaster.create({
        title: values.id ? "Post updated" : "Post created",
        description: "Redirecting to posts...",
        type: "info",
      });

      actions.setSubmitting(false);
      navigate("/posts");
    } catch (error) {
      console.error("Error saving post:", error.message);
      actions.setSubmitting(false);
      toaster.create({
        title: "Error",
        description: error.message,
        type: "error",
      });
    }
    setLoading(false);
  };


  return (
    <Formik 
      initialValues={initialValues} 
      onSubmit={handleSubmit}
    >
      {({ 
        values, 
        isSubmitting, 
        setFieldValue, 
        errors, 
        touched 
      }) => {

        return (
          <Form>
            <Box
              width="100%" 
              height="100%" 
              minH={"400px"}
              shadow="2xl"
              borderColor="formBorder"
              rounded="lg"
              p={6}
              borderWidth="1px"
              display="flex"
              flexDir="column"
              gap={6}
              pos="relative">
              <div className="flex justify-between items-center">
                <h1 className="!text-2xl md:!text-4xl !font-semibold">
                    {isEdit ? "Update Post" : "Create a New Post"}
                </h1>
                <button 
                  className="cursor-pointer" 
                  onClick={() => navigate(-1)} 
                  type="button"
                  aria-label="Close">
                    <HiXCircle size={48} color="bodyText" />
                </button>
            </div>
            <Grid
              templateColumns={{ base: "1fr", md: "3fr 1.5fr" }}
              gap={{
                base: 8,
                md: 5
              }}
              alignItems="center"
              width="100%" 
              height="100%"
            >
              <GridItem
                width="100%" 
                height="100%" 
                order={{ base: 2, md: 1 }}
                overflow="hidden"
                alignSelf="stretch"
              >
                <Flex direction="column" gap={2} height="100%">
                    <FormLabel
                      fontWeight={500}
                      color="buttonText"
                      htmlFor="description"
                    >
                      Post content
                    </FormLabel>
                    {/* BlockNote Editor */}
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
                      <BlockNoteView 
                        editor={editor} 
                        onChange={() => {
                          const json = editor.topLevelBlocks;
                          setFieldValue("content", JSON.stringify(json));
                      }}/>
                    </Box>
                </Flex>
              </GridItem>

              <GridItem alignSelf="self-start" order={{ base: 1, md: 2 }}>
                <Flex direction="column" gap={8}>

                  {/* Title */}
                  <Flex direction="column" gap={2} >
                    <FormLabel
                      fontWeight={500}
                      color="buttonText"
                      htmlFor="title"
                    >
                      Post title
                    </FormLabel>
                    <Textarea
                      borderWidth="1px" 
                      borderColor="formBorder"
                      rounded="lg"
                      p={4}
                      spacing={4}
                      minH={{
                        base: "10rem",
                        md: "16.875rem"
                      }}
                      shadow="2xl"
                      name="500"
                    />
                  </Flex>


                  {/* Description */}
                  <Flex direction="column" gap={2} >
                    <FormLabel
                      fontWeight={500}
                      color="buttonText"
                      htmlFor="description"
                    >
                      Post description
                    </FormLabel>
                    <Textarea
                      borderWidth="1px" 
                      borderColor="formBorder"
                      rounded="lg"
                      p={4}
                      spacing={4}
                      minH={{
                        base: "10rem",
                        md: "16.875rem"
                      }}
                      shadow="2xl"
                      name="description"
                    />
                  </Flex>


                  {/* Cover Image  */}
                  <Flex direction="column" gap={2} >
                    <FormLabel
                      fontWeight={500}
                      color="buttonText"
                      htmlFor="description"
                    >
                      Post cover image
                    </FormLabel>
                    <VStack
                      borderWidth="1px" 
                      borderColor="formBorder"
                      rounded="lg"
                      p={4}
                      spacing={4}
                      cursor="pointer"
                      shadow="2xl"
                    >

                      <Box w="100%" h="200px" bg="buttonText" rounded="md">
                        {!values?.cover_image ? (fileUploading ? 
                            <Box 
                                width="100%" 
                                height="100%" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                              >
                                <Progress.Root width="30%" value={null} radius="md">
                                  <Progress.Track borderRadius="md" bg="buttonBg">
                                    <Progress.Range borderRadius="lg" bg="buttonActiveText"/>
                                  </Progress.Track>
                                </Progress.Root>
                              </Box> :
                            <Box 
                                textAlign="center" 
                                pt={20} 
                                color="buttonBg" 
                                fontFamily="'Montserrat', sans-serif"
                                fontWeight={500}
                              >
                                Click on the text below to select a cover image for your Post.
                              </Box>
                        ) : (
                          <VStack spacing={2} height="100%">
                            {fileUploading ? 
                              <Box 
                                width="100%" 
                                height="100%" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                              >
                                <Progress.Root width="30%" value={null} radius="md">
                                  <Progress.Track borderRadius="md" bg="buttonBg">
                                    <Progress.Range borderRadius="lg" bg="buttonActiveText"/>
                                  </Progress.Track>
                                </Progress.Root>
                              </Box> :
                              <Image
                                src={URL.createObjectURL(values.cover_image)}
                                alt={values?.cover_image?.name}
                                height="100%"
                                mx="auto"
                                rounded="md"
                                objectFit="cover"
                              />
                            }
                          </VStack>
                        )}
                      </Box>
                      <Input
                        type="file"
                        name="cover_image"
                        accept="images/*"
                        onChange={(e) => {
                          const selectedImage = e.target.files[0];
                          setFieldValue("cover_image", selectedImage);
                          handleFileChange(e)
                        }}
                        variant="filled"
                        cursor='pointer'
                      />
                    </VStack>
                  </Flex>
                </Flex>
              </GridItem>
            </Grid>

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
        </Form>
        );
      }}
    </Formik>
  );
}
