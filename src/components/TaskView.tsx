import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

interface TaskViewProps {
  text: string;
  description: string;
  imageUri: string;
}

const TrackerView: React.FC<TaskViewProps> = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandView = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={handleExpandView} style={styles.touchable}>
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.circle}>
            <Image source={{ uri: props.imageUri }} style={styles.image} />
          </View>
          <Text style={styles.itemText} numberOfLines={2}>
            {props.text}
          </Text>
        </View>
        {expanded && (
          <View style={styles.expandedView}>
            <Text style={styles.additionalContent}>{props.description}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: "98%",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 10,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    width: "80%",
    marginLeft: 10,
  },
  expandedView: {
    marginTop: 10,
  },
  additionalContent: {
    fontSize: 14,
    color: "#666",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default TrackerView;
