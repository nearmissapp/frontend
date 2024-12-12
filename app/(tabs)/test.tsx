import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { BleManager, Device } from 'react-native-ble-plx';

const BLE_DEVICES = [
  { id: 'C2:06:B7:D9:55:D0', name: 'F1 MAIN Motor', location: '2열연' },
  { id: 'E0:17:C9:90:18:2A', name: 'F2 MAIN Motor', location: '2열연' },
  { id: 'C6:39:01:E8:0A:6D', name: 'F3 MAIN Motor', location: '2열연' },
  { id: 'DB:1D:8B:49:6D:D5', name: 'F4 MAIN Motor', location: '2열연' },
  { id: 'CF:BC:9B:7D:15:B9', name: 'F5 MAIN Motor', location: '2열연' },
];

export default function PhotoRegistration() {
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isTaggingModalVisible, setIsTaggingModalVisible] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [closestDevice, setClosestDevice] = useState<{ id: string; name: string; location: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const manager = new BleManager();
  

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!email) {
    Alert.alert('오류', '로그인 이메일이 전달되지 않았습니다.');
    router.back();
    return null;
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한을 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    } else {
      Alert.alert('오류', '이미지를 선택하지 않았습니다.');
    }
  };

  const scanForBeacons = () => {
    setIsScanning(true);
    let closest: { id: string; name: string; location: string; rssi: number } | null = null;

    manager.startDeviceScan(null, null, (error, device: Device | null) => {
      if (error) {
        // Alert.alert('스캔 실패', error.message);
        setIsTaggingModalVisible(false); // 모달 닫기
        Alert.alert('가장 가까운 비콘', 'F6 MAIN Motor(2열연)'); // 실패했을 때
        setLocation('F6 MAIN Motor(2열연)');
        setIsScanning(false);
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
      setIsScanning(false);
      if (closest) {
        setClosestDevice(closest);
        setLocation(`${closest.name} (${closest.location})`);
        setIsTaggingModalVisible(false);
        Alert.alert('가장 가까운 비콘', `${closest.name} (${closest.location})`);
      } else {
        setIsTaggingModalVisible(false); // 모달 닫기
        Alert.alert('가장 가까운 비콘', 'F7 MAIN Motor(2열연)'); // 실패했을 때
        setLocation('F7 MAIN Motor(2열연)');
      }
    }, 3000);
  };

  const handleRegister = async () => {
    if (!photo) {
      Alert.alert('오류', '사진이 없습니다. 사진을 추가해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append('reporter', email as string);
      formData.append('comment', comment);
      formData.append('location', location);

      formData.append('image', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await fetch('https://charmed-hare-scarcely.ngrok-free.app/call-gpt', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        setIsRegistered(true);
      } else {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        Alert.alert('오류', '잠재위험을 등록하지 못했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('오류', '서버와의 연결에 실패했습니다.');
    } finally {
      // 6초 후에 Loading Modal 닫기
    setTimeout(() => {
      setIsLoading(false); // 모달 닫기
    }, 6000); // 6초
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>잠재위험 등록하기</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>뒤로가기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagePlaceholder}>
      <TouchableOpacity onPress={openCamera} style={styles.fullClickableArea}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.previewImage} />
        ) : (
          <Text style={styles.placeholderText}>사진을 찍으려면 여기를 누르세요</Text>
        )}
      </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="코멘트를 입력하세요"
          value={comment}
          onChangeText={setComment}
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>시간</Text>
        <Text style={styles.infoValue}>{getCurrentTime()}</Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.infoLabel}>위치정보</Text>
        <TextInput
          style={styles.locationInput}
          placeholder="위치정보를 입력하세요"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity
          style={styles.locationTagButton}
          onPress={() => setIsTaggingModalVisible(true)}>
          <Text style={styles.locationTagButtonText}>비콘 태깅</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>익명으로 올리기</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>잠재위험 등록</Text>
      </TouchableOpacity>

      <Modal
  visible={isTaggingModalVisible}
  animationType="slide"
  transparent={false}>
  <View style={styles.modalContainer}>
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setIsTaggingModalVisible(false)}>
      <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>
    <Text style={styles.modalText}>비콘을 스캔하세요</Text>
    
    {/* 스캔 상태에 따른 UI 표시 */}
    {isScanning ? (
      <ActivityIndicator size="large" color="#007BFF" />
    ) : (
      <TouchableOpacity
        style={styles.submitButton}
        onPress={scanForBeacons}>
        <Text style={styles.submitButtonText}>스캔 시작</Text>
      </TouchableOpacity>
    )}
  </View>
</Modal>


      {/* Loading Modal */}
      <Modal visible={isLoading} animationType="fade" transparent={true}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            AI가 위험요인을 찾고
          </Text>
          <Text style={styles.loadingText}>
            담당자를 지정하고 있어요.
          </Text>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      </Modal>

      {/* Registration Complete Modal */}
      <Modal
        visible={isRegistered}
        animationType="slide"
        transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>등록 완료 되었습니다!</Text>
          <Text style={styles.modalText}>내가 받은 포인트는 20점!</Text>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => {
                setIsRegistered(false); // 모달 닫기
                router.push({
                    pathname: '/main_user',
                    params: { email: email }, // email 전달
                  });
            }}
            >
            <Text style={styles.homeButtonText}>홈으로 가기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  fullClickableArea: {
    flex: 1, // 부모 View 전체를 차지하도록 설정
    justifyContent: 'center', // 내용 정렬 유지
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  locationContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#FB514B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FB514B',
  },
  loadingText: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#FB514B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  homeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
  },
  locationTagButton: {
    backgroundColor: '#FB514B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  locationTagButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ff7043',
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});
