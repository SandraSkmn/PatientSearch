//Variables//

let nhsNumber;
let lastName;
let firstName;
let DOB;

let numberValid = false;
let lastNameValid = false;
let firstNameValid = false;

let allValid = false;

let numberFilled = false;
let lastNameFilled = false;
let firstNameFilled = false;
let dobFilled = false;

let nhsNumberFormat;
let lastNameFormat;
let firstNameFormat;
let DOBFormat;

let finalSearchTerm;

let currentResponse;
let resultPosition;


const allowedCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", 
    "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "-", " ", "'"];


//Set maximum date input to today//
document.getElementById("dob").max = new Date().toISOString().split("T")[0];

//Function to set form input as variables//

function setInput() {
   
    nhsNumber = document.getElementById("nhs_no").value;
    lastName = document.getElementById("surname").value;
    firstName = document.getElementById("name").value;
    DOB = document.getElementById("dob").value;
    
}


//Functions to check for valid inputs//

function checkNotEmpty() {
    
    if (nhsNumber == "" &&
        lastName == "" &&
        firstName == "" &&
        DOB == "") {
            alert("Please fill in at least one search field");
            numberFilled = false;
            firstNameFilled = false;
            lastNameFilled = false;
            dobFilled = false;
            return false;
    } else {
        return true;
    }
}

function checkNumber(nhsNumber) {
    if (nhsNumber.includes(".")) {
        alert("NHS numbers are a 10 digit number consisting only of digits 0-9");
    } else if (nhsNumber.length != 10) {
        alert("NHS numbers must be 10 digits in length");
    } else {
        numberValid = true;

    }
}

function checkLastName(lastName) {
    
    let lastValid = true;


    for (let i = 0; i < lastName.length; i++) {
        if (!allowedCharacters.includes(lastName[i].toLowerCase())) {
            lastValid = false;
        }
    }

    if (!lastValid) {
        alert("Last Name field must only contain alphabetical characters, spaces, hyphens or apostrophes");
    }


    lastNameValid = lastValid;

}

function checkFirstName(firstName) {
    
    let firstValid = true;

    for (let i = 0; i < firstName.length; i++) {
        if (!allowedCharacters.includes(firstName[i].toLowerCase())) {
            firstValid = false;
        }
    }

    if (!firstValid) {
        alert("First Name field must only contain alphabetical characters, spaces, hyphens or apostrophes");
    }

    firstNameValid = firstValid;

}


//function combining all checks//

function checkValid() {

    if (checkNotEmpty()) {
        if (nhsNumber != "") {
            checkNumber(nhsNumber);
            numberFilled = true;
        } else {
            numberFilled = false;
            numberValid = true;
        }

        if (lastName != "") {
            checkLastName(lastName);
            lastNameFilled = true;
        } else {
            lastNameFilled = false;
            lastNameValid = true;
        }

        if (firstName != "") {
            checkFirstName(firstName);
            firstNameFilled = true;
        } else {
            firstNameFilled = false;
            firstNameValid = true;
        }

        if (DOB != "") {
            dobFilled = true;
        } else {
            dobFilled = false;
        }
    }

}

function overallCheck() {

    allValid = numberValid && lastNameValid && firstNameValid

}


//On reset clear variables// 

function clearVariables() {
    numberValid = false;
    lastNameValid = false;
    firstNameValid = false;

    allValid = false;

    numberFilled = false;
    lastNameFilled = false;
    firstNameFilled = false;
    dobFilled = false;

    nhsNumberFormat = "";
    lastNameFormat = "";
    firstNameFormat = "";
    DOBFormat = "";

    finalSearchTerm = "";

    currentResponse = "";
    resultPosition = null;


}

function clearInput() {
    document.getElementById("nhs_no").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
    
    nhsNumber = "";
    lastName = "";
    firstName = "";
    DOB = "";

    clearVariables();
    hideOutput();
}

function hideOutput() {
    document.getElementById("result_container").style.display= "none";
    document.getElementById("result_search").style.display= "block";
    document.getElementById("result_list").style.display= "none";
    document.getElementById("result_none").style.display= "none";
    document.getElementById("record_container").style.display= "none";
    document.getElementById("reset_all_container").style.display= "none";

    document.getElementById("result_list").innerHTML = "";
}

//Change form inputs into request format//

