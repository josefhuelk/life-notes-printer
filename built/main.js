// Note: You can use this function to load the data from a file. This is disabled because users are supposed to upload the .json in the interface
// async function fetchData() {
//   const response = await fetch("data.json"); // Replace 'data.json' with the path to your JSON file
//   const jsonData = await response.json();
//   console.log(jsonData);
//   return jsonData;
// }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
function fetchTranslations() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("./src/translations.json");
        const jsonData = yield response.json();
        console.log(jsonData);
        return jsonData;
    });
}
function replaceKeyWithLabel(keyToReplace) {
    let returnValue = null;
    data.symptoms.forEach((item) => {
        if (keyToReplace === item.key) {
            returnValue = item.label;
        }
    });
    if (returnValue === null) {
        console.error("Can't find symptom label.");
    }
    return returnValue;
}
function renderData() {
    const container = document.getElementById("data-container");
    if (data === undefined) {
        container.innerHTML = `
                            <br>
                            <h2>How to use:</h2>
                            <ol>
                              <li> Save LifeNotes backup in the App Settings </li>
                              <li> Find the file in your phone's file manager </li>
                              <li> Import the file here </li>

                              <p>Your data will not leave your device. </p>

                              <p> Looking for a quick demo? Use this <a download="lifenotes-demo-backup.json" href="./src/demo-lifenotes-backup.json">test file</a></p>
                            </ol>
                          `;
        return null;
    }
    container.innerHTML = ""; // Clear previous content
    data.days.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
                      <div class="day-card">
                        <h2>${translateDate(item.date)}</h2>
                        <h3>${translate("Symptoms")}:</h3>
                        <ul>
                            ${item.symptoms && item.symptoms.length > 0
            ? item.symptoms
                .map((symptom) => {
                const logs = symptom.logs || []; // Initialize logs
                return `
                                <li>${replaceKeyWithLabel(symptom.key)}</li>
                                <ul>
                                    ${logs.length > 0
                    ? logs
                        .map((log) => `
                                        <li><b>${log.time}</b>: ${log.pain} / 5 ${translate("intensity")}

                                              <i>${log.detail || ""}</i>
                                        </li>
                                    `)
                        .join("")
                    : ""}
                                </ul>
                            `;
            })
                .join("")
            : ""}
                        </ul>
                        <h3>${translate("Meals")}:</h3>
                        <ul>
                            ${item.meals && item.meals.length > 0
            ? item.meals
                .map((meal) => `
                                <li><b>${meal.time}</b>: ${meal.key}</li>
                                <p><i> ${meal.detail || "∅"}</i></p>
                            `)
                .join("")
            : ""}
                        </ul>
                        <h3>${translate("Logs")}:</h3>
                        <ul>
                            ${item.logs && item.logs.length > 0
            ? item.logs
                .map((log) => `
                                <li><b>${log.time}</b>: ${log.key}</li>
                            `)
                .join("")
            : "∅"}
                        </ul>
                        <h3>${translate("Medications")}:</h3>
                        <ul>
                            ${item.meds && item.meds.length > 0
            ? item.meds
                .map((med) => `
                                <li><b>${med.time}</b>: ${med.key} (${med.quantity} mg)</li>
                            `)
                .join("")
            : "∅"}
                        </ul>
                    </div>
                  `;
        container.appendChild(itemDiv);
    });
}
function translate(input) {
    if (translations[input] && translations[input][currentLanguage]) {
        return translations[input][currentLanguage];
    }
    else {
        // Fallback to input value
        return input;
    }
}
function translateDate(dateStr) {
    const date = new Date(dateStr);
    const germanDateFormat = new Intl.DateTimeFormat(currentLanguage, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return germanDateFormat.format(date);
}
let translations;
let data;
let currentLanguage = "en-EN";
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            translations = yield fetchTranslations();
            renderData();
        }
        catch (error) {
            console.error("Error loading or rendering data:", error);
        }
    });
}
initialize();
(_a = document.querySelector("#printBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.print();
});
(_b = document
    .querySelector("#language-selector")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (e) => {
    if (e.target instanceof HTMLSelectElement) {
        currentLanguage = e.target.value;
        renderData();
    }
});
(_c = document.querySelector("#file-input")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (e) => {
    var _a;
    const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                const jsonData = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                data = jsonData;
                renderData();
            }
            catch (error) {
                console.error("Error parsing JSON file:", error);
                alert("Error parsing JSON file. Please upload a valid JSON file.");
            }
        };
        reader.readAsText(file);
    }
});
