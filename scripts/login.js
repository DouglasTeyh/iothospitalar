import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDkpZ8p9Vu1aBiojKhwIHVo0vNsytS5vLI",
    authDomain: "iot-hospitalar.firebaseapp.com",
    projectId: "iot-hospitalar",
    storageBucket: "iot-hospitalar.firebasestorage.app",
    messagingSenderId: "255206820624",
    appId: "1:255206820624:web:53746ee3ae896253ecf395",
    measurementId: "G-PZD3FZGSNZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "admin.html";
    } catch (error) {
        status.textContent = "Erro: Ops... Algo deu errado.";
    }
});
