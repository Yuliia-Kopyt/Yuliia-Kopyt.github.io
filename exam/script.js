const input = document.getElementById("countryInput");
const result = document.getElementById("result");

let countries = [];

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && input.value.trim() !== "") {
        countries.push(input.value.trim());
        result.textContent = countries.join(", ");
        input.value = "";
    }
});
