import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
const { REACT_APP_BASE_URL } = process.env;

const AdminLoginForm = ({ form, setPasswordVisible, passwordVisible }) => {
  const navigate = useNavigate();
  const handleAdminLogin = async () => {
    try {
      const { data } = await axios.post(
        `${REACT_APP_BASE_URL}/admin-login/`,
        form.getFieldsValue()
      );
      localStorage.setItem("admin", JSON.stringify(data.admin));
      notification.success({ message: "Admin Logged in Successfully" });
      navigate("/admin");
    } catch (error) {
      console.log("error", error.response.data.detail);
      notification.error({ message: error.response.data.detail });
    }
  };
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email!" },
          {
            type: "email",
            message: "Please enter a valid email!",
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email pattern
          },
        ]}
        style={{ width: "100%" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
        style={{ width: "100%" }}
      >
        <Input.Password
          type={passwordVisible ? "text" : "password"}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          onClick={() => setPasswordVisible(!passwordVisible)}
        />
      </Form.Item>

      <Form.Item>
        <center>
          <Button
            type="primary"
            className="bg-sky-600"
            onClick={() => form.validateFields().then(() => handleAdminLogin())}
          >
            Login
          </Button>
        </center>
      </Form.Item>
    </Form>
  );
};

export default AdminLoginForm;
