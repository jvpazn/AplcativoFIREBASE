import * as React from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

enableScreens();

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyD1x6W6SPqMduKjyDXGNNp7loVT1dKf9fk",
  authDomain: "projeto01-b711c.firebaseapp.com",
  projectId: "projeto01-b711c",
  storageBucket: "projeto01-b711c.firebasestorage.app",
  messagingSenderId: "718288024491",
  appId: "1:718288024491:web:9b34abbc0c5df9e6b718ee",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

function HomeScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      if (Platform.OS === "web") {
        window.alert("Sucesso: Login realizado!");
        navigation.replace("Dinheiro");
      } else {
        Alert.alert("Sucesso", "Login realizado!", [
          {
            text: "OK",
            onPress: () => navigation.replace("Dinheiro"),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Erro no login", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={styles.img}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/1144/1144811.png",
          }}
        />

        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.text}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={fazerLogin} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            color="red"
            title="Cadastrar-se"
            onPress={() => navigation.navigate("Cadastro")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CadastroScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const cadastrar = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);

      if (Platform.OS === "web") {
        window.alert("Sucesso: Cadastro realizado!");

        navigation.replace("Dinheiro");
      } else {
        Alert.alert("Sucesso", "Cadastro realizado!", [
          {
            text: "OK",
            onPress: () => navigation.replace("Dinheiro"),
          },
        ]);
      }
    } catch (error) {
      console.log("ERRO FIREBASE:", error.code);
      Alert.alert("Erro no cadastro", error.code);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.text}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <Button title="Cadastrar" onPress={cadastrar} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= DADOS ================= */
function DinheiroScreen() {
  const [cotacao, setCotacao] = React.useState({});

  React.useEffect(() => {
    fetch("https://economia.awesomeapi.com.br/json/all")
      .then((res) => res.json())
      .then(setCotacao)
      .catch((err) => console.log(err));
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.headerText}>Cotação de Moedas</Text>

      {Object.values(cotacao).map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text>Compra: {item.bid}</Text>
          <Text>Venda: {item.ask}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* ================= NAVIGATION ================= */
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Dinheiro" component={DinheiroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 50,
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  img: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontWeight: "bold",
    color: "#333",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "80%",
    marginTop: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
});
