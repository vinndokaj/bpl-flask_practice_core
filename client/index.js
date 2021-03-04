$( document ).ready(function(){
    //Building page using only jQuery
    $("body")
        .append('<div class="container"><div class="row"></div></div>')

    $(".row")
        .append("<div class='col' id='form-card'></div>")
        .append("<div class='col' id='data-card'></div>")

    $("#form-card")
        .append('<form name="personalInfo" onsubmit="return submitForm()"></form>')
    
    $("form")
    .append('<div class="form-group"><label for="Name">Name: </label> <input type="text" class="form-control" name="Name" id="Name"></div>')
    .append('<div class="form-group"><label for="Email">Email Address: </label> <input type="email" class="form-control" name="Email" id="Email"></div>')
    .append('<div class="form-group"><label for="Age">Age: </label> <input type="number" class="form-control" name="Age" id="Age"></div>')
    .append('<div class="form-group"><label for="Gender">Gender: </label> <select class="form-control" name="Gender" id="Gender"> <option value="0">Male</option> <option value="1">Female</option> </select></div>')
    .append('<div class="form-group"><label for="Feedback">Feedback: </label> <textarea class="form-control" name="Feedback" id="Feedback" rows="3"></textarea></div>')
    .append('<div class="form-row"><button type="submit" class="btn btn-primary">Submit</button> <button type="button" onClick="editSelected()" class="btn btn-secondary">Edit</button> <button type="button" onClick="deleteSelected()" class="btn btn-danger">Delete</button></div>')

    $('#data-card')
        .append('<table class="table"><thead><tr></tr></thead><tbody></tbody></table>')
    
    //get data from flask server and use it to populate table data
    $.get("http://127.0.0.1:5000/list", function(data) {
        if(data.length == 0){
            $('thead tr').append('<th>No data to display</th>')
        } else {
            populateTable(data)
        }
    }, "json")
    .fail(function() {alert( "error with ajax get")})

    //listener events for table rows
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

        }
    }, "tbody tr");

    //populate table using parsed JSON array 
    function populateTable(data){
        //generic table headers allowing variable columns
        for(const key in data[0]){
            $("thead tr").append(`<th scope="col">${key}</th>`)
        }

        //iterate over every object in parsed JSON array 
        for(let i=0; i < data.length; i++){
            let obj = data[i]
            let rowid = `row-${i+1}`
            let first = true;

            //add each entry into the table 
            $('tbody').append(`<tr id="${rowid}">`)
            for(const key in obj){
                //convert boolean to Male/Female if key gender
                let value = (key == "Gender") ? (obj[key] ? "Male" : "Female") : obj[key]

                //if first element (id) make id bold 
                if(first){
                    $(`#${rowid}`).append(`<th scope="row">${value}</th>`)
                    first=false;
                } else {
                    $(`#${rowid}`).append(`<td>${value}</td>`)
                }
            }
            $(`tbody`).append('</tr>')
        }
    } //end populateTable
})

//REFERENCE ERRORS WHEN FUNCTIONS INSIDE ON DOCUMENT READY. WHY?

//submit form to server
//uses validate functions and ajax call to submit
function submitForm() {
    let data = validateForm()

    //filled array is a truthy value
    if(data){
        let newData = convertData(data)

        $.ajax({
            type:"POST",
            contentType: "application/json",
            url:"http://127.0.0.1:5000/create",
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

    let data = validateForm()
    if(data){
        let id = $('.selected').attr('id').slice(-1);
        newData = convertData(data)
        newData['id'] = id;

        $.ajax({
            type:"PUT",
            contentType: "application/json",
            url:"http://127.0.0.1:5000/change",
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
        url:`http://127.0.0.1:5000/delete/${id}`,
        success: function(){location.reload()}
    })    
} //end deleteSelected

//TODO error notifications
function validateForm() {
    const data = [
        {key:'Name', value:""},
        {key:'Email', value:""},
        {key:'Age', value:""},
        {key:'Gender', value:""},
        {key:'Feedback', value:""}
    ];

    for(let i=0; i < data.length; i++){
        if(!validateAux(document.forms.personalInfo[data[i].key])){
            console.log(`Improper input for ${data[i].key}`)
            return false;
        }
        data[i].value = document.forms.personalInfo[data[i].key].value
    }
    return data;
} //end validateForm

//auxilary function to validate specific fields of data
//atm only checks for empty inputs and invalid email
function validateAux(input){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var val = input.value.trim();
    if (val == "") {return false;}
    if ((input.type == 'email')  && (!(val.match(mailformat)))) {return false;}
    return true;
} //end validateAux

//convert array of data into an object with proper key:value to
//send to server
function convertData(data){
    let newData = {}

    for(let i=0; i < data.length; i++){
        newData[data[i].key] = data[i].value;
    }

    return newData
} //end convertData