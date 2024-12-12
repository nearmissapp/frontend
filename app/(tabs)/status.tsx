import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function StatusScreen() {
  const router = useRouter();
  const { id, 
          email, 
          comment, // 코멘트 
          created_at, // 시간
          status, // 조치여부
          image_compressed_base64, // 이미지
          location, // 위치
          mitigation_plan // 조치사항
  } = useLocalSearchParams(); // 위험요인 데이터

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleComplete = async () => {
    try {
        const response = await fetch('https://charmed-hare-scarcely.ngrok-free.app/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, manager : email }),
      });

      if (response.ok) {
        setIsModalVisible(true); // 조치 완료 모달 표시
      } else {
        Alert.alert('오류', '조치 상태를 업데이트하지 못했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('오류', '서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push({ pathname: '/main_man', params: { email } })}>
        <Text style={styles.header}>뒤로가기</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{comment}</Text>
      <Image 
        source={{ uri: `${image_compressed_base64}` }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <Text style={styles.boldText}>시간</Text>
      <Text style={styles.subtitle}>{new Date(created_at as string).toLocaleString('ko-KR')}</Text>
      <Text style={styles.boldText}>위치정보</Text>
      <Text style={styles.subtitle}>{location}</Text>
      <Text style={styles.boldText}>조치사항</Text>
      <Text style={styles.mitigation}>{mitigation_plan}</Text>
      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>조치 완료</Text>
      </TouchableOpacity>

      {/* 조치 완료 모달 */}
      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={styles.modalTitle}>조치 처리가</Text>
          <Text style={styles.modalTitle}>완료 되었습니다.</Text>
          <Text style={styles.modalSubText}>멋진 조치로 안전을 향한 스텝업!</Text>
          <Text style={styles.modalSubText}>늘 응원할게요!</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => {
              setIsModalVisible(false);
              router.push({
                pathname: '/main_man',
                params: { email: email },
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#3B66F3' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  image: { width: '100%', height: 200, marginBottom: 20, borderRadius: 8 },
  boldText: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 10 },
  mitigation: { fontSize: 14, color: '#555', marginBottom: 20, lineHeight: 20 },
  completeButton: {
    backgroundColor: '#3B66F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4169E1' },
  modalText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  homeButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  homeButtonText: { color: '#4169E1', fontSize: 18, fontWeight: 'bold' },checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkMark: {
    color: '#4169E1',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  modalSubText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
});
