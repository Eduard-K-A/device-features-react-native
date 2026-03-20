import React, { useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { HomeScreen } from "../screens/HomeScreen";
import { AddEntryScreen } from "../screens/AddEntryScreen";
import { useTheme } from "../context/useTheme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      headerTintColor: theme.textPrimary,
      headerTitleStyle: {
        color: theme.textPrimary,
        fontWeight: "800" as const,
      },
      contentStyle: {
        backgroundColor: "transparent",
      },
    }),
    [theme.textPrimary]
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

