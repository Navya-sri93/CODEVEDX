javascript
function calculateBMI()
{
    let name =
        document.getElementById("name").value;

    let height =
        document.getElementById("height").value;

    let weight =
        document.getElementById("weight").value;

    height = height / 100;

    let bmi =
        weight / (height * height);

    bmi = parseFloat(bmi.toFixed(2));

let status = "";
let recommendation = "";

if (bmi < 18.5)
{
    status = "Underweight";
    recommendation =
    "Increase healthy calorie intake.";
}
else if (bmi >= 18.5 && bmi < 25)
{
    status = "Normal Weight";
    recommendation =
    "Maintain your current lifestyle.";
}
else if (bmi >= 25 && bmi < 30)
{
    status = "Overweight";
    recommendation =
    "Exercise regularly and monitor diet.";
}
else
{
    status = "Obese";
    recommendation =
    "Consult a healthcare professional.";
}

document.getElementById("statusResult").innerHTML =
"Status: " + status;

document.getElementById("recommendation").innerHTML =
"Recommendation: " + recommendation;
}

