function Background(colour){
    if (colour=="green"){
        document.getElementById("header").style.backgroundImage = "url('css/img/Green.svg')";
    } else if (colour=="blue"){
        document.getElementById("header").style.backgroundImage = "url('css/img/Blue.svg')";
    } else if (colour=="purple"){
        document.getElementById("header").style.backgroundImage = "url('css/img/Purple.svg')";
    }
    localStorage.setItem('ToDoHeader',colour);
}

let LIST = [];
let id = 0;

window.onload = function() {
    
    //Set header
    Background(localStorage.getItem('ToDoHeader'));
    
    //Set date
    let options = {weekday:'short', month:'short',day:'numeric'};
    let today = new Date();
    document.getElementById("date").innerHTML = today.toLocaleDateString("en-AU",options);
    
    //Open Delete All Modal
    const deleteAll = document.getElementById("IconDeleteAll");
    const deleteAllModal = document.getElementById("DeleteAllConfirmation");
    
    deleteAll.onclick = function() {
        deleteAllModal.style.display = "block";
    }
    
    //Cancel Delete All
    const cancelDeleteAll = document.getElementById("CancelDelete");
    
    cancelDeleteAll.onclick = function () {
        deleteAllModal.style.display = "none";
    }
    
    //Delete All
    document.getElementById("ConfirmDeleteAll").onclick = function () {
        localStorage.removeItem('TODOLIST');
        LIST = [];
        document.getElementById("completed").innerHTML = "";
        document.getElementById("list").innerHTML = "";
        deleteAllModal.style.display = "none";
        id = 0;
    }
    
    //Navigation
    const list = document.getElementById("list");
    const completed = document.getElementById("completed");
    const toDoBtn = document.getElementById("ToDo");
    const completedBtn = document.getElementById("Completed");
    
    toDoBtn.onclick = function() {
        if (!toDoBtn.classList.contains("active")){
            toDoBtn.classList.toggle("active");
            completedBtn.classList.toggle("active");
            list.style.display="block";
            completed.style.display="none";
        }
    }
    
    completedBtn.onclick = function() {
        if (!completedBtn.classList.contains("active")){
            toDoBtn.classList.toggle("active");
            completedBtn.classList.toggle("active");
            list.style.display="none";
            completed.style.display="block";
        }
    }
    
    //Open modal to create To Do
    var modalbtn = document.getElementById("add-to-do");
    var modal = document.getElementById("CreateTask");

    modalbtn.onclick = function() {
        modal.style.display = "block";
        document.getElementById("name").select();
    }

    //Set min value for due date picker
    minDate = today.toISOString().substring(0,10);
    document.getElementById("duedate").min = minDate;
    
    //Cancel task creation
    var cancelbtn = document.getElementById("CancelTask");
    
    cancelbtn.onclick = function() {
        
        modal.style.display = "none";
        document.getElementById("name").value = "";
        document.getElementById("subtasks").innerHTML = "";
        document.getElementById("duedate").value = "";
        document.getElementById("subtaskInput").value = "";
        document.getElementById("confirmRecur").checked = false;
        document.getElementById("recurFrequency").value = 7;
        document.getElementById("recurFrequency").style.display = "none";
        subtaskInput.style.display = "block";
    }
    
    //Add task
    const CHECK = "fa-check-circle";
    const UNCHECK = "fa-circle-thin";
    const LINE_THROUGH = "lineThrough";
    
    function addToDo(toDo,date,id,done,trash,colour,subtasks,completion){
        if (trash){ return; }
        
        const DONE = done ? CHECK : UNCHECK;
        const LINE = done ? LINE_THROUGH:"";
        const addTo = done ? completed : list;
        const taskColour = colours[colour];
        const position = "beforeend";
        var displayDate = "";
        if (date) {
            displayDate = date.getDate().toString() + " " +months[date.getMonth()];
        }
        
        if(displayDate == "NaN undefined") {
            displayDate = "";
        }
        
        if (subtasks.length==0){
            const item = `<li class="item" style="background-color:${taskColour}">
                            <i class="co fa ${DONE}" job="complete" id="${id}"></i>
                            <p class="text ${LINE}"> ${toDo}</p>
                            <p class="date">${displayDate}</p>
                            <i class="de fa fa-trash"  job="delete" id="${id}"></i>
                        </li>`;
            addTo.insertAdjacentHTML(position,item);
        } else {
            
            const item = `<li class="item" style="height:100%;background-color:${taskColour}" id="${id}" >
                            <i class="fa fa-caret-down" id="${id}" aria-hidden="true" job="dropdown"></i>
                            <p class="text ${LINE}"> ${toDo}</p>
                            <p class="date">${displayDate}</p>
                            <i class="de fa fa-trash" job="delete" id="${id}"></i>
                            <ul class="sublist"     id="sublist${id}" style="display:none"></ul>
                          </li>`;
            addTo.insertAdjacentHTML(position,item);
         
            for (var i = 0;i<subtasks.length;i++) {
                let fit_size = "";
                if (subtasks[i].toString().length >= 30) {
                    fit_size="height:50px;";
                }
                const subDone = completion[i] ? "fa-check-square-o":"fa-square-o";
                const lineThrough = completion[i] ? "lineThrough" : "";
                const subItem = `<li class = "sublist-item" style="background-color:${taskColour};${fit_size}">
                                    <i class="fa ${subDone}" aria-hidden="true" id="s${i}" job="CompleteSubTask"></i>
                                    <p class="text ${lineThrough}"> ${subtasks[i]}</p>
                                </li>`
                const selector = "sublist"+id.toString();
                const addList = document.getElementById(selector);
                addList.insertAdjacentHTML(position,subItem);
            }
        }
    }
    
    const addButton = document.getElementById("AddTask");
    const nameInput = document.getElementById("name");
    const dateInput = document.getElementById("duedate");
    const colourButton = document.getElementById("colourSelect");
    
    const colours = ["rgb(241, 241, 241)","rgb(253, 233, 223)","rgb(252, 247, 222)","rgb(222, 253, 224)","rgb(222, 243, 253)","rgb(240, 222, 253)"];
    
    colourButton.onclick = function() {
        let next = colours.indexOf(getComputedStyle(colourButton).backgroundColor);
        if (next == 5) {next = -1;}
        colourButton.style.backgroundColor = colours[next+1]
    }
    
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
    //Pressed add to do
    
    addButton.onclick = function() {
        
        const toDo = nameInput.value;
        const date = duedate.value.slice(8,10);
        const month = duedate.value.slice(5,7);
        const year = duedate.value.slice(0,4);
        
        let due = "";
        if (duedate.value){
            due = new Date()
            due.setDate(parseInt(date));
            due.setMonth(parseInt(month));
            due.setYear(parseInt(year));
            due = due.toString();
        }
        if (toDo){
            colourIndex = colours.indexOf(getComputedStyle(colourButton).backgroundColor)
            const SUBTASKS = document.getElementById("subtasks").textContent.split("---");
            SUBTASKS.shift();
            const SUBTASKCOMPLETE = [];
            for (let i = 0;i<SUBTASKS.length;i++) {
                SUBTASKS[i] = [SUBTASKS[i].trim()];
                SUBTASKCOMPLETE.push(false);
            }
            let RECURSE = -1;
            if (document.getElementById("confirmRecur").checked == true){
                if ((SetRecur.value)&&(duedate.value)) RECURSE = parseInt(SetRecur.value);
            }
            let formated_due = new Date(due);
            addToDo(toDo,formated_due,id,false,false,colourIndex,SUBTASKS,SUBTASKCOMPLETE);
            LIST.push({name:toDo,due:due,id:id,done:false,trash:false,colour:colourIndex,subtasks:SUBTASKS,completion:SUBTASKCOMPLETE,recurse:RECURSE});
            localStorage.setItem("TODOLIST",JSON.stringify(LIST));
            id++;
            modal.style.display = "none";
            document.getElementById("name").value = "";
            document.getElementById("subtasks").innerHTML = "";
            document.getElementById("duedate").value = "";
            document.getElementById("subtaskInput").value = "";
            document.getElementById("confirmRecur").checked = false;
            document.getElementById("recurFrequency").value = 7;
            document.getElementById("recurFrequency").style.display = "none";
            subtaskInput.style.display = "block";
        }
    }
    
    //Subtasks
    
    const subtaskInput = document.getElementById("subtaskInput");
    const subtasks = document.getElementById("subtasks");
    
    subtaskInput.addEventListener("keyup", function(event) {
        if ((event.key === "Enter") && (subtaskInput.value)) {
            toAdd = `<li class="subtaskproto">
                        <p style="display:inline;word-break: break-all">---  ${subtaskInput.value}</p>
                        <i class="co fa fa-times" job="remove"></i>
                     </li>
                    `;
            
            subtasks.insertAdjacentHTML("beforeend",toAdd);
            subtaskInput.value = "";
            if (document.querySelectorAll("#subtasks li").length == 5){
                subtaskInput.style.display = "none";
            }
        }
    });
    
    //Recurring tasks
    
    const confirmRecur = document.getElementById("confirmRecur");
    const SetRecur = document.getElementById("recurFrequency");
    
    SetRecur.value = 7;
    
    confirmRecur.onclick = function () {
        if (SetRecur.style.display == "none") {
            SetRecur.style.display = "inline-block";
            document.getElementById("recurInfo").style.display = "inline-block";
        }
        else { 
            SetRecur.style.display = "none";
            document.getElementById("recurInfo").style.display = "none";
        }
    }
    
    //Recur Info
    
    document.getElementById("recurInfo").onclick = function () {
        const INFO = document.getElementById("tooltiptext")
        if (INFO.style.display == "none") {
            INFO.style.display = "inline-block";
        } else {
            INFO.style.display = "none";
        }
    }
    
    //Open subtasks
    
    function openSubtasks(element) {
        const id = "sublist"+element.id.toString();
        const openSublist = document.getElementById(id);
        if (openSublist.style.display == "none") {
            openSublist.style.display = "block";
        } else {
            openSublist.style.display = "none";
        }
        element.classList.toggle("fa-caret-down");
        element.classList.toggle("fa-caret-up");
    }
    
    //Tick off Subtask
    
    function completeSubTask(element){
        
        element.classList.toggle("fa-check-square-o");
        element.classList.toggle("fa-square-o");
        element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
        const ID = element.parentNode.parentNode.parentNode.id;
        const subId = parseInt(element.id.charAt(element.id.length-1));
        LIST[ID].completion[subId] = LIST[ID].completion[subId] ? false : true;
        var count = 0;
        for(var i = 0; i < LIST[ID].completion.length; i++) {
            if(LIST[ID].completion[i] == true) {count ++;}
        }
        if (count == LIST[ID].completion.length) {
            //Check if recursing
            const TASK = LIST[ID];
            if (TASK.recurse>-1) {
                
                var newDate = new Date(TASK.due);
                newDate.setDate(newDate.getDate()+TASK.recurse);
                var newSubComplete = [];
                for (let i = 0; i<TASK.subtasks.length;i++) newSubComplete.push(false);
                
                LIST.push({name:TASK.name,due:newDate,id:id,done:false,trash:false,colour:TASK.color,subtasks:TASK.subtasks,completion:newSubComplete,recurse:TASK.recurse});
                addToDo(TASK.name,newDate,id,false,false,TASK.colour,TASK.subtasks,newSubComplete);
                id++;
                TASK.recurse = -1;
            }
            
            LIST[ID].done = true;
            var moveTo = completed;
            moveTo.appendChild(element.parentElement.parentElement.parentElement);
            element.parentNode.parentNode.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
        }
        localStorage.setItem("TODOLIST",JSON.stringify(LIST));
    }
    
    //Undo Subtask
    
    function moveSubTasks(element){
        element.classList.toggle("fa-check-square-o");
        element.classList.toggle("fa-square-o");
        element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
        const id = element.parentNode.parentNode.parentNode.id;
        const subId = parseInt(element.id.charAt(element.id.length-1));
        LIST[id].completion[subId] = LIST[id].completion[subId] ? false : true;
        LIST[id].done = false;
        var moveTo = list;
        moveTo.appendChild(element.parentElement.parentElement.parentElement);
        element.parentNode.parentNode.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
        localStorage.setItem("TODOLIST",JSON.stringify(LIST));
    }
    
    //Remove subtask from create task modal
    
    subtasks.addEventListener("click",function(event){
        const element = event.target;    
        if (!element.attributes.job) return ;
        const elementJob = element.attributes.job.value;
        if (elementJob == "remove") {
            element.parentNode.parentNode.removeChild(element.parentNode);
        }
        if (subtaskInput.style.display == "none") {
            subtaskInput.style.display = "block";
        }
    });
    
    //Tick off To Do
    
    function completeToDo(element){
        //Check if recursing
        const TASK = LIST[element.id];
        if (TASK.recurse>-1) {
      
            var newDate = new Date(TASK.due);
            newDate.setDate(newDate.getDate()+TASK.recurse);
            
            LIST.push({name:TASK.name,due:newDate.toString(),id:id,done:false,trash:false,colour:TASK.colour,subtasks:[],completion:[],recurse:TASK.recurse});
            addToDo(TASK.name,newDate,id,false,false,TASK.colour,[],[]);
            id++;            
        }
        
        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
        LIST[element.id].done = LIST[element.id].done ? false : true;
        
        var moveTo = element.parentElement.parentElement.id == "list" ? completed : list;
        moveTo.appendChild(element.parentElement);
        localStorage.setItem("TODOLIST",JSON.stringify(LIST));
    }
    
    function removeToDo(element){
        element.parentNode.parentNode.removeChild(element.parentNode);
        LIST[element.id].trash = true;
        localStorage.setItem("TODOLIST",JSON.stringify(LIST));
        if ((!list.hasChildNodes())&&(!completed.hasChildNodes())) {
            localStorage.setItem("TODOLIST","");
            LIST = [];
            id = 0;
        }
    }
    
    list.addEventListener("click",function(event){
        const element = event.target;
        if (!element.attributes.job) {return ;}
        const elementJob = element.attributes.job.value;
        
        if (elementJob == "complete"){
            completeToDo(element);
        } else if (elementJob =="delete"){
            removeToDo(element);
        } else if (elementJob == "dropdown") {
            openSubtasks(element);
        } else if (elementJob == "CompleteSubTask") {
            completeSubTask(element);
        }
    });
    
    completed.addEventListener("click",function(event){
        const element = event.target;
        if (!element.attributes.job) {return ;}
        const elementJob = element.attributes.job.value;
        
        if (elementJob == "complete"){
            completeToDo(element);
        } else if (elementJob =="delete"){
            removeToDo(element);
        } else if (elementJob == "dropdown") {
            openSubtasks(element);
        } else if (elementJob == "CompleteSubTask") {
            moveSubTasks(element);
        };
    });
    
    //Get Data from local storage
    let data = localStorage.getItem("TODOLIST");
    if (data){
        LIST = JSON.parse(data);
        id = LIST.length;
        loadList(LIST);
    }

    //Load Data

    function loadList(array){
        array.forEach(function(item){
            var formated_due = new Date(item.due)
            addToDo(item.name,formated_due,item.id,item.done,item.trash,item.colour,item.subtasks,item.completion);
        });
    }
}