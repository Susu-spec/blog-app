import { useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function PasswordField({ ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full h-[3rem]">
      <Input
        {...props}
        type={show ? "text" : "password"}
        className="pr-10"
        borderRadius="md"
        height="100%"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        pos="absolute"
        right={2}
        top="35%"
        height="fit"
        className="hover:bg-transparent"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? (
          <LuEyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <LuEye className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
}

