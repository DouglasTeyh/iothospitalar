import {
    setPersistence,
    browserSessionPersistence,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDkpZ8p9Vu1aBiojKhwIHVo0vNsytS5vLI",
    authDomain: "iot-hospitalar.firebaseapp.com",
    projectId: "iot-hospitalar",
    storageBucket: "iot-hospitalar.appspot.com",
    messagingSenderId: "255206820624",
    appId: "1:255206820624:web:53746ee3ae896253ecf395",
    measurementId: "G-PZD3FZGSNZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

setPersistence(auth, browserSessionPersistence).then(() => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "login.html";
        } else {
            carregarPostagens();
        }
    });
});

const form = document.getElementById("postForm");
const status = document.getElementById("status");
const tituloInput = document.getElementById("titulo");
const conteudoInput = document.getElementById("conteudo");
const downloadInput = document.getElementById("download");
const imagemInput = document.getElementById("imagem");

const listaContainer = document.getElementById("postagensAdmin");
let editandoId = null;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    status.textContent = "Publicando...";
    const titulo = tituloInput.value;
    const conteudo = conteudoInput.value;
    const download = downloadInput.value || "";

    let imagemURL = "";

    try {
        if (imagemInput.files.length > 0) {
        const file = imagemInput.files[0];
        const storageRef = ref(storage, "imagens/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            status.textContent = `Enviando imagem... ${progress.toFixed(0)}%`;
        });

        await new Promise((resolve, reject) => {
            uploadTask.on("state_changed", null, reject, async () => {
            imagemURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
            });
        });
    }

    if (editandoId) {
        const docRef = doc(db, "postagens", editandoId);
        await updateDoc(docRef, {
            titulo,
            conteudo,
            download,
            ...(imagemURL && { imagemURL }),
        });
        status.textContent = "Postagem atualizada!";
        editandoId = null;
    } else {
        await addDoc(collection(db, "postagens"), {
            titulo,
            conteudo,
            download,
            imagemURL,
            data: serverTimestamp(),
        });
        status.textContent = "Postagem publicada!";
    }

    form.reset();
    carregarPostagens();
    } catch (err) {
        status.textContent = "Erro: " + err.message;
    }
});

async function carregarPostagens() {
    listaContainer.innerHTML = "<h2>Postagens publicadas:</h2>";
    const snap = await getDocs(collection(db, "postagens"));

    snap.forEach((docSnap) => {
        const dados = docSnap.data();
        const div = document.createElement("div");
        div.classList.add("card-postagem");
        div.innerHTML = `
                <h3>${dados.titulo}</h3>
                <p>${dados.conteudo}</p>
                ${
                dados.download
                    ? `<p><a href="${dados.download}" target="_blank">Download</a></p>`
                    : ""
                }
                ${
                dados.imagemURL
                    ? `<img src="${dados.imagemURL}" alt="Imagem do projeto" style="max-width: 100%; border-radius: 8px;" />`
                    : ""
                }
                <button data-id="${docSnap.id}" class="editar">✏️ Editar</button>
                <button data-id="${docSnap.id}" class="excluir">🗑️ Excluir</button>
            `;
        listaContainer.appendChild(div);
    });

    listaContainer.querySelectorAll(".editar").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const snap = await getDocs(collection(db, "postagens"));
        snap.forEach((docSnap) => {
            if (docSnap.id === id) {
                const dados = docSnap.data();
                tituloInput.value = dados.titulo;
                conteudoInput.value = dados.conteudo;
                downloadInput.value = dados.download || "";
                editandoId = id;
                }
            });
        });
    });

    listaContainer.querySelectorAll(".excluir").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm("Tem certeza que deseja excluir esta postagem?")) {
            await deleteDoc(doc(db, "postagens", id));
            carregarPostagens();
        }
        });
    });
}
