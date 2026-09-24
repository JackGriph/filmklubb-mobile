import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import { MoviesProvider } from "../context/MoviesContext";

export default function RootLayout() {
  return (
    <MoviesProvider>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Filmklubb" }} />
        <Stack.Screen
          name="movie/[id]"
          options={({ route }) => ({ title: route.params?.title ?? "" })}
        />
      </Stack>
    </MoviesProvider>
  );
}
