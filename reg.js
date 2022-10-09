const email = document.getElementById("email");

email.addEventListener("input", function (event) {
  if (email.validity.typeMismatch) {
    email.setCustomValidity("This is not a valid email address!");
    email.reportValidity();
  } else {
    email.setCustomValidity("");
  }
});

const fullName = document.getElementById("name");

fullName.addEventListener("input", function (event) {
  if (fullName.validity.valueMissing) {
    fullName.setCustomValidity("Please enter your name!");
    fullName.reportValidity();
  } else {
    fullName.setCustomValidity("");
  }
});

let userEntries = localStorage.getItem("user-entries");
if (userEntries) {
  userEntries = JSON.parse(userEntries);
} else {
  userEntries = [];
}

const displayEntries = () => {
  const savedUserEntries = localStorage.getItem("user-entries");
  let entries = "";
  if (savedUserEntries) {
    const parsedUserEntries = JSON.parse(savedUserEntries);
    entries = parsedUserEntries
      .map((entry) => {
        const name = `<td class="text-sm text-primary font-light px-6 py-4 whitespace-nowrap">${entry.name}</td>`;
        const email = `<td class="text-sm text-primary font-light px-6 py-4 whitespace-nowrap">${entry.email}</td>`;
        const password = `<td class="text-sm text-primary font-light px-6 py-4 whitespace-nowrap">${entry.password}</td>`;
        const dob = `<td class="text-sm text-primary font-light px-6 py-4 whitespace-nowrap">${entry.dob}</td>`;
        const acceptTerms = `<td class="text-sm text-primary font-light px-6 py-4 whitespace-nowrap">${entry.acceptTermsAndConditions}</td>`;
        const row = `<tr class="">
            ${name}
            ${email}
            ${password}
            ${dob}
            ${acceptTerms}
        </tr>`;
        return row;
      })
      .join("\n");
  }
  var table = `<div class="flex flex-col">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 inline-block min-w-xl px-2">
    <div class="overflow-hidden">
    <table class="min-w-xl">
    <thead class="">
    <tr>
          <th scope="col" class="text-sm font-medium text-primary px-6 py-4 text-left">Name</th>
          <th scope="col" class="text-sm font-medium text-primary px-6 py-4 text-left">Email</th>
          <th scope="col" class="text-sm font-medium text-primary px-6 py-4 text-left">Password</th>
          <th scope="col" class="text-sm font-medium text-primary px-6 py-4 text-left">DOB</th>
          <th scope="col" class="text-sm font-medium text-primary px-6 py-4 text-left">Accepted Terms?</th>
        </tr>
    </tr>
   </thead> 
   <tbody>
    ${entries} 
    </tbody>
    </table></div></div></div></div>`;
  let details = document.getElementById("user-entries");
  details.innerHTML = table;
};

const saveUserForm = (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const acceptTermsAndConditions =
    document.getElementById("acceptTerms").checked;
  const userDetails = {
    name,
    email,
    password,
    dob,
    acceptTermsAndConditions,
  };
  userEntries.push(userDetails);
  localStorage.setItem("user-entries", JSON.stringify(userEntries));
  // Clear the form
  document.getElementById("user-form").reset();
  // Display the entries
  document.getElementById("user-entries") && displayEntries();
};

let form = document.getElementById("user-form");
form.addEventListener("submit", saveUserForm, true);

const viewResponses = () => {
  const responseDiv = document.getElementById("responses");
  responseDiv.className = "border border-primary rounded-lg p-4 w-full mt-5";
  responseDiv.innerHTML = `<h2 class="text-4xl font-bold text-center mb-2">Entries</h2>
    <div id="user-entries"></div>`;
  displayEntries();
};

const dateInput = document.getElementById("dob");
const date = new Date();
const minAge = new Date(
  date.getFullYear() - 18,
  date.getMonth(),
  date.getDate()
);
const maxAge = new Date(
  date.getFullYear() - 55,
  date.getMonth(),
  date.getDate()
);

dateInput.max = minAge.toISOString().split("T")[0];
dateInput.min = maxAge.toISOString().split("T")[0];

dateInput.addEventListener("input", function (event) {
  if (dateInput.validity.rangeOverflow) {
    dateInput.setCustomValidity("You should be atleast 18 years old!");
    dateInput.reportValidity();
  } else if (dateInput.validity.rangeUnderflow) {
    dateInput.setCustomValidity("You age must be less than 55 years old!");
    dateInput.reportValidity();
  } else {
    dateInput.setCustomValidity("");
  }
});
