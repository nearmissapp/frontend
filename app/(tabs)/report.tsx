import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';

const BLE_DEVICES = [
  { id: 'C2:06:B7:D9:55:D0', name: 'F1 MAIN Motor', location: '2열연' },
  { id: 'E0:17:C9:90:18:2A', name: 'F2 MAIN Motor', location: '2열연' },
  { id: 'C6:39:01:E8:0A:6D', name: 'F3 MAIN Motor', location: '2열연' },
  { id: 'DB:1D:8B:49:6D:D5', name: 'F4 MAIN Motor', location: '2열연' },
  { id: 'CF:BC:9B:7D:15:B9', name: 'F5 MAIN Motor', location: '2열연' },
];

export default function ReportScreen() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [closestDevice, setClosestDevice] = useState<{ id: string; name: string; location: string } | null>(null);
  const manager = new BleManager();

  useEffect(() => {
    return () => {
      manager.destroy(); // BLE Manager cleanup
    };
  }, []);

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한을 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromAlbum = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '앨범 접근 권한을 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const scanForBeacons = () => {
    let closest: { id: string; name: string; location: string; rssi: number } | null = null;

    manager.startDeviceScan(null, null, (error, device: Device | null) => {
      if (error) {
        Alert.alert('스캔 실패', error.message);
        return;
      }

      if (device?.id && device?.rssi) {
        const matchedDevice = BLE_DEVICES.find((d) => d.id === device.id);
        if (matchedDevice) {
          if (!closest || (device.rssi && device.rssi > closest.rssi)) {
            closest = { ...matchedDevice, rssi: device.rssi };
          }
        }
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      if (closest) {
        setClosestDevice(closest);
        Alert.alert('가장 가까운 비콘', `${closest.name} (${closest.location})`);
      } else {
        Alert.alert('스캔 완료', '등록된 비콘을 찾을 수 없습니다.');
      }
    }, 5000); // 스캔 시간 5초로 줄임
  };

  const handleSubmit = () => {
    if (!photo) {
      Alert.alert('오류', '사진을 먼저 등록해주세요.');
      return;
    }
    if (!comment) {
      Alert.alert('오류', '코멘트를 입력해주세요.');
      return;
    }
    if (!closestDevice) {
      Alert.alert('오류', '등록된 비콘을 먼저 스캔해주세요.');
      return;
    }
    Alert.alert(
      '신고 완료',
      `신고 내용: ${comment}\n태그된 비콘: ${closestDevice.name}`,
      [
        {
          text: '확인',
          onPress: () => {
            router.push('/main_user'); // main_user 화면으로 이동
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>유해위험 등록</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.blackButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>사진 촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.blackButton} onPress={pickFromAlbum}>
          <Text style={styles.buttonText}>앨범에서 선택</Text>
        </TouchableOpacity>
      </View>

      {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}

      <TextInput
        style={styles.input}
        placeholder="코멘트를 입력하세요"
        placeholderTextColor="#aaa"
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.blackButton} onPress={scanForBeacons}>
        <Text style={styles.buttonText}>비콘 태그 스캔</Text>
      </TouchableOpacity>

      {closestDevice && (
        <Text style={styles.scannedInfo}>
          가장 가까운 비콘: {closestDevice.name} ({closestDevice.location})
        </Text>
      )}

      <TouchableOpacity style={styles.blackButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>제출하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30,
  },
  blackButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#000',
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  imagePreview: { width: '100%', height: 200, marginVertical: 20, borderRadius: 10, backgroundColor: '#E0E0E0' },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  scannedInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E8F5E9',
  },
});
