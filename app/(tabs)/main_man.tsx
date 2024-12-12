import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';


// 타입 정의
type ResponseDataItem = {
  id: number; // 고유 ID
  comment: string; // 댓글 내용
  created_at: string; // 생성일시
  status: string; // 상태 (completed/in-progress)
  image_compressed_base64: string; // Base64 인코딩된 이미지 데이터
  location : string;
  mitigation_plan : string;
};


export default function MainManScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // 로그인 시 전달받은 email
  const [reports, setReports] = useState<ResponseDataItem[]>([]); // 신고 내역 상태


  useEffect(() => {
    // 신고 내역 API 호출
    const fetchReports = async () => {
      try {
        const formData = new FormData();
        formData.append('manager', email as string);


        const response = await fetch('https://charmed-hare-scarcely.ngrok-free.app/list-manager', {
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
    <TouchableOpacity
      style={styles.cardHorizontal}
      onPress={() =>
        router.push({
          pathname: '/status',
          params: {
            id: item.id,
            email: email,
            comment: item.comment,
            created_at: item.created_at,
            location : item.location,
            mitigation_plan : item.mitigation_plan,
            image_compressed_base64 : item.image_compressed_base64,
            status : item.status
          },
        })
      }
    >
      <Image
        source={{ uri: item.image_compressed_base64 }}
        style={styles.reportImageHorizontal}
      />
      <View style={styles.cardContentHorizontal}>
        <Text style={styles.reportTitleHorizontal}>{item.comment}</Text>
        <Text style={styles.reportDateHorizontal}>
          {new Date(item.created_at).toLocaleDateString('ko-KR')}
        </Text>
        <Text
          style={[
            styles.statusBadgeHorizontal,
            item.status === 'completed' ? styles.completed : styles.inProgress,
          ]}
        >
          {item.status === 'completed' ? '완료' : '진행중'}
        </Text>
      </View>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/three_line_menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image source={require('../../assets/images/user_person.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>


      {/* 사자 이미지 섹션 */}
      <View style={styles.profileSection}>
        <View style={styles.circleBackground}>
          <Image source={require('../../assets/images/lion_.png')} style={styles.lionImage} />
        </View>
      </View>


      {/* 흰색 둥근 컨테이너 */}
      <View style={styles.whiteContainer}>
        <Text style={styles.sectionTitle}>내 담당 니어미스</Text>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReportItem}
          contentContainerStyle={styles.listContainerHorizontal}
          numColumns={2}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>로딩 중입니다.</Text>
          )}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B66F3' // 전체 배경색을 파란색으로 변경
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    backgroundColor: '#3B66F3',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    paddingHorizontal: 10
  },
  icon: { width: 30, height: 30 },


  // 카드 스타일 (가로형)
  cardHorizontal: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 5,
    elevation: 3,
  },
  reportImageHorizontal: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cardContentHorizontal: {
    alignItems: 'center',
    marginTop: 10,
  },
  reportTitleHorizontal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  reportDateHorizontal: {
    fontSize: 12,
    color: '#777',
    marginVertical: 5,
  },
  statusBadgeHorizontal: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
  },
  completed: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  inProgress: {
    backgroundColor: '#FF6347',
    color: '#fff',
  },


  // 리스트 컨테이너
  listContainerHorizontal: {
    paddingHorizontal: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: 20,
    fontSize: 16,
  },


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
  lionImage: {
    width: 120,
    height: 120,
  },
});



