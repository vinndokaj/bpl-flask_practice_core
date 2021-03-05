const FORM_FIELDS = {
    Name:{type:'text'},
    Email:{type:'email'},
    Age:{type:'number'},
    Gender:{type:'select', options:[{value:0, name:'Male'}, {value:1, name:'Female'}]},
    Feedback:{type:'textarea'},
}

const BUTTONS = [
    {type:'submit', text:'Submit', class:'btn btn-primary', onclick:''},
    {type:'button', text:'Edit', class:'btn btn-secondary', onclick:'editSelected()'},
    {type:'button', text:'Delete', class:'btn btn-danger', onclick:'deleteSelected()'},
]

const URL_PATH = 'http://127.0.0.1:5000'

$( document ).ready(function(){
    buildPage()
    getTableData()
    addEventListeners()
})

//Building page using only jQuery
function buildPage(){
    //general page set up
    $("body")
    .append('<div class="container"><div class="row"></div></div>')

    $(".row")
        .append("<div class='col' id='form-card'></div>")
        .append("<div class='col' id='data-card'></div>")

    //instatiate form
    $("#form-card")
        .append('<form name="personalInfo" onsubmit="return submitForm()"></form>')
    
    //instatiate form fields
    for(const key in FORM_FIELDS){
        if(FORM_FIELDS[key].type == 'select'){
            $("form").append(`<div class="form-group"> <label for="${key}">${key}:</label> <select class="form-control" name="${key}" id="${key}"><option value="">-- Select --</option></select></div>`)
            for(let i=0; i < FORM_FIELDS[key].options.length; i++) {
                $("form select:last-of-type").append(`<option value="${FORM_FIELDS[key].options[i].value}">${FORM_FIELDS[key].options[i].name}</option>`)
            }
        } else {
            $('form').append(`<div class="form-group"><label for="${key}">${key}:</label> <input type="${FORM_FIELDS[key].type}" class="form-control" name="${key}" id="${key}"></div>`)
        }
    }

    //instatiate BUTTONS
    $('form').append('<div class="form-row">')
    for(let i=0; i < BUTTONS.length; i++){
        $('form').append(`<button type="${BUTTONS[i].type}" class="${BUTTONS[i].class}" onClick="${BUTTONS[i].onclick}">${BUTTONS[i].text}</button>`)
    }
    $('form').append('</div>')

    $('#data-card')
        .append('<table class="table"><thead><tr></tr></thead><tbody></tbody></table>')
}

//listener events for table rows
function addEventListeners() {
    $(document).on({
        mouseenter: function () {
            $(this).css("background-color", "#B4D5FE")
        },
        mouseleave: function () {
            if(!$(this).hasClass('selected')){
                $(this).css("background-color", "")
            }
        },
        click: function() {
            if($('.selected').length > 0 ){
                $('.selected')
                    .removeClass('selected')
                    .css("background-color", "")
            } else {
                $(this).toggleClass('selected');
            }
        },
        dblclick: function() {
            loadSelectedData(this)
        }
    }, "tbody tr");
} 

function getTableData(){
    //get data from flask server and use it to populate table data
    $.get(`${URL_PATH}/list`, function(data) {
        if(data.length == 0){
            $('thead tr').append('<th>No data to display</th>')
        } else {
            populateTable(data)
        }
    }, "json")
    .fail(function() {alert( "error with ajax get")})
}

//populate table using parsed JSON array 
function populateTable(data){
    //generic table headers allowing variable columns
    for(const key in data[0]){
        $("thead tr").append(`<th scope="col">${key}</th>`)
    }

    //iterate over every object in parsed JSON array 
    for(let i=0; i < data.length; i++){
        let obj = data[i]
        let first = true;

        //add each entry into the table 
        $('tbody').append(`<tr id="row-${data[i].id}">`)
        for(const key in obj){
            //convert boolean to Male/Female if key gender
            let value = (key == "Gender") ? (obj[key] ? "Female" : "Male") : obj[key]

            //if first element (id) make id bold 
            if(first){
                $(`#row-${data[i].id}`).append(`<th scope="row" class=${key}>${value}</th>`)
                first=false;
            } else {
                $(`#row-${data[i].id}`).append(`<td class=${key}>${value}</td>`)
            }
        }
        $(`tbody`).append('</tr>')
    }
} //end populateTable

//submit form to server
//uses validate functions and ajax call to submit
function submitForm() {
    //filled array is a truthy value
    if(validateForm()){
        let newData = getFormData()

        $.ajax({
            type:"POST",
            contentType: "application/json",
            url:`${URL_PATH}/create`,
            dataType: 'json',
            data:JSON.stringify(newData),
            success: function(){alert("success")}
        })
    } else {
        console.log('data is bad')
        return false;
    }
} //end submitForm

//edit selected row with data from form 
function editSelected() {
    if($('.selected').length == 0){
        console.log('nothing is selected to edit')
        return false
    }

    if(validateForm()){
        let newData = getFormData()
        newData['id'] = $('.selected').attr('id').slice(-1);

        $.ajax({
            type:"PUT",
            contentType: "application/json",
            url:`${URL_PATH}/change`,
            dataType: 'json',
            data:JSON.stringify(newData),
            success: function(){location.reload()}
        })

    } else {
        console.log('Invalid data to edit')
    }
    return true
} //end deleteSelected

//delete selected row from table
function deleteSelected() {
    if($('.selected').length == 0){
        console.log('nothing is selected to delete')
        return false
    }

    let id = $('.selected').attr('id').slice(-1);

    $.ajax({
        type:"DELETE",
        url:`${URL_PATH}/delete/${id}`,
        success: function(){location.reload()}
    })    
} //end deleteSelected

//TODO error notifications
function validateForm() {
    let flag = true;
    let field_errors = []

    for(const field in FORM_FIELDS){
        $(`#${field}`).removeClass('is-invalid')
        if(!validateAux(document.forms.personalInfo[field])){
            field_errors.push({key:field, errors:{message:`Improper input for ${field}`}})
            flag = false;
        }
    }

    field_errors.forEach(error => {
        $(`#${error.key}`).addClass('is-invalid')
    })

    return flag
} //end validateForm

function loadSelectedData(row){
    let rowData = $(row)[0].cells
    for(let i=0; i < rowData.length; i++){
        if(rowData[i].className == "Gender"){
            let boolGender = (rowData[i].innerText == "Female") ? 1 : 0
            $(`#${rowData[i].className}`).val(boolGender)

        }else{
            $(`#${rowData[i].className}`).val(rowData[i].innerText)
        }
    }
}

//auxilary function to validate specific fields of data
//atm only checks for empty inputs and invalid email
function validateAux(input){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var val = input.value.trim();
    if (val == "") {return false;}
    if ((input.type == 'email')  && (!(val.match(mailformat)))) {return false;}
    return true;
} //end validateAux

//**Form must be validated before using this function
function getFormData(){
    const formData = {}

    for(const field in FORM_FIELDS){
        formData[field] = document.forms.personalInfo[field].value
    }

    console.log(formData)

    return formData
}