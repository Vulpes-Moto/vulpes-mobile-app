import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { logIn } from "@/store/slices/userSlice";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { useDispatch } from "react-redux";

export default function LogInScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pressed, setPressed] = useState(false);

  const sendForm = async () => {
    const credentials = { email, password };
    console.log(credentials);
    try {
      dispatch(logIn(credentials));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <ThemedView style={styles.wrapper}>
      <Image
        source={require("@/assets/images/VulpesLogoIn.png")}
        style={styles.vulpesLogo}
      />
      <ThemedText type="title" style={styles.title}>
        Log In
      </ThemedText>
      <ThemedView style={styles.form}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#808080ff"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#808080ff"
          secureTextEntry
          style={styles.input}
        />
        {(email !== '' && password !== '') && (
          <Pressable 
            style={[
              styles.button,
              pressed && { transform: [{ scale: 0.8 }] }
            ]} 
            onPress={sendForm}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
          >
            <Image
              source={require("@/assets/images/okButton.png")}
              style={styles.okButtonImage}
            />
        </Pressable>)}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0e0f0e",
  },
  vulpesLogo: {
    width: 350,
    height: 350,
    position: "absolute",
    top: 80,
  },
  title: {
    marginTop: 50,
    fontSize: 32,
    color: "#fff",
  },
  form: {
    width: 280,
    position: "absolute",
    top: 270,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  input: {
    width: "100%",
    height: 50,
    borderBottomColor: "#fff",
    borderBottomWidth: 2,
    borderBottomRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#fff",
    placeholderTextColor: "#808080ff",
  },
  button: {
    width: "40%",
    height: 50,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 5,
    marginLeft: "auto",
  },
  okButtonImage: {
    width: "60%",
    height: "100%",
  }
});
