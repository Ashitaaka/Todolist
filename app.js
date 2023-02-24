// Selectors--------------------------

const toDoInputName = document.querySelector('#task-name');
const toDoInputDescription = document.querySelector('#task-description');
const toDoInputDate = document.querySelector('#task-due-date');
const toDoSubmitButton = document.querySelector('form');

const proListContainer = document.querySelector('#todolist-professionnal');
const persoListContainer = document.querySelector('#todolist-personnal');

const displayPopupBtn = document.querySelectorAll('.display-popup-btn');
const closePopuBtn = document.querySelector('#close-btn');
const popup = document.querySelector('.popup');
let dataIndex = 0;

var ExistOrNot = -1;

// Listeners--------------------------

document.addEventListener('DOMContentLoaded', loadLocalStorage);

toDoSubmitButton.addEventListener('submit', function addOrModify(e){
    if(ExistOrNot > -1){
        e.preventDefault();
        console.log('modification');
        modifyToDo();
        

    }else{
        e.preventDefault();
        addToDo();
        console.log('creation');
    }
});


proListContainer.addEventListener('click', deleteCheckExpand);
persoListContainer.addEventListener('click', deleteCheckExpand);

closePopuBtn.addEventListener('click', () =>{
    displayHidePopup();
    toDoInputName.value = "";
    toDoInputDescription.value = "";
    toDoInputDate.value = "";
    ExistOrNot = -1;
});
displayPopupBtn.forEach(btn => {
    btn.addEventListener('click', displayHidePopup);
    btn.addEventListener('click', taskType);
});



//FUNCTIONS--------------------------

//Function to 'auto check' the radio button depending on the selected category (pro or personnal)
function taskType(e){
    let taskTypeSelected = e.target.nextElementSibling.id;
    const PersoRadioButton = document.getElementById('perso-task');
    const proRadioButton = document.getElementById('pro-task');

    if(taskTypeSelected === 'todolist-personnal'){
        PersoRadioButton.checked = true;
    }
    else{
        proRadioButton.checked = true;
    }
}

//Fuction to reveal popup
function displayHidePopup(){
    popup.classList.toggle('popup-visible');
}

//function addToDo : to add new Task
function addToDo(){

    //task li creation
    const toDoInputType = document.querySelector('input[name="task-type"]:checked').value;
    const toDoLi = document.createElement('div');
    toDoLi.classList.add('todo');
    toDoLi.classList.add('draggable');
    // toDoLi.setAttribute('draggable', true);
    toDoLi.setAttribute('data-index', dataIndex);
    if(toDoInputType === 'professional'){
        proListContainer.appendChild(toDoLi);
    }else if(toDoInputType === 'personnal'){
        persoListContainer.appendChild(toDoLi);
    }
    dataIndex++;

    //title div creation
    const divTitle = document.createElement('div');
    divTitle.classList.add('task-title');
    toDoLi.appendChild(divTitle);
    //expand btn creation
    const expandButton = document.createElement('span');
    expandButton.classList.add("expand-btn");
    divTitle.appendChild(expandButton);
    //Title P creation
    const taskTitleP = document.createElement('p');
    taskTitleP.innerText = toDoInputName.value;
    taskTitleP.classList.add('task-txt');
    divTitle.appendChild(taskTitleP);
    //statut btn creation
    const statutBtn = document.createElement('button');
    statutBtn.innerText="TO DO";
    statutBtn.classList.add('statut-btn-todo');
    divTitle.appendChild(statutBtn);
    //close btn creation
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('btn-close');
    divTitle.appendChild(closeBtn);
    
    //description div creation
    const divDescription = document.createElement('div');
    divDescription.classList.add('task-description');
    toDoLi.appendChild(divDescription);
    //Due Date P creation
    if(toDoInputDate.value.length !== 0){
        const dueDateP = document.createElement('p');
        dueDateP.innerText = "Due date : " + toDoInputDate.value;
        dueDateP.classList.add('date');
        divDescription.appendChild(dueDateP);
    }
    //Description P creation
    if(toDoInputDescription.value.length !== 0){
        const taskdescriptionP = document.createElement('p');
        taskdescriptionP.innerText = toDoInputDescription.value;
        taskdescriptionP.classList.add('description-txt');
        divDescription.appendChild(taskdescriptionP);
    }
    //modify btn creation
    const modifyBtn = document.createElement('button');
    modifyBtn.innerText = "modify this Task";
    modifyBtn.classList.add('modify-btn');
    divDescription.appendChild(modifyBtn);


    //creating an object for each new task
    const toDo = {
        statut : 'false',
        title : toDoInputName.value,
        description : toDoInputDescription.value,
        date : toDoInputDate.value,
        type : toDoInputType,
    }

    //saving the new object in localStorage
    saveToLocalStorage(toDo);
    
    //clearing all inputs
    toDoInputName.value = "";
    toDoInputDescription.value = "";
    toDoInputDate.value = "";  

    //closing the popup
    displayHidePopup();
}

