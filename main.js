
// Note: You can use this function to laod the data from a file. This is disabled because users are supposed to upload the .json in the interface
// async function fetchData() {
//   const response = await fetch("data.json"); // Replace 'data.json' with the path to your JSON file
//   const jsonData = await response.json();
//   console.log(jsonData);
//   return jsonData;
// }

async function fetchTransalations() {
  const response = await fetch("translations.json");
  const jsonData = await response.json();
  console.log(jsonData);
  return jsonData;
}

function replaceKeyWithLabel(data, keyToReplace) {
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

  if(data === undefined){
    container.innerHTML = `
                            <br>
                            <h2>How to use:</h2>
                            <ol>
                              <li> Save LifeNotes backup in the App Settings </li>
                              <li> Find the file in you phones file manager </li>
                              <li> Import the file here </li>

                              <p>Your data will not leave your device. </p>

                              <p> Looking for a quick demo? Use this <a download="lifenotes-demo-backup.json" href="./demo-lifenotes-backup.json">test file</a></p>
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
                            ${
                              item.symptoms && item.symptoms.length > 0
                                ? item.symptoms
                                    .map(
                                      (symptom) => `
                                <li>${replaceKeyWithLabel(
                                  data,
                                  symptom.key
                                )}</li>
                                <ul>
                                    ${
                                      symptom.logs && symptom.logs.length > 0
                                        ? symptom.logs
                                            .map(
                                              (log) => `
                                        <li><b>${log.time}</b>: ${
                                                log.pain
                                              } / 5 ${translate(
                                                "intensity"
                                              )}</li>
                                    `
                                            )
                                            .join("")
                                        : ""
                                    }
                                </ul>
                            `
                                    )
                                    .join("")
                                : ""
                            }
                        </ul>
                        <h3>${translate("Meals")}:</h3>
                        <ul>
                            ${
                              item.meals && item.meals.length > 0
                                ? item.meals
                                    .map(
                                      (meal) => `
                                <li><b>${meal.time}</b>: ${meal.key}</li>
                                <p><i> ${meal.detail || "∅"}</i></p>
                            `
                                    )
                                    .join("")
                                : ""
                            }
                        </ul>
                        <h3>${translate("Logs")}:</h3>
                        <ul>
                            ${
                              item.logs && item.logs.length > 0
                                ? item.logs
                                    .map(
                                      (log) => `
                                <li><b>${log.time}</b>: ${log.key}</li>
                            `
                                    )
                                    .join("")
                                : "∅"
                            }
                        </ul>
                        <h3>${translate("Medications")}:</h3>
                        <ul>
                            ${
                              item.meds && item.meds.length > 0
                                ? item.meds
                                    .map(
                                      (med) => `
                                <li>Type: ${med.type}</li>
                            `
                                    )
                                    .join("")
                                : "∅"
                            }
                        </ul>
                    </div>
                  `;
    container.appendChild(itemDiv);
  });
}

function translate(input) {
  if (translations[input] && translations[input][currentLanguage]) {
    return translations[input][currentLanguage];
  } else {
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

async function initialize() {
  try {
    translations = await fetchTransalations();
    renderData();
  } catch (error) {
    console.error("Error loading or rendering data:", error);
  }
}

initialize();

document.querySelector("#printBtn").addEventListener("click", () => {
  window.print();
});

document.querySelector("#language-selector").addEventListener("change", (e) => {
  // console.log(e.target.value);
  currentLanguage = e.target.value;
  renderData();
});

document.querySelector("#file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target.result);
        data = jsonData;
        renderData();
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Error parsing JSON file. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  }
});
