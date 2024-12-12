import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';




// 타입 정의
type ResponseDataItem = {
  comment: string; // 정상 데이터
  created_at: string; // 타임스탬프
  id: number; // 고유 ID
  status: string; // 상태
};




export default function MainUserScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // 로그인 화면에서 전달된 이메일
  const [reports, setReports] = useState<ResponseDataItem[]>([]); // 신고 내역 상태




  const departmentRisks = [
    { id: 1, comment: '안전발판 부식', created_at: '24.11.14' },
    { id: 2, comment: 'Pot 그래픽', created_at: '24.01.05' },
    { id: 3, comment: '안전보호구 VMS 컴프레서 압력 과다', created_at: '24.09.04' },
    { id: 4, comment: 'CR라인 냉각수 누수', created_at: '24.01.30' },
  ];




  useEffect(() => {
    // 신고 내역 API 호출
    const fetchReports = async () => {
      try {
        const formData = new FormData();
        formData.append('reporter', email as string); // email이 string으로 지정되었음을 명시




        const response = await fetch('https://charmed-hare-scarcely.ngrok-free.app/list-reporter', {
          method: 'POST',
          body: formData,
        });




        const data = await response.json();




        if (response.ok && data.data) {
          setReports(data.data); // 신고 내역 설정
        } else {
          setReports([]); // 데이터가 없을 경우 초기화
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        setReports([]); // 오류 발생 시 초기화
      }
    };




    fetchReports();
  }, [email]);




  const renderReportItem = ({ item }: { item: ResponseDataItem }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.reportTitle}>{item.comment}</Text>
        <Text style={styles.reportDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.statusBadge, item.status === 'completed' ? styles.completed : styles.inProgress]}>
        {item.status === 'completed' ? '완료' : '진행중'}
      </Text>
    </View>
  );




  const renderDepartmentRiskItem = ({ item }: { item: typeof departmentRisks[0] }) => (
    <View style={styles.departmentCard}>
      <Text style={styles.departmentRiskTitle}>{item.comment}</Text>
      <Text style={styles.departmentRiskDate}>{item.created_at}</Text>
    </View>
  );




  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/three_line_menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.levelHeaderText}>Lv. 1</Text>
          <Text style={styles.subHeaderText}>열정많은 병아리</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image source={require('../../assets/images/user_person.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>


      {/* 프로필 이미지 섹션 */}
      <View style={styles.profileSection}>
        <View style={styles.circleBackground}>
          <Image
            source={require('../../assets/images/chick.png')}
            style={styles.profileImage}
          />
        </View>
      </View>


      {/* 흰색 둥근 컨테이너 */}
      <View style={styles.whiteContainer}>
        {/* 등록한 위험요인 */}
        <View>
          <Text style={styles.sectionTitle}>등록한 위험요인</Text>
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReportItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <Text style={styles.noDataText}>등록된 신고 내역이 없습니다.</Text>
            )}
          />
        </View>


        {/* 내 부서 위험요인 */}
        <Text style={styles.sectionTitle}>내 부서 잠재위험</Text>
        <FlatList
          data={departmentRisks}
          renderItem={renderDepartmentRiskItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.departmentRiskContainer}
        />
      </View>


      {/* 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push({ pathname: '/test', params: { email } })}
      >
        <Image
          source={require('../../assets/images/btn_camera.png')}
          style={styles.floatingButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6347' // 톰토 색상으로 변경
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    marginTop: 100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6347',
  },
  icon: { width: 30, height: 30 },
  profileSection: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  circleBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },




  chickImage: {
    width: 100,
    height: 100,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  levelBarContainer: {
    width: '50%',
    height: 15,
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  levelBarBackground: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  levelBarProgress: {
    backgroundColor: '#4CAF50',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, paddingHorizontal: 10 },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reportDate: {
    fontSize: 14,
    color: '#777',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completed: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  inProgress: {
    backgroundColor: '#FF6347',
    color: '#fff',
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: 20,
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    // backgroundColor: '#FFFFFF',
    width: 100,
    height: 40,
    // borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingButtonImage: {
    width: 100,
    height: 75,
    alignItems: 'center',
    resizeMode: 'cover',
  },
  departmentRiskContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  departmentCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentRiskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  departmentRiskDate: {
    fontSize: 12,
    color: '#777',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  levelHeaderText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 5,
  },
});









