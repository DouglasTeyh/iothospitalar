import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
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

const container = document.getElementById("projeto-container");

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  container.innerHTML = "<p>Projeto não encontrado.</p>";
} else {
  const docRef = doc(db, "postagens", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const post = docSnap.data();

    container.innerHTML = `
      <article class="projeto-card">
        <a href="projetos.html" class="voltar">Voltar</a> <br>
        <img src="src/iot-hospitalar-extended.png" alt="Logotipo" height="90px">
      <h1>${post.titulo}</h1>
        ${
          post.imagemURL
            ? `<img src="${post.imagemURL}" alt="Imagem do projeto">`
            : ""
        }
        <p>${post.conteudo}</p>
        <br>
        ${
          post.download
            ? `<a href="${post.download}" class="botao-download" target="_blank">Download</a>`
            : ""
        }
      </article>
    `;
  } else {
    container.innerHTML = "<p>Projeto não encontrado.</p>";
  }
}

// nav e footer
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/nav.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("nav-placeholder").innerHTML = data;
    });

  fetch("components/footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
});