//function modifyToDo : to modify existing Task 
function modifyToDo(){
    let todos;
    todos = JSON.parse(localStorage.getItem('todos'));

    const elemnt = `[data-index='${parseInt(ExistOrNot)}']`;
    console.log(elemnt);
    const elemntToModify = document.querySelector(elemnt);
    const taskType = document.querySelector('input[name="task-type"]:checked').value;

    const todoModified ={
        statut : todos[ExistOrNot].statut,
        title : toDoInputName.value,
        description : toDoInputDescription.value,
        date : toDoInputDate.value,
        type : taskType,
    };


    elemntToModify.innerHTML = "";

    //title div creation
    const divTitle = document.createElement('div');
    divTitle.classList.add('task-title');
    elemntToModify.appendChild(divTitle);
    //Expand btn creation
    const expandButton = document.createElement('span');
    expandButton.classList.add("expand-btn");
    divTitle.appendChild(expandButton);
    //Title P creation
    const taskTitleP = document.createElement('p');
    taskTitleP.innerText = toDoInputName.value;
    taskTitleP.classList.add('task-txt');
    divTitle.appendChild(taskTitleP);
    //statut btn creation
    const statutBtn = document.createElement('button');
    statutBtn.innerText="TO DO";
    statutBtn.classList.add('statut-btn-todo');
    if(todos[ExistOrNot].statut === 'true'){
        statutBtn.classList.add('statut-btn-done');
    }
    divTitle.appendChild(statutBtn);
    //close btn creation
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('btn-close');
    divTitle.appendChild(closeBtn);
    
    //description div creation
    const divDescription = document.createElement('div');
    divDescription.classList.add('task-description');
    elemntToModify.appendChild(divDescription);
    //Due Date P creation
    if(toDoInputDate.value.length !== 0){
        const dueDateP = document.createElement('p');
        dueDateP.innerText = "Due date : " + toDoInputDate.value;
        dueDateP.classList.add('date');
        divDescription.appendChild(dueDateP);
    }
    //Description P creation
    if(toDoInputDescription.value.length !== 0){
        const taskdescriptionP = document.createElement('p');
        taskdescriptionP.innerText = toDoInputDescription.value;
        taskdescriptionP.classList.add('description-txt');
        divDescription.appendChild(taskdescriptionP);
    }
    //modify btn creation
    const modifyBtn = document.createElement('button');
    modifyBtn.innerText = "modify this Task";
    modifyBtn.classList.add('modify-btn');
    divDescription.appendChild(modifyBtn);


    todos.splice([ExistOrNot], 1, todoModified);
    localStorage.setItem('todos', JSON.stringify(todos));

    //reset ExistOrNot to -1
    ExistOrNot = -1;  

    //clearing all inputs
    toDoInputName.value = "";
    toDoInputDescription.value = "";
    toDoInputDate.value = "";  

    //closing the popup
    displayHidePopup(); 
}


//FUNCTION DELETE / CHECK / EXPAND / MODIFY
function deleteCheckExpand(event){
    const item = event.target;
    //Delete a task
    if(item.classList.contains('btn-close')){
        const task = item.parentElement;
        let elementToRemove = task.parentNode;
        elementToRemove.remove();
        removeFromLocalStorage(task);
    }

    //change task statut
    //actions to do if the statut is 'To do'
    if(item.classList.contains('statut-btn-todo') && !item.classList.contains('statut-btn-done')){
        item.classList.add('statut-btn-done');
        //Loading localStorage
        let todos;
        todos = JSON.parse(localStorage.getItem('todos'));
        //Getting the index of the selected object and change his 'statut' before saving it back to the localStorage 
        const todoIndex = item.previousSibling.innerText;
        elementIndex = todos.map(e=>e.title).indexOf(todoIndex);
        todos[elementIndex].statut = 'true';
        localStorage.setItem('todos', JSON.stringify(todos));
    //actions to do if the statut is 'Done'    
    }else if(item.classList.contains('statut-btn-todo') && item.classList.contains('statut-btn-done')){
        item.classList.remove('statut-btn-done');
        //Loading localStorage
        let todos;
        todos = JSON.parse(localStorage.getItem('todos'));
        //Getting the index of the selected object and change his 'statut' before saving it back to the localStorage
        const todoIndex = item.previousSibling.innerText;
        elementIndex = todos.map(e=>e.title).indexOf(todoIndex);
        todos[elementIndex].statut = 'false';
        localStorage.setItem('todos', JSON.stringify(todos));       
    }

    //expand 
    if(item.classList.contains('task-txt') || item.classList.contains('expand-btn')){
        let panels = document.querySelectorAll('.task-description')
        let panel = item.parentElement.nextElementSibling;
        let panelHeight = window.getComputedStyle(panel).maxHeight;
        if(panelHeight === "0px"){
            for (let i=0; i<panels.length; i++){
                panels[i].style.maxHeight = "0px";
            }
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.classList.add('active');
        }else{
            panel.style.maxHeight = "0px";
            panel.classList.remove('active');
        };
    }

    //Modify
    if(item.classList.contains('modify-btn')){
        const task = item.parentElement.parentElement;
        ExistOrNot = task.dataset.index;

        let todos;
        todos = JSON.parse(localStorage.getItem('todos'));

        toDoInputName.value = todos[ExistOrNot].title;
        toDoInputDate.value = todos[ExistOrNot].date;
        toDoInputDescription.value = todos[ExistOrNot].description;
        if(todos[ExistOrNot].type === 'professional'){
            document.getElementById('pro-task').checked = true;
        }else{
            document.getElementById('perso-task').checked = true;
        }     
        displayHidePopup();   
    }
}
        


