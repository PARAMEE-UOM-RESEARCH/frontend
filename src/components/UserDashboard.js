import React, { useEffect, useRef, useState } from "react";
import { Image, Layout, Menu, theme } from "antd";
import { navItems } from "./helpers/helper";
import TinySliderComponent from "./DashboardSubComponents/TinySlider";
import GettingStarted from "./DashboardSubComponents/GettingStarted";
const { Header, Content, Footer, Sider } = Layout;

const UserDashboard = ({ location }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [menuItem, setMenuItem] = useState("1");
  const getStartedRef = useRef();

  useEffect(() => {}, []);

  const handleMenuItems = ({ key }) => {
    setMenuItem(key);
  };

  const handleFocus = () => {
    getStartedRef.current?.focus();
    getStartedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className=" h-auto"
      >
        <div className="demo-logo-vertical" />
        <Image src="https://i.ibb.co/5nhZ75K/99dc640e-21ac-45fd-bfed-2e61f0d198a2-removebg-preview.png" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={navItems}
          onSelect={handleMenuItems}
          className=" mt-10"
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div
            className=" text-3xl mt-3 text-center text-[#650D26] font-bold"
            style={{ fontFamily: "Montserrat Alternates" }}
          >
            InstaStay Hotel Management System
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {menuItem == 1 ? (
              <>
                <GettingStarted handleFocus={handleFocus} />
                <TinySliderComponent ref={getStartedRef} />
              </>
            ) : (
              <></>
            )}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Design ©{new Date().getFullYear()} Created by InstaStay
        </Footer>
      </Layout>
    </Layout>
  );
};
export default UserDashboard;
