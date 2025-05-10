window.addEventListener('load', function () {
    if (localStorage.getItem("Screen") === "light") {
        document.body.style.backgroundColor = "#d7d7d7";
    } else if (localStorage.getItem("Screen") === "dark") {
        document.body.style.backgroundColor = "#151414";
    }

    document.getElementById("sun").onclick = function () {
        document.body.style.backgroundColor = "#d7d7d7";
        localStorage.setItem("Screen", "light");
    }
    document.getElementById("moon").onclick = function () {
        document.body.style.backgroundColor = "#151414";
        localStorage.setItem("Screen", "dark");
    } 
});