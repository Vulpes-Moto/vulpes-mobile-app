import { useIsFocused } from "@react-navigation/native";
import { useAudioPlayer } from 'expo-audio';
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from 'react-redux';
import { addBarcode, clearBarcodes } from '../../store/slices/barcodeSlice';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const isFocused = useIsFocused();
  const beep = require('../../assets/sounds/beep.m4a')
  const player = useAudioPlayer(beep);
  const dispatch = useDispatch();

  const handleScan = async ({ type, data }) => {
    if (!scanned) {
      try {
        player.seekTo(0);
        player.play()
      } catch(err) {
        console.log(err)
      }
      setScanned(true);
      setScannedData({ type, data });
      setModalVisible(true);
    }
  };

  const handleOkPress = () => {
    if (scannedData) {
      dispatch(addBarcode(scannedData?.data));
    }
    setScanned(false);
    setScannedData(null);
    setModalVisible(false);
  };

  const handleClose = () => {
    dispatch(clearBarcodes());
    setScanned(false);
    setScannedData(null);
    setModalVisible(false);
  };

  const toggleTorch = () => setTorchOn((prev) => !prev);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Pressable onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          enableTorch={torchOn ? true : false}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "code128",
              "code39",
              "upc_a",
              "upc_e",
            ],
          }}
          onBarcodeScanned={handleScan}
        />
      )}
      <View style={styles.torchButtonWrapper}>
        <Pressable style={styles.torchButton} onPress={toggleTorch}>
          <Text style={styles.torchButtonText}>{torchOn ? "Выключить фонарик" : "Включить фонарик"}</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✅ Код отсканирован</Text>
            <Text>Тип: {scannedData?.type}</Text>
            <Text>Данные: {scannedData?.data}</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.buttonText}>CANCEL</Text>
              </Pressable>
              <Pressable style={styles.okButton} onPress={handleOkPress}>
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  torchButtonWrapper: {
    position: "absolute",
    top: 20,
  },torchButton: {
    backgroundColor: 'rgba(118, 118, 118, 1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    borderRadius: 8,
  },torchButtonText: {
    color: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
  flexDirection: 'row',
  gap: 15,
  marginTop: 20,
},
cancelButton: {
  backgroundColor: 'rgba(53, 53, 53, 1)',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  width: '50%',
},
okButton: {
  backgroundColor: 'green',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  width: '50%',
},
buttonText: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
},
});
