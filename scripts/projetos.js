import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
const db = getFirestore(app);

const container = document.getElementById("projetos-container");

const postsQuery = query(collection(db, "postagens"), orderBy("data", "desc"));
const snapshot = await getDocs(postsQuery);

snapshot.forEach((doc) => {
    const post = doc.data();
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        ${
        post.imagemURL
            ? `<img src="${post.imagemURL}" alt="Imagem do projeto">`
            : ""
        }
        <h2>${post.titulo}</h2>
        <p>${post.conteudo.slice(0, 100)}...</p>
        <a href="projeto.html?id=${doc.id}">Ver mais</a>
    `;

    container.appendChild(div);
});
