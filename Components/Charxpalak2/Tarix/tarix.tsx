import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Generate filename with dates and timestamp
  const generateFileName = () => {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
    return `monitoring_${formatDate(startDate)}_${formatDate(endDate)}_${timestamp}.xlsx`;
  };

  // Download file function
  const downloadFile = async () => {
    setLoading(true);
    setDownloadSuccess(false);

    const url = 'http://54.93.213.231:9090/post_monitor_download';
    const data = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    };

    const downloadFilePath = `${RNFS.DownloadDirectoryPath}/${generateFileName()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const responseBlob = await response.blob();
        const reader = new FileReader();
        reader.onload = async () => {
          const base64data = reader.result.split(',')[1];
          await RNFS.writeFile(downloadFilePath, base64data, 'base64');
          setFilePath(downloadFilePath);
          setDownloadSuccess(true);
          Alert.alert('Muvaffaqiyat', `Fayl yuklandi: ${downloadFilePath}`);
        };
        reader.readAsDataURL(responseBlob);
      } else {
        Alert.alert('Xato', `Server xatosi: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Xato', 'Faylni yuklashda xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Open file function
  const openFile = async () => {
    if (filePath) {
      try {
        await FileViewer.open(filePath);
      } catch (error) {
        console.error(error);
        Alert.alert('Xato', 'Faylni ochishda xato yuz berdi');
      }
    } else {
      Alert.alert('Xabar', 'Avval faylni yuklab oling');
    }
  };

  // Handle start date change
  const onStartDateChange = (_event: any, selectedDate: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === 'ios'); // Keep picker open on iOS until dismissed
    setStartDate(currentDate);
  };

  // Handle end date change
  const onEndDateChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === 'ios'); // Keep picker open on iOS until dismissed
    setEndDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {downloadSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Fayl muvaffaqiyatli yuklandi!</Text>
        </View>
      )}
      <Text style={styles.title}>Faylni yuklab olish</Text>

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Boshlang'ich sana:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
      </View>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          onChange={onStartDateChange}
          style={styles.datePicker}
          textColor="#333"
          accentColor="#007bff"
        />
      )}

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Oxirgi sana:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          onChange={onEndDateChange}
          style={styles.datePicker}
          textColor="#333"
          accentColor="#007bff"
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007bff' }]}
          onPress={downloadFile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Yuklanmoqda...' : 'Faylni yuklash'}
          </Text>
        </TouchableOpacity>

        {downloadSuccess && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={openFile}
          >
            <Text style={styles.buttonText}>Faylni ochish</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEFF9F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    color: '#155724',
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 120,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10, // Adds space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;