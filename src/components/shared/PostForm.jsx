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
import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { FormLabel } from "@chakra-ui/form-control";
import { mixed, object, string } from "yup";

/**
 * Validation schema for the post creation/edit form.
 *
 * Validates:
 * - `title`: minimum 3 characters
 * - `description`: minimum 3 characters
 * - `content`: minimum 10 characters
 * - `cover_image`: must be an image file
 *
 * @type {import('yup').ObjectSchema<{
 *   title: string,
 *   description: string,
 *   content: string,
 *   cover_image: File
 * }>}
 */
export const postFormSchema = object({
  title: string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  description: string()
    .min(3, "Description must be at least 3 characters")
    .required("Description is required"),
  content: string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  cover_image: mixed()
    .required("Cover image URL is required")
    .test("fileType", "Only image files are allowed", (value) => {
      return !value || (value && value?.type?.startsWith("image/"));
    }),
});

/**
 * PostForm component — handles creating and editing blog posts.
 *
 * Integrates form validation, image upload, and content editing using BlockNote.
 * The same component is used for both "create" and "edit" flows, depending on
 * whether a `post` prop is provided.
 *
 * @component
 * @example
 * return (
 *   <PostForm post={existingPost} />
 * )
 *
 * @param {Object} props
 * @param {{
 *   id?: string,
 *   title?: string,
 *   description?: string,
 *   content?: string,
 *   cover_image?: string | File
 * }} [props.post] - The post to edit; if not provided, a new post is created.
 *
 * @returns {JSX.Element} The post form UI.
 */


export default function PostForm({ post }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const editor = useBlockNote();

  /** @type {{ id: string, title: string, description: string, cover_image: string | File, content: string }} */
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
        description: values.id ? "Redirecting to post..." : "Redirecting to posts...",
        type: "info",
      });

      actions.setSubmitting(false);
      values.id ? navigate(`/posts/${values.id}`) : navigate("/my-posts");
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

  useEffect(() => {
    if (post?.content) {
      try {
        const parsed = JSON.parse(post.content);
        editor.replaceBlocks(editor.topLevelBlocks, parsed);
      } catch (err) {
        console.error("Invalid content JSON:", err);
      }
    }
  }, [post?.content, editor]);


  return (
    <Formik 
      initialValues={initialValues}
      validationSchema={postFormSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ 
        values, 
        handleChange,
        handleBlur,
        isSubmitting, 
        setFieldValue, 
        errors, 
        touched,
        isValid,
        dirty
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
                    {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
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
                      name="title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                    />
                    {errors.title && touched.title && <p className="text-red-500 text-xs">{errors.title}</p>}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
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
                                src={isEdit ? values.cover_image : URL.createObjectURL(values.cover_image)}
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
                     {errors.cover_image && <p className="text-red-500 text-xs">{errors.cover_image}</p>}
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
              disabled={!(isValid && dirty)}
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