function formatInput() {

    if (allValid) {
        nhsNumberFormat = "identifier=https://fhir.nhs.uk/Id/nhs-number%7C" + nhsNumber;
        lastNameFormat = "family=" + lastName.toLowerCase();
        firstNameFormat = "given=" + firstName.toLowerCase();
        DOBFormat = "birthdate=" + DOB;
    }

}

//Create variable with all filled fields to add to fetch request//

function createSearch() {
    
    let currentSearch = "";

    if (numberFilled) {
        currentSearch += nhsNumberFormat;
    }

    if (lastNameFilled && currentSearch == "") {
        currentSearch += lastNameFormat;
    } else if (lastNameFilled) {
        currentSearch += "&&" + lastNameFormat;
    }

    if (firstNameFilled && currentSearch == "") {
        currentSearch += firstNameFormat;
    } else if (firstNameFilled) {
        currentSearch += "&&" + firstNameFormat;
    }

    if (dobFilled && currentSearch == "") {
        currentSearch += DOBFormat;
    } else if (dobFilled) {
        currentSearch += "&&" + DOBFormat;
    }

    return currentSearch;
}

//Fetch request//


async function getResponse(searchTerms) {
    let object;
    const response = await fetch(`https://59ae2c9240f849f6ac.develop.eu-west-2.quickfhir.cloud/FHIR/Patient?${searchTerms}`, {
        headers: {
            'x-api-key': 'eXyaAcJ9fhpLuhB42YwKQOJ7XgmVYOaP',
            'Authorization': 'Basic dGVzdHVzZXJAYmxhY2twZWFyLmNvbTphcmVxdWVzdA=='
        }
    });

    object = await response.json();

    return await object;

}


//Async function that constructs request with search term and awaits API response - further functions nested within to then display these//


async function showResponse() {
    formatInput();
    
    let answer = await getResponse(createSearch());
    console.log(answer);

    currentResponse = answer;
    

    //return total number of matching searches//
    function showTotal() {
        let totalResults = answer.total;
        return totalResults
    }

    //Display if no matching results//

    function displayNone() {

        document.getElementById("result_search").style.display= "none";
        document.getElementById("result_none").style.display= "block";
    
    }


    //If matching results exist, create that number of html elements//

    function displaySome(total) {

        document.getElementById("result_search").style.display= "none";
        document.getElementById("result_list").style.display= "flex";

        let headingDiv = document.createElement("div");
        headingDiv.id = "result_fields";

        let nhsField = document.createElement("div");
        nhsField.classList.add("field");
        nhsField.id = "field_nhs";
        nhsField.innerHTML = "<h4>NHS Number:</h4>"
        headingDiv.appendChild(nhsField);

        let firstField = document.createElement("div");
        firstField.classList.add("field");
        firstField.id = "field_first";
        firstField.innerHTML = "<h4>First Name:</h4>"
        headingDiv.appendChild(firstField);

        let surnameField = document.createElement("div");
        surnameField.classList.add("field");
        surnameField.id = "field_surname";
        surnameField.innerHTML = "<h4>Last Name:</h4>"
        headingDiv.appendChild(surnameField);

        let dobField = document.createElement("div");
        dobField.classList.add("field");
        dobField.id = "field_dob";
        dobField.innerHTML = "<h4>Date of Birth:</h4>"
        headingDiv.appendChild(dobField);

        document.getElementById("result_list").appendChild(headingDiv);

        for (let i = 0; i < total; i++) {
            let newDiv = document.createElement("div");
            newDiv.id = `${i}`;
            newDiv.classList.add("single_result");
            newDiv.setAttribute("onclick", "getPosition(this.id); showRecord()");
            
            let nhsDiv = document.createElement("div");
            nhsDiv.classList.add("result_nhs", "field");
            nhsDiv.innerHTML = `<p>${answer.entry[i].resource.identifier[0].value}</p>`;

            let firstDiv = document.createElement("div");
            firstDiv.classList.add("result_first", "field");
            firstDiv.innerHTML = `<p>${answer.entry[i].resource.name[0].given[0]}</p>`;

            let surnameDiv = document.createElement("div");
            surnameDiv.classList.add("result_surname", "field");
            surnameDiv.innerHTML = `<p>${answer.entry[i].resource.name[0].family[0]}</p>`;

            let dobDiv = document.createElement("div");
            dobDiv.classList.add("result_dob", "field");
            dobDiv.innerHTML = `<p>${answer.entry[i].resource.birthDate}</p>`;

            newDiv.appendChild(nhsDiv);
            newDiv.appendChild(firstDiv);
            newDiv.appendChild(surnameDiv);
            newDiv.appendChild(dobDiv);

            document.getElementById("result_list").appendChild(newDiv);
        }
    }




    //Combined code//

    if (showTotal() == 0) {
        displayNone();
    } else {
        displaySome(showTotal());
    }
    

}

