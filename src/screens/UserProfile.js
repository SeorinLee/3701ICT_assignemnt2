import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UserProfile = ({ route, navigation }) => {
  const token = route.params?.token;
  const [user, setUser] = useState(route.params?.user);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name);
  const [newPassword, setNewPassword] = useState('');

  // 토큰이 유효하지 않을 때 로그인 화면으로 자동 리디렉션 처리
  useEffect(() => {
    if (!token) {
      navigation.navigate('SignIn');
    }
  }, [token, navigation]);

  if (!token) {
    // 토큰이 없으면 로딩 중임을 표시하고 useEffect에 의해 페이지가 전환됩니다.
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    // 업데이트된 사용자 정보를 저장
    setUser({
      ...user,
      name: newName,
      password: newPassword, // 실제로 비밀번호를 업데이트 하려면 서버와의 통신이 필요합니다.
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // 변경사항 취소
    setNewName(user.name);
    setNewPassword('');
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text>User Profile Screen</Text>
      {isEditing ? (
        <>
          <TextInput
            placeholder="Name"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Confirm" onPress={handleUpdate} />
          <Button title="Cancel" onPress={handleCancel} />
        </>
      ) : (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Button title="Update" onPress={() => setIsEditing(true)} />
          <Button title="Sign Out" onPress={() => navigation.popToTop()} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default UserProfile;
