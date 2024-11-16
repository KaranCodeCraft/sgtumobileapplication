import React from "react";
import { Stack } from "expo-router";
import ApiState from "@/context/ApiState"; 

const _layout = () => {
  return (
    <ApiState>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Sikkim Global Technical University",
          headerLeft: () => null, // Hides the back button
        }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: "Student Signup",
          headerLeft: () => null, // Hides the back button on this screen as well
        }}
      />
    </Stack>
    </ApiState>
  );
};

export default _layout;
