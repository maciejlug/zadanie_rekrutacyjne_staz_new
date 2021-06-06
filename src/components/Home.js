import React, { useState, useEffect } from "react";
import { Form, InputNumber, Button, Checkbox, Col, Row, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  saveRowsCols,
  selectDataList,
  saveSeats,
  saveProposedSeats,
} from "../features/theater/theaterSlice";

//styles

const formNumberItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

const formItemLayout = {
  wrapperCol: { span: 24 },
};

function Home() {
  const dispatch = useDispatch();
  const data = useSelector(selectDataList);
  const [proposedSeats, setProposedSeats] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [near, setNear] = useState(false);
  const [maxSeats, setMaxSeats] = useState(1);
  const [seatingArr, setSeatingArr] = useState([]);

  //submiting form
  const onFinish = () => {
    dispatch(
      saveRowsCols({
        rows: rows,
        cols: cols,
      })
    );
    dispatch(
      saveSeats({
        seats: numberOfSeats,
        near: near,
      })
    );
    dispatch(saveProposedSeats(proposedSeats));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const error = () => {
    message.error(
      `Wprowadziłeś zby dużą liczbę miejsc (maksymalnie miejsc${
        near ? " obok siebie" : ""
      }: ${maxSeats})`
    );
  };

  const errorNear = () => {
    message.error(
      `Aby wybrać opcję "obok siebie", wprowadź minimum 2 miejsca `
    );
  };

  useEffect(() => {
    if (numberOfSeats < 2 && near) errorNear();
  }, [near, numberOfSeats]);

  //getting max cols and rows

  const getRowCols = () => {
    data.forEach((item) => {
      if (item.cords.x + 1 > rows) setRows(item.cords.x + 1);
      if (item.cords.y + 1 > cols) setCols(item.cords.y + 1);
    });
  };

  useEffect(() => {
    getRowCols();
  }, [data]);

  //propose seats

  const distributeSeats = () => {
    const notReserved = data.filter((item) => item.reserved === false);
    if (near === false) {
      const propose = notReserved.slice(0, numberOfSeats);
      const proposal = propose.map((item) => ({
        cords: item.cords,
        id: item.id,
      }));
      setProposedSeats(proposal);
    }
    if (near) {
      const proposal = seatingArr.find((item) => item.length >= numberOfSeats);
      setProposedSeats(proposal);
    }
  };

  useEffect(() => {
    distributeSeats();
  }, [seatingArr, numberOfSeats]);

  //getting maximum number of seats

  const maxSeatNearArr = () => {
    const notReserved = data.filter((item) => item.reserved === false);
    if (near) {
      let seatsArr = [];
      let seats = [];
      for (let i = 0; i < rows; i++) {
        const rowArr = notReserved.filter((item) => item.cords.x === i);
        for (let a = 0; a < rowArr.length; a++) {
          if (
            rowArr[a + 1] &&
            rowArr[a + 1].cords.y - rowArr[a].cords.y === 1
          ) {
            seats.push(rowArr[a]);
          } else {
            seats.push(rowArr[a]);
            seatsArr.push(seats);
            seats = [];
          }
        }
      }
      return seatsArr.filter((item) => item.length > 1);
    }
    if (near === false) {
      return notReserved;
    }
  };

  useEffect(() => {
    setSeatingArr(maxSeatNearArr());
    near
      ? setMaxSeats(maxSeatNearArr().sort().reverse()[0].length)
      : setMaxSeats(maxSeatNearArr().length);
  }, [near]);

  return (
    <>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col>
          <Form
            name="basic"
            initialValues={{
              near: near,
              seats: numberOfSeats,
            }}
            onFinish={
              numberOfSeats <= maxSeats
                ? near && numberOfSeats < 2
                  ? errorNear
                  : onFinish
                : error
            }
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              className="seats-one-row"
              {...formNumberItemLayout}
              label="Liczba miejsc"
              name="seats"
              rules={[
                {
                  required: true,
                  message: "Brak liczby miejsc",
                },
              ]}
            >
              <InputNumber
                min={near ? 2 : 1}
                onChange={(e) => setNumberOfSeats(e)}
              />
            </Form.Item>
            <Form.Item {...formItemLayout} name="near" valuePropName="checked">
              <Checkbox onChange={(e) => setNear(e.target.checked)}>
                Czy miejsca mają być obok siebie?
              </Checkbox>
            </Form.Item>

            <Form.Item {...formItemLayout}>
              <Button type="primary" htmlType="submit">
                Wybierz miejsca
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Home;
