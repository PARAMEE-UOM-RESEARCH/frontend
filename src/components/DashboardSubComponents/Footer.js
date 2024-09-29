import { Footer as FooterComponent } from "antd/es/layout/layout";
import React from "react";

const Footer = () => {
  return (
    <FooterComponent>
      <center> Design ©{new Date().getFullYear()} Created by VacationWay.com</center>
    </FooterComponent>
  );
};

export default Footer;
