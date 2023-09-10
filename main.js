async function fetchData() {
  const response = await fetch("data.json"); // Replace 'data.json' with the path to your JSON file
  const jsonData = await response.json();
  console.log(jsonData);

  return jsonData;
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous content

  data.days.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
                      <div class="day-card">
                        <h2>Date: ${item.date}</h2>
                        <p>Symptoms:</p>
                        <ul>
                            ${
                              item.symptoms && item.symptoms.length > 0
                                ? item.symptoms
                                    .map(
                                      (symptom) => `
                                <li>${symptom.key}</li>
                                <ul>
                                    ${
                                      symptom.logs && symptom.logs.length > 0
                                        ? symptom.logs
                                            .map(
                                              (log) => `
                                        <li>Time: ${log.time}</li>
                                        <li>Intensity: ${log.pain} / 5</li>
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
                        <p>Meals:</p>
                        <ul>
                            ${
                              item.meals && item.meals.length > 0
                                ? item.meals
                                    .map(
                                      (meal) => `
                                <li>Time: ${meal.time}, Title: ${meal.key}</li>
                                <p>Details: ${meal.detail || "∅"}</p>
                            `
                                    )
                                    .join("")
                                : ""
                            }
                        </ul>
                        <p>Logs:</p>
                        <ul>
                            ${
                              item.logs && item.logs.length > 0
                                ? item.logs
                                    .map(
                                      (log) => `
                                <li>Type: ${log.type}, Time: ${log.time}, Title: ${log.key}</li>
                            `
                                    )
                                    .join("")
                                : "∅"
                            }
                        </ul>
                        <p>Medications:</p>
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
