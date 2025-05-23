import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import ErrorList from '../Errors/Error';

const Edit = () => {
  const [tableHead] = useState(['Parametr', 'Qiymat', 'Holat']);
  const [tableData, setTableData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Ma\'lumotlar olinmoqda...');
  const [blinkAnim] = useState(new Animated.Value(1));

  const API_URL = 'http://0.0.0.0:9090/micro_gs_data_blok_read1';
  const POLLING_INTERVAL = 1000; // 1 second

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
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
      setConnectionStatus('Ma\'lumotlar muvaffaqiyatli olindi');
    } catch (error) {
      console.error('Ma\'lumot olishda xato:', error);
      setConnectionStatus('Xatolik yuz berdi');
    }
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
    // Start polling when component mounts
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);
    startBlinking();

    // Cleanup: stop polling when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const renderStatus = (status) => {
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
      <View style={{ top: '3%', right: '5%' }}>
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
  container: { flex: 1, padding: 16, backgroundColor: '#FEFF9F' },
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