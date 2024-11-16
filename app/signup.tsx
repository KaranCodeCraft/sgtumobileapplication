import { View, Text } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import { useRouter } from 'expo-router';

const SignUp = () => {
  const router = useRouter();
  const handleLogin = ()=>{
    router.push("/")
  }
  return (
    <View>
      <Button name={"signup"} onPress={handleLogin}/>
      <Text>SignUp</Text>
    </View>
  )
}

export default SignUp