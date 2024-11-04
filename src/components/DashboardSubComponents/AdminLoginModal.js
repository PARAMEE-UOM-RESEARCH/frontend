import { Modal } from "antd";
import React from "react";

const AdminLoginModal = ({ children, ...props }) => {
  return <Modal {...props}>{children}</Modal>;
};

export default AdminLoginModal;
