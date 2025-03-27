import React from "react";
import { View, Text } from "react-native";
import IdentificationHistory from "../components/IdentificationHistory";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../navigation/types";

type HistoryScreenProps = {
  route: RouteProp<StackParamList, "HistoryScreen">;
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ route }) => {
  const userId = "sampleUserId"; // Replace with actual authenticated user ID

  return (
    <View>
      <Text>Identification History</Text>
      <IdentificationHistory userId={userId} />
    </View>
  );
};

export default HistoryScreen;
