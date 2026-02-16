"use client";

import React from "react";
import type { FormItemProps, FormProps } from "antd";
import { Button, Card, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import api from "@/lib/api/axios";
import useMessage from "antd/es/message/useMessage";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [form] = useForm();
  const [messageApi, contextHolder] = useMessage();
  const onFinish = async (values: Formdata) => {
    try {
      const { data } = await api.get("auth/login", {
        params: values,
      });

      console.log(data);

      if (!data.body?.accessToken) {
        const err: Error = new Error();
        err.message = "access token not found";
      }
      document.cookie = `accessToken=${data?.body.accessToken}; path=/`;
      messageApi.success(data?.messege);
      router.push("/dashboard");

    } catch (err) {
      console.log(err);
      if (isAxiosError(err)) {
        messageApi.warning(err.response?.data?.messege);
      } else {
        messageApi.warning("Access token not found");
      }
    }
  };

  return (
    <>
      {contextHolder}
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
        </Form>
      </Card>
    </>
  );
};

export default Loginuser;
