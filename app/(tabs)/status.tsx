import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function StatusScreen() {
  const router = useRouter();
  const { id, email, comment, created_at } = useLocalSearchParams(); // 위험요인 데이터
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
      <Text style={styles.title}>{comment}</Text>
      <Text style={styles.subtitle}>시간: {new Date(created_at as string).toLocaleString('ko-KR')}</Text>
      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>조치 완료</Text>
      </TouchableOpacity>

      {/* 조치 완료 모달 */}
      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>조치 완료!</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => {
              setIsModalVisible(false);
              router.push({
                pathname: '/main_man',
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  modalText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  homeButton: {
    backgroundColor: '#FB514B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  homeButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