//Function that shows more of patient record when result is clicked//

function displayRecord(firstname, surname, nhs, dob, gender, address1, address2, address3, address4, postcode, 
    gp, gpcontact, gpaddress1, gpaddress2, gpaddress3, gpaddress4, gppostcode) {


        document.getElementById("record_container").style.display = "block";
        document.getElementById("reset_all_container").style.display = "flex";

        document.getElementById("record_name").innerHTML = `<h2>${firstname} ${surname}<h2>`;
        document.getElementById("record_nhs").innerHTML = `<h2>NHS Number: ${nhs}<h2>`;

        document.getElementById("column_1").innerHTML = `<p><b>Date of birth: </b>${dob}</p>`;
        document.getElementById("column_1").innerHTML += `<p><b>Gender: </b>${gender}</p><br>`;
        document.getElementById("column_1").innerHTML += `<p><b>Address:</b></p>`;
        document.getElementById("column_1").innerHTML += `<p>${address1}</p>`;
        document.getElementById("column_1").innerHTML += `<p>${address2}</p>`;
        document.getElementById("column_1").innerHTML += `<p>${address3}</p>`;
        document.getElementById("column_1").innerHTML += `<p>${address4}</p>`;
        document.getElementById("column_1").innerHTML += `<p>${postcode}</p>`;

        document.getElementById("column_2").innerHTML = `<p><b>GP Surgery: </b>${gp}</p>`;
        document.getElementById("column_2").innerHTML += `<p><b>Contact - </b>${gpcontact}</p><br>`;
        document.getElementById("column_2").innerHTML += `<p><b>GP Address:</b></p>`;
        document.getElementById("column_2").innerHTML += `<p>${gpaddress1}</p>`;
        document.getElementById("column_2").innerHTML += `<p>${gpaddress2}</p>`;
        document.getElementById("column_2").innerHTML += `<p>${gpaddress3}</p>`;
        document.getElementById("column_2").innerHTML += `<p>${gpaddress4}</p>`;
        document.getElementById("column_2").innerHTML += `<p>${gppostcode}</p>`;
}

//Function that sets position of clicked result in global variable/

function getPosition(id) {
    let position = parseInt(id);
    resultPosition = position;
}

//function that creates variable arguments for filling records for displayRecord function above//

function defineRecord(position) {

    let initialJSON = currentResponse.entry[position].resource;

    let firstHolder = initialJSON.name[0].given[0];
    let lastHolder = initialJSON.name[0].family[0];
    let nhsHolder = initialJSON.identifier[0].value;
    let dobHolder = initialJSON.birthDate;
    let genderHolder = initialJSON.gender;
    let address1Holder = initialJSON.address[0].line[0];
    let address2Holder = initialJSON.address[0].line[1];
    let address3Holder = initialJSON.address[0].line[2];
    let address4Holder = initialJSON.address[0].line[3];
    let postcodeHolder = initialJSON.address[0].postalCode;

    let gpHolder = initialJSON.contained[0].name;
    let gpContactHolder = initialJSON.contained[0].telecom[0].value;
    let gpAddressHolder1 = initialJSON.contained[0].address[0].line[0];
    let gpAddressHolder2 = initialJSON.contained[0].address[0].line[1];
    let gpAddressHolder3 = initialJSON.contained[0].address[0].line[2];
    let gpAddressHolder4 = initialJSON.contained[0].address[0].line[3];
    let gpPostcodeHolder = initialJSON.contained[0].address[0].postalCode;

    displayRecord(firstHolder,lastHolder,nhsHolder,dobHolder,genderHolder,address1Holder,address2Holder,address3Holder,address4Holder,postcodeHolder,
        gpHolder,gpContactHolder,gpAddressHolder1,gpAddressHolder2, gpAddressHolder3, gpAddressHolder4, gpPostcodeHolder);
}

//Onclick function to show record//

function showRecord() {
    defineRecord(resultPosition);
}

//Overall code on submit//

function formSubmit() {
    clearVariables();
    hideOutput();
    setInput();
    checkValid();
    overallCheck();

    if (allValid) {
        document.getElementById('result_container').style.display= 'block';
        showResponse();
    }
}





