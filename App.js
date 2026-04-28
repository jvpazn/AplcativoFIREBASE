import * as React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
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
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log("LOGADO:", userCredential.user.email); // DEBUG
      navigation.replace("Dinheiro");
    } catch (error) {
      console.log("ERRO LOGIN:", error.code);
      Alert.alert("Erro no login", error.message);
    }
  };

  return (
    <View style={styles.containerApp}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bem-vindo</Text>
        <Text style={styles.headerSubtitle}>Faça seu login</Text>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.sectionTitle}>Acessar conta</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputModern}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.inputModern}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={fazerLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.secondaryButtonText}>
            Criar nova conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      console.log("CADASTRADO:", userCredential.user.email);
      Alert.alert("Sucesso", "Cadastro realizado!");
      navigation.replace("Home");
    } catch (error) {
      console.log("ERRO CADASTRO:", error.code);
      Alert.alert("Erro no cadastro", error.message);
    }
  };

  return (
    <View style={styles.containerApp}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro</Text>
        <Text style={styles.headerSubtitle}>Crie sua conta</Text>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.sectionTitle}>Novo usuário</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputModern}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.inputModern}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={cadastrar}>
          <Text style={styles.primaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DinheiroScreen() {
  const [cotacao, setCotacao] = React.useState({});

  const carregarDados = () => {
    fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,MXN-BRL")
      .then((res) => res.json())
      .then(setCotacao)
      .catch((error) => console.log("Erro ao buscar moedas:", error));
  };

  React.useEffect(() => {
    carregarDados();
  }, []);

  const moedas = ["USDBRL", "EURBRL", "MXNBRL"];

  const getFlagUrl = (code) => {
    if (code === "USD") return "https://flagcdn.com/w80/us.png";
    if (code === "EUR") return "https://flagcdn.com/w80/eu.png";
    if (code === "MXN") return "https://flagcdn.com/w80/mx.png";
    return "https://flagcdn.com/w80/br.png";
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.top}>
        <Text style={styles.title}>Conversor de</Text>
        <Text style={styles.title}>
          Moedas <Text style={styles.titlePro}>Pro</Text>
        </Text>
      </View>

      {/* CARD PRINCIPAL */}
      <View style={styles.cardMainMoedas}>
        <Text style={styles.cardTitle}>Cotação Atual</Text>
        <Text style={styles.cardSub}>
          Última atualização: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>

        {moedas.map((key, i) => {
          const item = cotacao[key];
          
          if (!item) return null;

          const variacao = parseFloat(item.pctChange);
          const up = variacao >= 0;

          return (
            <View key={i} style={styles.cardCurrency}>
              
              <View style={styles.left}>
                <View style={styles.flagsContainer}>
                  <Image 
                    source={{ uri: "https://flagcdn.com/w80/br.png" }} 
                    style={styles.flagBack} 
                  />
                  <Image 
                    source={{ uri: getFlagUrl(item.code) }} 
                    style={styles.flagFront} 
                  />
                </View>

                <View>
                  <Text style={styles.code}>{item.code} / BRL</Text>
                  <Text style={styles.desc}>
                    1 {item.name.split("/")[0]}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.value}>
                  R$ {parseFloat(item.bid).toFixed(2).replace('.', ',')}
                </Text>
                <Text style={{ color: up ? "#2ecc71" : "#e74c3c", fontSize: 12, fontWeight: "bold", marginTop: 3 }}>
                  {up ? "▲" : "▼"} {Math.abs(variacao).toFixed(2).replace('.', ',')}%
                </Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.btn} onPress={carregarDados}>
          <Text style={styles.btnText}>Atualizar Cotações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Dinheiro" component={DinheiroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerApp: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  header: {
    backgroundColor: "#2f3e9e",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#ffd166",
    fontSize: 16,
  },
  mainCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
  },
  inputModern: {
    backgroundColor: "#f9fafc",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  primaryButton: {
    backgroundColor: "#4fb6a3",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 15,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#2f3e9e",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f3f7",
  },
  top: {
    backgroundColor: "#1c2854", 
    paddingTop: 70,
    paddingBottom: 60,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "serif", 
    fontStyle: "italic",
  },
  titlePro: {
    color: "#e89a74", 
  },
  cardMainMoedas: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardSub: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  cardCurrency: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0", 
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagsContainer: {
    width: 44,
    height: 44,
    marginRight: 12,
    justifyContent: "center",
  },
  flagBack: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff", 
  },
  flagFront: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 1,
  },
  code: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  desc: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  btn: {
    backgroundColor: "#5db1a8",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

// Ccueca@gmail.com
// TRALALA
