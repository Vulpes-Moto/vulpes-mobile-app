import { Modal, Pressable, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { clearBarcodes } from "@/store/slices/barcodeSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

axios.defaults.baseURL = "https://vulpes-backend.onrender.com/";

export default function TabTwoScreen() {
  const dispatch = useDispatch();
  const scannedBarcodes = useSelector((state) => state.barcode.scannedBarcodes);
  const [sendPending, setSendPending] = useState(false);

  const clearList = () => {
    dispatch(clearBarcodes());
  };

  const sendList = async() => {
    try {
      setSendPending(true);
      await axios.post('receive-products/add', { items: scannedBarcodes });
      dispatch(clearBarcodes());
      setSendPending(false);
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Scanned List!</ThemedText>
      </ThemedView>
      {scannedBarcodes?.length < 1 && (
        <View>
          <ThemedText>Empty.</ThemedText>
        </View>
      )}
      <View style={styles.list}>
        {scannedBarcodes &&
          scannedBarcodes?.length > 0 &&
          scannedBarcodes.map((item, index) => (
            <View key={`${item.barcode}-${index}`} style={[styles.listItem, item.article === "?" && styles.listError]}>
              <ThemedText>
                {item.article !== "" && `(${item.article})`}
                {(!item.name || item.name === '' || item.name === '?') ? item.barcode : item.name}: {item.count}
              </ThemedText>
            </View>
          ))}
      </View>
      <Modal visible={sendPending} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Отправка</ThemedText>
          </View>
        </View>
      </Modal>
      {scannedBarcodes?.length > 0 && (
        <View style={styles.listButtons}>
          <Pressable style={styles.clearButton} onPress={clearList}>
            <ThemedText style={styles.clearButtonText}>Clear list</ThemedText>
          </Pressable>
          <Pressable style={[styles.clearButton, styles.sendButton]} onPress={sendList}>
            <ThemedText style={styles.clearButtonText}>Send</ThemedText>
          </Pressable>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  list: {
    flex: 1,
    gap: 5,
  },
  listItem: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#bababaff',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 6,
  },
  listError: {
    borderColor: '#d75959ff',
  },
  listButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "rgba(183, 47, 47, 1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButton: {
    flex: 1,
    backgroundColor: "green",
  },
  clearButtonText: {
    color: "rgba(226, 226, 226, 1)",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalOverlay: {
    height: '120%',
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "transparent",
    // padding: 24,
    // borderRadius: 12,
    // width: "80%",
    // alignItems: "center",
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: '#fff',
  },
});
