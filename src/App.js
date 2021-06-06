import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Theater from "./components/Theater";
import Summary from "./components/Summary";
import Loading from "./components/Loading";
import { Layout } from "antd";
import {
  selectSeatList,
  selectBookingList,
  saveSize,
  saveData,
} from "./features/theater/theaterSlice";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
const url = "http://localhost:3004/seats";

function App() {
  const dispatch = useDispatch();
  const { Content } = Layout;
  const choosenSeats = useSelector(selectSeatList);
  const bookedSeats = useSelector(selectBookingList);
  const [size, setSize] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  const checkSize = () => {
    setSize(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", checkSize);
    dispatch(
      saveSize({
        windowSize: size,
      })
    );
    return () => {
      window.removeEventListener("resize", checkSize);
    };
  });

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const fetchedSeats = await response.json();
      dispatch(saveData(fetchedSeats));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        {loading ? (
          <Loading />
        ) : (
          <>
            {choosenSeats.length === 0 && bookedSeats.length === 0 && <Home />}
            {choosenSeats.length !== 0 && bookedSeats.length === 0 && (
              <Theater />
            )}
            {bookedSeats.length !== 0 && <Summary />}
          </>
        )}
      </Content>
    </Layout>
  );
}

export default App;
