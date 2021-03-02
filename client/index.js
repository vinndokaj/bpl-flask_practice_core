
$( document ).ready(function(){
    //Building page using only jQuery
    $("body")
        .append('<div class="container"><div class="row"></div></div>')

    $(".row")
        .append("<div class='col' id='form-card'></div>")
        .append("<div class='col' id='data-card'></div>")

    $("#form-card")
        .append('<form name="personalInfo" onsubmit=""></form>')
    
    $("form")
    .append('<div class="form-group"><label for="name">Name: </label> <input type="text" class="form-control" id="name"></div>')
    .append('<div class="form-group"><label for="email">Email Address: </label> <input type="email" class="form-control" id="email"></div>')
    .append('<div class="form-group"><label for="age">Age: </label> <input type="number" class="form-control" id="age"></div>')
    .append('<div class="form-group"><label for="gender">Gender: </label> <select class="form-control" id="gender"> <option value="0">Male</option> <option value="1">Female</option> </select></div>')
    .append('<div class="form-group"><label for="feedback">Feedback: </label> <textarea class="form-control" id="feedback" rows="3"></textarea></div>')
    .append('<div class="form-row"><button type="submit" class="btn btn-primary">Submit</button> <button onClick="editSelected()" class="btn btn-secondary">Edit</button> <button onClick="deleteSelected()" class="btn btn-danger">Delete</button></div>')

    $('#data-card')
        .append('<table class="table"><thead><tr></tr></thead><tbody></tbody></table>')
    
    //get data from flask server and use it to populate table data
    $.get("http://127.0.0.1:5000/list", function(data) {
        if(data.length == 0){
            console.log("no data to display")
        } else {
            populateTable(data)
        }
    }, "json")
    .fail(function() {alert( "error with ajax get")})

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
            if($('.selected').length > 0){
                $('.selected')
                    .removeClass('selected')
                    .css("background-color", "")
            }
            $(this).addClass('selected')
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
            let rowid = `row-${i}`
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
    }

    function validateForm() {
    }

    function editSelected() {

    }

    function deleteSelected() {
    }
})

/*
$( document ).ready(function(){
    $.get("http://127.0.0.1:5000/list", function(data) {
        console.log(data)
    }, "json")
    .fail(function() {alert( "error with ajax get")})

    let newData =  {
        "Age": 29, 
        "Email": "A@a.com", 
        "Feedback": "Ajax is great", 
        "Gender": 0, 
        "Name": "Alisa"
    }

    $.ajax({
        type:"POST",
        contentType: "application/json",
        url:"http://127.0.0.1:5000/create",
        dataType: 'json',
        data:JSON.stringify(newData),
        success: function(){alert("success")}
    })

    newData['id'] = 2;
    newData['Email'] = "alisa@mail.com"

    $.ajax({
        type:"PUT",
        contentType: "application/json",
        url:"http://127.0.0.1:5000/change",
        dataType: 'json',
        data:JSON.stringify(newData),
        success: function(){alert("success")}
    })

    $.ajax({
        type:"DELETE",
        url:"http://127.0.0.1:5000/delete/2",
        success: function(){alert("success")}
    })
})
*/