//______________________LOCAL STORAGE______________________


 //FUNCTION TO SAVE A TODO TO LOCALSTORAGE
 function saveToLocalStorage(todo){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

//FUNCTION TO LOAD LOCALSTORAGE
function loadLocalStorage(){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){
        //task li creation
        let toDoStatut = todo.statut;
        const toDoInputType = todo.type;
        const toDoLi = document.createElement('div');
        toDoLi.classList.add('todo');
        toDoLi.classList.add('draggable');
        // toDoLi.setAttribute('draggable', true);
        toDoLi.setAttribute('data-index', dataIndex);
        //checking if it's a pro or personnal task
        if(toDoInputType === 'professional'){
            proListContainer.appendChild(toDoLi);
        }else if(toDoInputType === 'personnal'){
            persoListContainer.appendChild(toDoLi);
        }
        dataIndex++;
        
        //title div creation
        const divTitle = document.createElement('div');
        divTitle.classList.add('task-title');
        toDoLi.appendChild(divTitle);
        //Expand btn creation
        const expandButton = document.createElement('span');
        expandButton.classList.add("expand-btn");
        divTitle.appendChild(expandButton);
        //Title P creation
        const taskTitleP = document.createElement('p');
        taskTitleP.innerText = todo.title;
        taskTitleP.classList.add('task-txt');
        divTitle.appendChild(taskTitleP);
        //statut btn creation
        const statutBtn = document.createElement('button');
        statutBtn.innerText="TO DO";
        statutBtn.classList.add('statut-btn-todo');
        //checking if the task is 'to do' or 'done'
        if(toDoStatut === 'true'){
            statutBtn.classList.add('statut-btn-done');
        }
        divTitle.appendChild(statutBtn);
        //close btn creation
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('btn-close');
        divTitle.appendChild(closeBtn);
        //description div creation
        const divDescription = document.createElement('div');
        divDescription.classList.add('task-description');
        toDoLi.appendChild(divDescription);
        //Due Date P creation
        if(todo.date.length !== 0){
            const dueDateP = document.createElement('p');
            dueDateP.innerText = "Due date : " + todo.date;
            dueDateP.classList.add('date');
            divDescription.appendChild(dueDateP);
        }
        //Description P creation
        if(todo.description.length !== 0){
            const taskdescriptionP = document.createElement('p');
            taskdescriptionP.innerText = todo.description;
            taskdescriptionP.classList.add('description-txt');
            divDescription.appendChild(taskdescriptionP);
        }
        //modify btn creation
        const modifyBtn = document.createElement('button');
        modifyBtn.classList.add('modify-btn');
        modifyBtn.innerText = "modify this Task";
        divDescription.appendChild(modifyBtn);
    })
}

//FUNCTION TO REMOVE ELEMENT FROM LOCALSTORAGE
function removeFromLocalStorage(toRemove){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = toRemove.children[1].innerText;
    //.map the array containing the objects, to only keep the 'title', and get the indexOf the element to delete. And remove the element
    todos.splice(todos.map(e=>e.title).indexOf(todoIndex), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}


//______________________DRAG & DROP______________________

//FUNCTION DRAG LISTENERS
// function dragEventListeners() {
//     const itemList = document.querySelectorAll('.draggable');
//     const draggableList = document.querySelector('#todolist-professionnal');
    
//     for(let item of itemList){
//         item.ondragstart = function(){
//             draggableList.style.height ='100%';
//             setTimeout(() => {
//                 item.style.display = "none";
//             }, 0);

//             draggableList.style.height = draggableList.clientHeight - item.clientHeight + 'px';
//         };

//         item.ondragenter = () => {
//             item.classList.add('drag-over');
//             console.log('dragenter');
//         }
//         item.ondragover = (e) => {
//             e.preventDefault();
//             console.log('dragover');
//         };
//         item.ondragleave = () => {
//             item.classList.remove('drag-over');
//             console.log('dragleave');
//         };
//         item.ondragend = () => {
//             item.style.display = "block";
//             console.log('dragend'); 
//         }
//         item.ondrop = () => {
//             draggableList.style.height ='100%';
//             console.log('dragdrop');
//         }
//     }   
// }



