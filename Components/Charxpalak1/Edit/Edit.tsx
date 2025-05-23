import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import ErrorList from '../Errors/Error';

const Edit = () => {
  const [tableHead] = useState(['Parametr', 'Qiymat', 'Holat']);
  const [tableData, setTableData] = useState([]);
  const [IsConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Ulanmoqda...');
  const [blinkAnim] = useState(new Animated.Value(1));
  const WS_URL = "ws://0.0.0.0:9090/micro_gs_data_blok_ws";
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000;

  const connectWebSocket = (url: string | URL, retryCount = 0) => {
    const socket = new WebSocket(url);
    socket.onopen = () => {
      setIsConnected(true);
      setConnectionStatus('Ulandi');
      console.log(`WebSocket ulandi: ${url}`);
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const formattedData: ((prevState: never[]) => never[]) | any[][] = [];
        const specialElements = [
          "автомат_выкл_akumlator",
          "автомат_выкл_chastotnik_1",
          "автомат_выкл_chastotnik_2",
          "автомат_выкл_panel",
          "автомат_выкл_ввод",
          "автомат_выкл_генератор",
          "автомат_выкл_солнеч_инвер",
          "автомат_выкл_шин_DC_controller",
        ];
        const alarmElements = ["avariya_chastotnik", "Авария"];
        Object.keys(data).forEach((section) => {
          Object.keys(data[section]).forEach((key) => {
            const value = data[section][key];
            let status = '';

            if (specialElements.includes(key)) {
              status = value === 0 ? '🔴' : '🟢';
            } else if (alarmElements.includes(key)) {
              status = value === 1 ? '🔴' : '🟢';
            } else {
              status = '';
            }

            formattedData.push([key, value.toString(), status]);
          });
        });

        setTableData(formattedData);
      } catch (error) {
        console.error('WebSocket ma\'lumotlarini parse qilishda xato:', error);
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket xatosi: ${url}`, error);
      setIsConnected(false);
      setConnectionStatus('Xatolik yuz berdi');
    };

    socket.onclose = () => {
      console.log(`WebSocket uzildi: ${url}`);
      if (retryCount < MAX_RETRIES) {
        console.log(`Qayta ulanish urinilmoqda (${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => connectWebSocket(url, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`Maksimal urinishlar soniga yetdi: ${url}`);
        setIsConnected(false);
        setConnectionStatus('Ulanish muvaffaqiyatsiz yakunlandi');
      }
    };

    return socket;
  };
  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    const socket = connectWebSocket(WS_URL);
    startBlinking();
    return () => {
      socket.close();
    };
  }, []);
  const renderStatus = (status: string | number | boolean | Iterable<React.ReactNode> | Animated.Value | Animated.AnimatedInterpolation<string | number> | Animated.WithAnimatedObject<React.ReactElement<any, string | React.JSXElementConstructor<any>>> | null | undefined) => {
    if (status === '🔴') {
      return (
        <Animated.Text style={{ opacity: blinkAnim, margin: 'auto' }}>{status}</Animated.Text>
      );
    }
    return <Text style={{ margin: 'auto' }}>{status}</Text>;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Texnik Ma'lumotlar</Text>
      <Text style={styles.status}>{connectionStatus}</Text>
      <View style={{top:'2.5%',right:'5%'}}>
      <ErrorList />
      </View>
      <ScrollView style={{ top: '4%' }}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row
              data={tableHead}
              style={styles.head}
              textStyle={styles.headText}
            />
            <Rows
              data={tableData.map((row) => [
                row[0],
                row[1],
                renderStatus(row[2]),
              ])}
              textStyle={styles.text}
            />
          </Table>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff0f3' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    top: '4%',
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
    top: '4%',
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  headText: { margin: 6, fontWeight: 'bold', textAlign: 'center' },
  text: { margin: 6, textAlign: 'center' },
});

export default Edit;