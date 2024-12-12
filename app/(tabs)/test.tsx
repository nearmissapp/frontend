import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PhotoRegistration() {
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isTaggingModalVisible, setIsTaggingModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams();

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

  const handleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRegistered(true);
    }, 5000);
  };

  const handleImageClick = (locationName: string) => {
    Alert.alert(
      '위치정보 태깅 완료!',
      locationName, // 메시지로 locationName 전달
      [
        { text: '확인', onPress: () => setIsTaggingModalVisible(false) },
        { text: '다시 태깅하기', onPress: () => {} },
        { text: '직접 입력하기', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>잠재위험 등록하기</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>뒤로가기</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Insert Placeholder */}
      <TouchableOpacity style={styles.imagePlaceholder} onPress={() => {}}>
        <Text style={styles.imagePlaceholderText}>사진을 찍으려면 클릭하세요</Text>
      </TouchableOpacity>

      {/* Comment Section */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.commentBox} onPress={() => {}}>
          <TextInput
            style={styles.commentInput}
            placeholder="코멘트를 입력하세요"
            value={comment}
            onChangeText={setComment}
          />
        </TouchableOpacity>
      </View>

      {/* Time Display */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>시간</Text>
        <Text style={styles.infoValue}>{getCurrentTime()}</Text>
      </View>

      {/* Location Input and Tagging */}
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
          <Text style={styles.locationTagButtonText}>위치정보 태깅</Text>
        </TouchableOpacity>
      </View>

      {/* Anonymous Toggle */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>익명으로 올리기</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>잠재위험 등록</Text>
      </TouchableOpacity>

      {/* Tagging Modal */}
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
          <Text style={styles.modalText}>위치정보를 태깅해주세요</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity onPress={() => handleImageClick('열연부\nF4 MAIN MOTOR')}>
                <Image source={require('../../assets/images/chick.png')} style={styles.taggingImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImageClick('압연부\nF3 MAIN MOTOR')}>
                <Image source={require('../../assets/images/chick.png')} style={styles.taggingImage} />
            </TouchableOpacity>
          </View>
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
          <ActivityIndicator size="large" color="#007BFF" />
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
  imagePlaceholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  inputContainer: {
    marginBottom: 20,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  commentInput: {
    fontSize: 16,
    color: '#333',
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
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  taggingImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
    lineHeight: 30, // 줄 간격 조정
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
});  