"use client";

import env from "@/config/env";
import React from "react";
import type { FormItemProps, FormProps } from "antd";
import { Button, Card, Divider, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";

import axios, {  isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/maincontext";
import { GoogleOutlined } from "@ant-design/icons";

const formItemLayout: FormProps = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout: FormItemProps = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

interface Formdata {
  username: string;
  email: string;
  password: string;
}

const Loginuser: React.FC = () => {
  const { setUserData } = useGlobalContext();
  const router = useRouter();
  const [form] = useForm();
  const { msg } = useGlobalContext();

  const onFinish = async (values: Formdata) => {
    try {
      const { data } = await axios.post(env.apiBaseUrl + "/auth/login", {
        ...values,
      });

      console.log(data);

      if (!data.body?.accessToken) {
        const err: Error = new Error();
        err.message = "access token not found";
      }
      document.cookie = `accessToken=${data?.body.accessToken}; path=/`;
      setUserData({
        ...data?.body,
      });
      msg.success(data?.message);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      if (isAxiosError(err)) {
        msg.warning(err.response?.data?.message);
      } else {
        msg.warning("Access token not found");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log(env.apiBaseUrl);
      const data = await axios.post(env.apiBaseUrl + "/auth/login/google/url");
      console.log(data.data);
      window.location.href = data.data.url;
    } catch (err) {

      if (isAxiosError(err)) {
        msg.warning(err.response?.data?.message);
      } else {
        console.log(err);
        msg.error("something went wrong");
      }
    }
  };

  return (
    <Card title="Login" className="w-full max-w-md shadow-xl">
      <Form
        {...formItemLayout}
        form={form}
        layout={"vertical"}
        name="user_register"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>

        <Divider plain>or continue with</Divider>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin} // onClick is the event listener
          block
        >
          Continue with Google
        </Button>
      </Form>
    </Card>
  );
};

export default Loginuser;
