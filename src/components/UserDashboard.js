import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Image, Layout, Menu, theme } from "antd";
import { navItems } from "./helpers/helper";
import TinySliderComponent from "./DashboardSubComponents/TinySlider";
import GettingStarted from "./DashboardSubComponents/GettingStarted";
import Hotels from "./DashboardSubComponents/Hotels";
import { useLocalStorageListner } from "./customHooks/useLocalStorageListner";
import { Checkout } from "./DashboardSubComponents/Checkout";
import FavouritePlaces from "./DashboardSubComponents/FavouritePlaces";
import AdminLoginModal from "./DashboardSubComponents/AdminLoginModal";
import AdminLoginForm from "./DashboardSubComponents/AdminLoginForm";
import TouristsPlaces from "./DashboardSubComponents/TouristsPlaces";

const { Header, Content, Sider } = Layout;

const UserDashboard = ({ location }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [menuItem, setMenuItem] = useState("1");
  const getStartedRef = useRef();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {}, []);

  const handleMenuItems = ({ key }) => {
    setMenuItem(key);
  };

  const handleFocus = () => {
    getStartedRef.current?.focus();
    getStartedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const profile = useLocalStorageListner("profile");
  console.log("profile", profile);

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
        <Image src="https://i.ibb.co/WfVB0C2/99dc640e-21ac-45fd-bfed-2e61f0d198a2-removebg-preview.png" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={profile ? navItems : navItems.slice(0, 4)}
          onSelect={handleMenuItems}
          className=" mt-10 h-dvh"
          selectedKeys={menuItem}
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
            className="text-3xl mt-3 text-center text-[#650D26] font-bold"
            style={{ fontFamily: "Montserrat Alternates" }}
          >
            VacationWay.com
            <sup
              className="text-sm align-top ml-1"
              style={{
                color: "#FF5733",
                fontSize: "0.75em",
                marginLeft: "8px",
                verticalAlign: "super",
              }}
            >
              {location.countryCode}
            </sup>
            <div className=" float-end">
              <span
                className=" text-sm cursor-pointer"
                onClick={() => setIsAdminModalOpen(true)}
              >
                <u>Admin Login</u>
              </span>
              {profile && (
                <>
                  &nbsp;&nbsp;
                  <Image
                    src={profile.picture}
                    width={40}
                    height={40}
                    className=" float-end"
                    title={"Logged in as " + profile.name}
                  />
                  &nbsp;&nbsp;
                  <Button
                    className=" float-end"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
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
            ) : menuItem == 2 ? (
              <Hotels
                location={location}
                profile={profile}
                setMenuItem={setMenuItem}
              />
            ) : menuItem == 3 ? (
              <Hotels
                location={location}
                profile={profile}
                setMenuItem={setMenuItem}
                type={"restaurant"}
              />
            ) : menuItem == 4 ? (
              <TouristsPlaces />
            ) : menuItem == 5 ? (
              <FavouritePlaces profile={profile} />
            ) : (
              <>
                <Checkout menuItem={menuItem} profile={profile} />
              </>
            )}
          </div>
        </Content>
        <AdminLoginModal
          title="Admin Login"
          open={isAdminModalOpen}
          setIsAdminModalOpen={setIsAdminModalOpen}
          footer={false}
          onCancel={() => setIsAdminModalOpen(false)}
          destroyOnClose={true}
        >
          <AdminLoginForm
            form={form}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        </AdminLoginModal>
      </Layout>
    </Layout>
  );
};
export default UserDashboard;
