document.addEventListener("DOMContentLoaded", () => {
    fetch("components/nav-principal.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("nav-principal-placeholder").innerHTML = data;
        });

    fetch("components/nav.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("nav-placeholder").innerHTML = data;
        });

    fetch("components/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});