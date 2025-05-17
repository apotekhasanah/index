document.getElementById("bmiForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!gender || !age || !height || !weight) {
    alert("Please fill out all fields.");
    return;
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBMI = bmi.toFixed(1);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 24.9) category = "Normal weight";
  else if (bmi < 29.9) category = "Overweight";
  else category = "Obesity";

  document.getElementById("bmiValue").textContent = roundedBMI;
  document.getElementById("bmiCategory").textContent = category;
  document.getElementById("result").style.display = "block";
});
