import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainUserScreen() {
  const router = useRouter();
  const [levelProgress] = useState(new Animated.Value(0)); // Level 게이지 초기값 0

  useEffect(() => {
    // 왼쪽에서 오른쪽으로 차오르는 애니메이션
    Animated.timing(levelProgress, {
      toValue: 80, // 게이지 진행 길이 (80%를 px로 표현)
      duration: 2000, // 애니메이션 지속 시간 (밀리초)
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/chick.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image source={require('../../assets/images/chick.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* 병아리 이미지 및 텍스트 */}
      <View style={styles.profileSection}>
        <Image source={require('../../assets/images/chick.png')} style={styles.chickImage} />
        <Text style={styles.levelText}>Lv. 1 열정많은 병아리</Text>
        {/* 게이지 */}
        <View style={styles.levelBarContainer}>
          <View style={styles.levelBarBackground} />
          <Animated.View
            style={[
              styles.levelBarProgress,
              {
                width: levelProgress, // 애니메이션으로 폭이 증가
              },
            ]}
          />
        </View>
      </View>

      {/* 등록한 위험요인 */}
      <Text style={styles.sectionTitle}>등록한 위험요인</Text>
      <TouchableOpacity onPress={() => router.push('/details_user')}>
        <View style={styles.card}>
          <Image source={require('../../assets/images/chick.png')} style={styles.thumbnail} />
          <View>
            <Text>슬리브 리프트 센서 파손</Text>
            <Text>2024-11-14</Text>
            <Text>진행중</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 내 부서 위험요인 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>내 부서 위험요인</Text>
        <TouchableOpacity onPress={() => router.push('/see_all')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/details_department')}>
        <View style={styles.card}>
          <Image source={require('../../assets/images/chick.png')} style={styles.thumbnail} />
          <View>
            <Text>안전발판 부식</Text>
            <Text>2024-11-05</Text>
            <Text>완료</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 플로팅 버튼 */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/report')}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  icon: { width: 24, height: 24 },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chickImage: {
    width: 120,
    height: 120,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  levelBarContainer: {
    width: '50%', // 전체 게이지 폭 (화면의 80%)
    height: 15, // 게이지 높이
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden', // 게이지가 컨테이너를 벗어나지 않도록 설정
  },
  levelBarBackground: {
    backgroundColor: '#E0E0E0', // 게이지 배경 색상
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  levelBarProgress: {
    backgroundColor: '#4CAF50', // 진행 색상
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, paddingHorizontal: 10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  seeAll: { fontSize: 16, color: '#007BFF' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingButtonText: { fontSize: 24, color: '#ffffff' },
});
