import { Button, StyleSheet } from "react-native";

import { Text, View } from "react-native";

export default function TabOneScreen() {
  return (
    <View className="bg-red-600" style={styles.container}>
      <Text className="text-green-800" style={styles.title}>
        Tab One
      </Text>
      <View style={styles.separator} />
      <Button
        title="Sign Out"
        onPress={() => {
          console.log("Sign Out");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
