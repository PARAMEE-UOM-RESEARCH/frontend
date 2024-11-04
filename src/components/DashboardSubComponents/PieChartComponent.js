import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = ({ fav, chats, users, trans }) => {
  const halsteadData = [
    { name: "Favourites", value: fav },
    { name: "Chats", value: chats },
    { name: "Users", value: users },
    { name: "Transactions", value: trans },
  ];

  console.log("halsteadData", halsteadData);
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={halsteadData}
        dataKey="value"
        outerRadius={150}
        fill="#8884d8"
        label
        // labelLine={false} // Disable label lines
      >
        {halsteadData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
export default PieChartComponent;
