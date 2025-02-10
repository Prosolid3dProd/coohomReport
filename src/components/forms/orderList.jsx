import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";

import { getOrders, getOrderById, fixOrder } from "../../handlers/order";
import { useNavigate } from "react-router";

const OrderList = () => {
  const [initialValues, setInitialValues] = useState([]);

  const navigate = useNavigate();

  const getOrdenes = async () => {
    const result = await getOrders();
    alert("Hola mundo");
    if (result) {
      setInitialValues(result);
    }
  };

  useEffect(() => {
    getOrdenes();
  }, []);

  return (
    <Card>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={3}>
          <b> Ordén Número</b>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <b> Cliente</b>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <b>Tienda</b>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <b> Teléfono</b>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <b> Fecha de creación</b>
        </Col>
      </Row>
      {initialValues &&
        initialValues.map((item, index) => (
          <Row gutter={16} key={index}>
            <Col xs={24} sm={24} md={3}>
              <Typography.Link
                onClick={async () => {
                  try {
                    const result = await getOrderById({ _id: item._id });
                    fixOrder(result);

                    navigate("/Dashboard/Report", { replace: true });
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                {item.orderCode}
              </Typography.Link>
            </Col>
            <Col xs={24} sm={24} md={4}>
              {item.customerName}
            </Col>
            <Col xs={24} sm={24} md={4}>
              {item.userId.name}
            </Col>
            <Col xs={24} sm={24} md={4}>
              {item.phone}
            </Col>
            <Col xs={24} sm={24} md={6}>
              {item.createdAt}
            </Col>
          </Row>
        ))}
    </Card>
  );
};
export default OrderList;
