import React, { useEffect, useState } from "react";
import { Table, Card, Avatar, Tag, Button, Row, Col, Tooltip } from "antd";
import { ExportOutlined, SettingFilled } from "@ant-design/icons";
import axios from "axios";
import PieChartComponent from "./DashboardSubComponents/PieChartComponent";
import moment from "moment";
import ExcelJS from 'exceljs';
const { REACT_APP_BASE_URL } = process.env;

const columns = [
  {
    title: "Profile",
    dataIndex: "picture",
    key: "picture",
    render: (text, record) => <Avatar src={record.picture} />,
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Given Name",
    dataIndex: "given_name",
    key: "given_name",
  },
  {
    title: "Family Name",
    dataIndex: "family_name",
    key: "family_name",
  },
  {
    title: "Verified",
    dataIndex: "verified_email",
    key: "verified_email",
    render: (verified) => (
      <Tag color={verified ? "green" : "red"}>
        {verified ? "Verified" : "Unverified"}
      </Tag>
    ),
  },
];

const transacionColumns = [
  {
    title: "Customer Email",
    dataIndex: "customer_email",
    key: "customer_email",
  },
  {
    title: "Customer Name",
    dataIndex: "customer_name",
    key: "customer_name",
  },
  {
    title: "Hotel Name",
    dataIndex: "hotel_name",
    key: "hotel_name",
  },
  {
    title: "City",
    dataIndex: "city_in_trans",
    key: "city_in_trans",
  },
  {
    title: "Check-in From",
    dataIndex: "checkin_from",
    key: "checkin_from",
  },
  {
    title: "Check-in Until",
    dataIndex: "checkin_until",
    key: "checkin_until",
  },
  {
    title: "Check-out From",
    dataIndex: "checkout_from",
    key: "checkout_from",
  },
  {
    title: "Check-out Until",
    dataIndex: "checkout_until",
    key: "checkout_until",
  },
  {
    title: "Total Amount",
    dataIndex: "total_amount",
    key: "total_amount",
  },
  {
    title: "Currency Code",
    dataIndex: "currencycode",
    key: "currencycode",
  },
  {
    title: "Transaction Date",
    dataIndex: "transaction_date",
    key: "transaction_date",
  },
  {
    title: "Transaction Time",
    dataIndex: "transaction_time",
    key: "transaction_time",
  },
  {
    title: "Booked Date",
    dataIndex: "bookedDate",
    key: "bookedDate",
  },
  {
    title: "Booked Time",
    dataIndex: "bookedTime",
    key: "bookedTime",
  },
  {
    title: "Number of Days",
    dataIndex: "noOfDays",
    key: "noOfDays",
  },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${REACT_APP_BASE_URL}/get-users`)
        .then((res) => setUsers(res.data.users));
      await axios
        .get(`${REACT_APP_BASE_URL}/get-transactions`)
        .then((res) => setTransactions(res.data.transactions));
      await axios
        .get(`${REACT_APP_BASE_URL}/get-favs`)
        .then((res) => setFavourites(res.data.favs));
      await axios
        .get(`${REACT_APP_BASE_URL}/get-chats`)
        .then((res) => setChats(res.data.chats));
    })();
  }, []);

  const commonExportButton = (dataSource, columns, type) => {
    return (
      <Tooltip title="Export as Excel">
        <Button
          className=" float-end"
          onClick={() => exportAsExcel(dataSource, columns, type)}
        >
          <ExportOutlined />
        </Button>
      </Tooltip>
    );
  };

  const exportAsExcel = async (data, columns, type) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    // Create header row with styles
    const headerRow = worksheet.addRow(columns.map(col => col.title));
    
    // Apply styles to each header cell
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF000000' } }; // Black text
      cell.fill = {
        type: 'pattern', // Use 'pattern' for the fill type
        pattern: 'solid', // Solid pattern
        fgColor: { argb: 'FFDDDDDD' } // Light gray background
      };
    });
  
    // Add data rows
    data.forEach(row => {
      worksheet.addRow(columns.map(col => row[col.dataIndex]));
    });
  
    // Set column widths (optional)
    columns.forEach((col, index) => {
      worksheet.getColumn(index + 1).width = 20; // Set each column width
    });
  
    // Trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-${moment().format('DD-MMM-YYYY HH-mm-ss A')}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-6">
      <h1
        className="text-3xl mt-3  text-[#650D26] font-bold"
        style={{ fontFamily: "Montserrat Alternates" }}
      >
        Admin Dashboard <SettingFilled />
        <Button
          className=" float-end"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </h1>

      {/* Users Table */}
      <Card title="Users" className="shadow-lg">
        <Row gutter={16}>
          <Col span={16}>
            {commonExportButton(users, columns, "users-list")}
            <Table
              dataSource={users}
              columns={columns}
              rowKey="id"
              scroll={{ x: true }}
            />
          </Col>
          <Col span={8}>
            <center>
              <PieChartComponent
                users={users.length}
                trans={transactions.length}
                fav={favourites.length}
                chats={chats.length}
              />
            </center>
          </Col>
        </Row>
      </Card>

      {/* Purchase History Table */}
      <Card title="Purchase History Insights" className="shadow-lg mt-6">
        {commonExportButton(
          transactions,
          transacionColumns,
          "transactions-list"
        )}
        <Table
          dataSource={transactions}
          columns={transacionColumns}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
