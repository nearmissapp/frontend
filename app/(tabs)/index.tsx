import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('로그인 실패', '이메일과 비밀번호를 입력하세요.');
      return;
    }

    try {
      // API 호출
      const formData = new FormData();
      formData.append('reporter', email);

      const response = await fetch('https://a71b-182-172-74-82.ngrok-free.app/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.data.length > 0) {
        // 성공적으로 데이터를 가져온 경우
        Alert.alert('로그인 성공', `환영합니다, ${email}!`);
        router.push({ pathname: '/main_user', params: { email, reports: data.data } });
      } else {
        // DB에 이메일이 없는 경우
        Alert.alert('로그인 실패', '해당 이메일의 데이터가 없습니다.');
      }
    } catch (error) {
      // 네트워크 또는 서버 오류 처리
      Alert.alert('오류', '서버와의 연결에 실패했습니다.');
      console.error('Login Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <Text style={styles.label}>사용자 이메일</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="helloworld@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {email.includes('@') && <Text style={styles.validEmail}>✔</Text>}
      </View>

      <Text style={styles.label}>비밀번호</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Text style={styles.togglePassword}>
            {showPassword ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>비밀번호를 잊으셨나요?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  validEmail: {
    color: 'green',
    fontSize: 18,
  },
  togglePassword: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#007BFF',
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
