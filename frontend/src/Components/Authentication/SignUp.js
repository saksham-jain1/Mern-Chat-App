import React, { useState } from "react";
import {
  InputRightElement,
  useToast,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();



    const showHandler = () => {
      setShow(!show);

      const type = show ? "text" : "password";
      document.getElementById("password").setAttribute("type", type);
      document.getElementById("confirmPassword").setAttribute("type", type);
    };

  const postDetails = (pics) => {
    setLoading(true);
    if(pics === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if(pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "chatting-app");
      fetch("https://api.cloudinary.com/v1_1/chatting-app/image/upload", {
        method: 'post',
        body: data,
      }).then((res) => res.json()).then(data => {
        setPic(data.url.toString());
        setLoading(false);
      }).catch((err) => {
        console.log(err);
        setLoading(false);
      })
    } else
    {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fil all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if(password!==confirmPassword) {
      toast({
        title: "Passwords don't Maatches",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const {data} = await axios.post("/api/user",{name,email,password,pic},config);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem('userInfo',JSON.stringify(data));

      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          id="name"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <FormLabel>Email</FormLabel>
        <Input
          id="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
          id="password"
            type={"password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
          id="confirmPassword"
            type={"password"}
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          id="pic"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
