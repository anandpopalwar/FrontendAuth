"use client";

import React from "react";
import type { FormItemProps, FormProps } from "antd";
import { Button, Card, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/maincontext";

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
  confirm: string;
  email: string;
  password: string;
  username: string;
}

const Registeruser: React.FC = () => {
  const router = useRouter();
  const [form] = useForm();
  const { msg } = useGlobalContext();

  const onFinish = async (values: Formdata) => {
    // console.log("Received values of form: ", values);
    try {
      const url: string = "http://localhost:8000/api/v1/auth/register";
      const res = await axios.post(url, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      console.log(res);
      msg.success(res?.data?.message);

      router.push("/login");
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        msg.warning(err.response?.data?.message);
      }
    }
  };

  return (
    <Card title="Register" className="w-full max-w-md shadow-xl">
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
          name="username"
          label="Username"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

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

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!"),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Registeruser;
