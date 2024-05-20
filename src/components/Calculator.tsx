import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Calculator = ({ onNumberPress, onOperatorPress, onEqualPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.operator]}
          onPress={() => onOperatorPress("/")}
        >
          <Text style={[styles.buttonText, styles.operatorText]}>/</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("7")}
        >
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("8")}
        >
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("9")}
        >
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.operator]}
          onPress={() => onOperatorPress("*")}
        >
          <Text style={[styles.buttonText, styles.operatorText]}>*</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("4")}
        >
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("5")}
        >
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("6")}
        >
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.operator]}
          onPress={() => onOperatorPress("-")}
        >
          <Text style={[styles.buttonText, styles.operatorText]}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("1")}
        >
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("2")}
        >
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("3")}
        >
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.operator]}
          onPress={() => onOperatorPress("+")}
        >
          <Text style={[styles.buttonText, styles.operatorText]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress("0")}
        >
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress(".")}
        >
          <Text style={styles.buttonText}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onEqualPress}>
          <Text style={[styles.buttonText, styles.equalsText]}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 20,
    margin: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 6,
    height: 49,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    color: "#333333",
  },
  operator: {
    backgroundColor: "#ffbf00",
  },
  operatorText: {
    color: "#ffffff",
  },
  equalsText: {
    fontSize: 30,
  },
});

export default Calculator;
