async function fetchData() {
  const response = await fetch("data.json"); // Replace 'data.json' with the path to your JSON file
  const jsonData = await response.json();
  console.log(jsonData);

  jsonData

  return jsonData;
}

  function replaceKeyWithLabel(data, keyToReplace) {
    let returnValue = null;

    data.symptoms.forEach(item => {
      if(keyToReplace === item.key){
        returnValue = item.label;
      }
    });
    if(returnValue === null){
      console.error("Can't find symptom label.")
    }
    return returnValue;
  }

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous content

  data.days.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
                      <div class="day-card">
                        <h2>${item.date}</h2>
                        <h3>Symptoms:</h3>
                        <ul>
                            ${
                              item.symptoms && item.symptoms.length > 0
                                ? item.symptoms
                                    .map(
                                      (symptom) => `
                                <li>${replaceKeyWithLabel(data, symptom.key)}</li>
                                <ul>
                                    ${
                                      symptom.logs && symptom.logs.length > 0
                                        ? symptom.logs
                                            .map(
                                              (log) => `
                                        <li><b>${log.time}</b>: ${log.pain} / 5 intensity</li>
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
                        <h3>Meals:</h3>
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
                        <h3>Notes:</h3>
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
                        <h3>Medications:</h3>
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

async function initialize() {
  try {
    let data = await fetchData();
    renderData(data);
  } catch (error) {
    console.error("Error loading or rendering data:", error);
  }
}

initialize();
