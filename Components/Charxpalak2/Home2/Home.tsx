import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import ElectricDashedLine from "./ElectricDashedLine";
import ErrorList from "../Errors/Error";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [cardValues, setCardValues] = useState({
    genarator_voltage: "0 V",
    generator_current: "0 A",
    rpm: "0 ",
    Suv_balandligi: "0 m",
    active_power: "0 W",
    A_faza_voltage: "0",
    B_faza_voltage: "0",
    C_faza_voltage: "0",
    A_current: "0",
    B_current: "0",
    C_current: "0",
    Output_power: "0 W",
    Total_generating_capacity: "0 kW",
    temperatureData: {
      ichki_real_namlik: "0 %",
      ichki_real_temp: "0 °C",
      tashqi_real_namlik: "0 %",
      tashqi_real_temp: "0 °C",
    },
  });

  const API_URL = "http://0.0.0.0:9090/micro_gs_data_blok_read1";
  const POLLING_INTERVAL = 1000; // 1 second

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const apiData = await response.json();

      const windController = apiData?.wind_controller || {};
      const windController1 = apiData?.datas || {};
      const windController2 = apiData?.wind_2 || {};
      const windController3 = apiData?.wind2_1 || {};
      const tempData = apiData?.namlik_temp || {};

      setCardValues({
        genarator_voltage: `${windController.genarator_voltage / 10 || 0} V`,
        generator_current: `${windController.generator_current / 10 || 0} A`,
        rpm: `${windController.rpm || 0} rpm`,
        Suv_balandligi: `${windController1.уревон_воды || 0} sm`,
        active_power: `${((windController2['Active power'] / 1000) || 0).toFixed(1)} kW`,
        A_faza_voltage: `${windController3.A_faza_voltage || 0} `,
        B_faza_voltage: `${windController3.B_faza_voltage || 0} `,
        C_faza_voltage: `${windController3.C_faza_voltage || 0} `,
        A_current: `${windController3.A_current || 0} `,
        B_current: `${windController3.B_current || 0} `,
        C_current: `${windController3.C_current || 0} `,
        Output_power: `${((windController2['Output power'] / 1000) || 0).toFixed(1)} kW`,
        Total_generating_capacity: `${windController2['Total generating capacity'] || 0} kW`,
        temperatureData: {
          ichki_real_namlik: `${tempData.ichki_real_namnik || 0} %`,
          ichki_real_temp: `${tempData.ichki_real_temp || 0} °C`,
          tashqi_real_namlik: `${tempData.tashqi_real_namlik || 0} %`,
          tashqi_real_temp: `${tempData.tashqi_real_temp || 0} °C`,
        },
      });
    } catch (error) {
      console.error("Ma'lumot olishda xato:", error);
    }
  };

  useEffect(() => {
    // Start polling when component mounts
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);

    // Cleanup: stop polling when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const cardData = [
    { value: cardValues.rpm, image: require("../../../assets/generator.png") },
    {
      value: cardValues.genarator_voltage,
      image: require("../../../assets/controler.png"),
    },
    {
      value: cardValues.generator_current,
      image: require("../../../assets/tok.png"),
    },
    {
      value: cardValues.Suv_balandligi,
      image: require("../../../assets/Growatt.png"),
    },
    { value: cardValues.active_power },
    { value: cardValues.A_faza_voltage },
    { value: cardValues.B_faza_voltage },
    { value: cardValues.C_faza_voltage },
    { value: cardValues.A_current },
    { value: cardValues.B_current },
    { value: cardValues.C_current },
    { value: cardValues.Output_power },
    { value: cardValues.Output_power },
    { value: cardValues.Total_generating_capacity },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>
          Yellow Water Wheel
        </Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          Chaxpalakning real vaqtdagi texnik malumotlari
        </Text>
      </View>
      <View style={{ right: "5%", top: "0%" }}>
        <ErrorList />
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: parseFloat(cardValues.rpm) > 0 ? "#38b000" : "red",
              fontWeight: 'bold'
            }}
          >
            Generator
          </Text>
          <Image source={cardData[0].image} style={styles.cardImage} />
          <Text style={styles.cardValue}>{cardData[0].value}</Text>
        </View>
        <View
          style={[
            styles.dashContainerHorizontal,
            { transform: [{ rotate: "0deg" }] },
          ]}
        >
          <ElectricDashedLine />
        </View>
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: parseFloat(cardValues.rpm) > 0 ? "#38b000" : "red",
              fontWeight: 'bold'
            }}
          >
            Controller
          </Text>
          <Image source={cardData[1].image} style={styles.cardImage} />
          <Text style={styles.cardValue}>{cardData[1].value}</Text>
          <Text style={styles.cardValue}>{cardData[2].value}</Text>
          <Text style={styles.cardValue}>{cardData[4].value}</Text>
        </View>
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: parseFloat(cardValues.rpm) > 0 ? "#38b000" : "red",
              fontWeight: 'bold'
            }}
          >
            Elektr tarmog'i
          </Text>
          <Image source={cardData[2].image} style={styles.cardImage} />
          <Text style={styles.cardValue}>{cardData[13].value}</Text>
        </View>
        <View style={styles.dashContainerVertical}>
          <ElectricDashedLine />
        </View>
        <View style={styles.dashContainerHorizontal}>
          <ElectricDashedLine />
        </View>
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: parseFloat(cardValues.rpm) > 0 ? "#38b000" : "red",
              fontWeight: 'bold'
            }}
          >
            Invertor
          </Text>
          <Image source={cardData[3].image} style={styles.cardImage} />
          <View style={{ flexDirection: "row", top: "5%" }}>
            <View style={{right:10}}>
              <Text style={styles.text}>A </Text>
              <Text style={styles.text}>{Number(cardData[8]?.value) / 10}</Text>
              <Text style={styles.text}>{Number(cardData[9]?.value) / 10}</Text>
              <Text style={styles.text}>{Number(cardData[10]?.value) / 10}</Text>
            </View>
            <View style={{left:10}}>
              <Text style={styles.text}> V</Text>
              <Text style={styles.text}>{Number(cardData[5]?.value) / 10}</Text>
              <Text style={styles.text}>{Number(cardData[6]?.value) / 10}</Text>
              <Text style={styles.text}>{Number(cardData[7]?.value) / 10}</Text>
            </View>
          </View>
          <View style={{ top: "8%", paddingBottom: "7%" }}>
            <Text style={styles.text}>{cardData[11].value}</Text>
          </View>
        </View>
      </View>
      <View style={styles.temperatureCardContainer}>
        <View style={styles.card1}>
          <Text style={styles.cardTitle}>Atrof-muhit ma'lumotlari</Text>
          <View style={styles.temperatureContent}>
            <Text style={styles.cardValue}>
              Ichki harorat: {cardValues.temperatureData.ichki_real_temp}
            </Text>
            <Text style={styles.cardValue}>
              Ichki namlik: {cardValues.temperatureData.ichki_real_namlik}
            </Text>
            <Text style={styles.cardValue}>
              Tashqi harorat: {cardValues.temperatureData.tashqi_real_temp}
            </Text>
            <Text style={styles.cardValue}>
              Tashqi namlik: {cardValues.temperatureData.tashqi_real_namlik}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    backgroundColor: "#FEFF9F",
  },
  dashContainerHorizontal: {
    justifyContent: "center",
    alignItems: "center",
    width: "10%",
    height: "25%",
    marginHorizontal: "2.5%",
    marginTop: "5%",
    transform: [{ rotate: "180deg" }],
  },
  text: {
    fontWeight: 'bold'
  },
  dashContainerVertical: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    height: "10%",
    marginVertical: "2.5%",
    transform: [{ rotate: "90deg" }],
    position: "absolute",
    top: "33.5%",
    left: (width - -420) / 4 + 40,
  },
  header: {
    alignItems: "center",
    marginVertical: "8%",
    top: "2%",
    justifyContent: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: "5%",
    paddingBottom: "5%",
  },
  card: {
    width: (width - width * 0.3) / 2,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#000",
    borderRadius: 10,
    padding: "2.5%",
    alignItems: "center",
    marginBottom: "23%",
    backgroundColor: "#FEFF9F",
  },
  card1: {
    width: (width - width * 0.003) / 2,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#000",
    borderRadius: 10,
    padding: "2.5%",
    alignItems: "center",
    marginBottom: "23%",
    backgroundColor: "#FEFF9F",
  },
  cardImage: {
    width: "100%",
    height: width * 0.27,
    marginBottom: "1%",
    top: "5%",
  },
  cardValue: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#000",
    marginTop: "1.25%",
    top: "5%",
  },
  temperatureCardContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: "5%",
    bottom: "7%",
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000",
    marginBottom: "2%",
  },
  temperatureContent: {
    alignItems: "center",
  },
});

export default Home;