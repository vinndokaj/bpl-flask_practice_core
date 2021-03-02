
$( document ).ready(function(){
    
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