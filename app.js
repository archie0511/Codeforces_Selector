

var problemRating="800";
var Contests = new Map()
var Handles = new Set()
var ConType = new Set()

function UpdateContests(){    
    fetch('https://codeforces.com/api/problemset.problems')
    .then(response => response.json())
    .then(data => {
        
        data.result.problems.forEach(contestData => { 
            if(contestData.rating==problemRating)
                Contests.set(contestData.contestId, contestData.index)
        })
    
    })
}

function addHandle(){
    var handle = document.getElementById("handleInp").value;
    if(handle == "" || Handles.has(handle)) return;

    fetch("https://codeforces.com/api/user.info?handles=" + handle)
    .then(response => response.json())
    .then(data => {
        var rating = data.result[0].rating
        Handles.add(handle)

        //Add handle to Table    
        var handleTable = document.getElementById("handleTable")
        var row = handleTable.insertRow(1)

        row.insertCell(0).innerHTML = handle
        row.insertCell(1).innerHTML = rating
        row.insertCell(2).innerHTML = '<i class="trash icon" onclick="removeHandle(this)"></i>'       
    })
}
function addRating()
{
    var rating=document.getElementById("ratingInp").value;
    problemRating=rating;
    alert("Rating updated to: "+problemRating);
}




function removeHandle(btn) {
    var row = btn.parentNode.parentNode

    Handles.delete(row.cells.item(0).innerHTML)
    row.parentNode.removeChild(row)  
}

// function SC(buttonId) {
//     if (document.getElementById(buttonId).classList.contains('active')) ConType.delete(buttonId)
//     else ConType.add(buttonId)
//     document.getElementById(buttonId).classList.toggle('active')
//     document.getElementById(buttonId).blur()
// }

function Show(){
    UpdateContests();
    var AttContests = new Set()
    var fetches = []

    for(let handle of Handles){
        fetches.push(        
        fetch("https://codeforces.com/api/user.status?handle=" + handle)

        .then(response => response.json())
        .then(data => {
                        
            data.result.forEach(contest => {
                if (contest.verdict == "OK")
                    {
                        var id_index=contest.problem.contestId+contest.problem.index;
                        AttContests.add(id_index);
                       // console.log(id_index);
                    }
            })
        })
        )
    }
    
    Promise.all(fetches)
    .then(function(){
        $('#contestTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
    Contests.forEach((contest_index,contest_id) => {
        // flag = true
        // ConType.forEach((type) => {
        //     if(contest_name.indexOf(type) == -1) flag = false
        // })
        //console.log(contest_id);
        var id_index=contest_id+contest_index;
        
        if(!AttContests.has(id_index)){
        
            var contestTable = document.getElementById("contestTable")
            var row = contestTable.insertRow(-1)
            
            row.insertCell(0).innerHTML = '<a href="https://codeforces.com/problemset/problem/' + contest_id +'/'+ contest_index+ '" target="_blank">' + id_index + '</a>'
            row.insertCell(1).innerHTML = contest_id
        }
    })
    })
}



// input.addEventListener("keyup", function(event) {
//     if (event.keyCode === 13) {
//         event.preventDefault();
//         //document.getElementById("handlebtn").click();
//     }
// });

document.addEventListener.btn()('keypress', function (e) {
    if (e.key === 'Enter') {
        addHandle();
        document.getElementById("handleInp").value="";
      // code for enter
    }

    
});

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addRating();
        
      // code for enter
    }

    
});