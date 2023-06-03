import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {CiViewList, CiStar, CiBookmarkPlus, CiEraser, CiCircleCheck, CiCircleRemove, CiDatabase, CiSquareRemove} from 'react-icons/ci';
import ReactDOM from 'react-dom/client';
// eslint-disable-next-line
import { useState, useEffect } from 'react';
import logo from './logo.svg';

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <App />
);




function App(){
  // Dropdowns display states
  const [drop,setDrop] = useState(false);
  const [statDrop,setStatDrop] = useState(false);

  const [value,setValue] = useState("");
  const [editKey, setEditKey] = useState("");
  // Tasks and stats lists
  const [list,setList] = useState([]);
  const [statList,setStatList] = useState([]);
  // Inputs display state
  const [inputState, setInputState] = useState(false);
  const [editInput, setEditInput] = useState(false);

  // Managing local storage
  // Setters 
  function SetTasksStorage(values){
    if(values !== undefined && values !== []){
      localStorage.setItem('TASK_LIST',JSON.stringify(values));
    }
    else{
      localStorage.setItem('TASK_LIST',[]);
    }
    
  };
  // eslint-disable-next-line
  function SetStatsStorage(values){
    localStorage.setItem('STATS_LIST',JSON.stringify(values));
  };
  // Getters
  function GetTasks(){
    var TASK_LIST = localStorage.getItem('TASK_LIST');
    if(TASK_LIST !== null && TASK_LIST !== undefined && TASK_LIST.length > 0) {
      setList(JSON.parse(TASK_LIST))}
    else{
      setList([]);
    }
  }
  function GetStats(){
    var STATS_LIST = localStorage.getItem('STATS_LIST');
    if(STATS_LIST !== null && STATS_LIST !== undefined && STATS_LIST.length > 0) {
      setStatList(JSON.parse(STATS_LIST))}
    else{
      setStatList([]);
    }
  }
  // Loading local storage variables
  function InitLocal(){
    GetTasks();
    GetStats();
  }
  window.onload = function(){
    InitLocal();
  }
  window.onreset = function(){
    InitLocal();
  }
  window.onabort = function(){
    InitLocal();
  }
  window.onpageshow = function(){
    InitLocal();
  };
  



  // Removing task value with the key of "i" from the task list 
  const removeTask = (index) => {
    let listFilter = list.filter((_,i) => i !== index);
    setList(listFilter);
    SetTasksStorage(listFilter);
  }
  const editTask = (index,value) => {
    console.log("Editing at index of: " + index);
    let tempList = list.filter((_,i) => i !== index);
    tempList.push(value);
    
    setList(tempList);
    localStorage.setItem('TASK_LIST', JSON.stringify(tempList));
  } 

  return(
    <div>     
    <div role='row' className='root'>
      <nav className='navbar'>

        <button onClick={() => {setDrop(!drop); setStatDrop(false)}}>
          <CiViewList/>
          Menu
        </button>

        <button onClick={() => {setStatDrop(!statDrop);setDrop(false)}}>
          <CiStar/>
          Stats
        </button>
        

      </nav>
    </div>
    <div className='main-container'>
    {/* Dropdowns for "Menu" and "Stats" buttons */}
      <Dropdown/>
      <StatsDrop/>
      <TaskBar/>
    {/* Dynamic task list */}
      <div className='tasks'>
        <ul>
        {
          list.length > 0 && list.map((item,key) => 
          <li key={key}>{item}
            
            <div className='taskbuttons-panel'>
              <button className='completeTaskButton' alt="Complete Task" 
              onClick={() => {CompletedTasks(key)}}><CiCircleCheck/></button>
              <button className='editTaskButton' alt="Edit Task" onClick={() => {setEditInput(!editInput); setEditKey(key)} } ><CiEraser/></button>
              <button className='removeTaskButton' alt="Remove Task"  
              onClick={() => {removeTask(key)}}><CiCircleRemove/></button>
            </div>
          </li>)
        }
        </ul>
        <EditingInput/>
        
      </div>
    </div>
    <footer className='footer'>
        <div role='row' className='footer-div'>
        <p>Zhyrosh Illia {`${new Date().getFullYear()}`} {`- ${new Date().getFullYear() + 1}`} </p>
        <img src={logo} alt='react-icon' className='react-icon'></img>
        </div>
      
    </footer>
    </div>
  )
  // Input for task editing
  function EditingInput(){
    let key = editKey;
    if(editInput){
      return(
        <div className='edit-input'>
          <p>Editing {list[key]}: </p>
          <input type='text' id='edit-input' autoComplete="off" onKeyDown={(e) => EnterClickEdit(e)}></input>
          <button onClick={()=> {setEditInput(false); SubmitEdit()}}>Submit <CiCircleCheck/></button>
        </div>
      )
    }
  }
  function EnterClickEdit(e){
    if(e.target.value !== "" && e.keyCode === 13){
      SubmitEdit();
      setDrop(false);
      setStatDrop(false);
    }
  }
  function SubmitEdit(){
    let inputField = document.getElementById('edit-input');
    let inputvalue = inputField.value;
    if(inputvalue !== "" && inputvalue !== null && inputvalue !== undefined) {
      editTask(editKey,inputvalue);
      setEditInput(false);
    }
  }
  // Performing action based on clicked button from dropdown menu
  function FunctionBase(e){
    e.preventDefault();
    
    var button = (e.currentTarget);
    if (button.id === 'AddTask'){
      setInputState(true);
      setDrop(!drop);
    }
    else if(button.id === 'ClearStats'){
      let tempStats = [];
      setStatList(tempStats);
      localStorage.removeItem('STATS_LIST');
    }
    else if(button.id === 'ClearTasks'){
      let tempTasks = [];
      setList(tempTasks);
      localStorage.removeItem('TASK_LIST');
    }
    setDrop(!drop);
  }
  

  // Stats table handling

  function CompletedTasks(key){
    let tempStats = statList;
    tempStats.push(list[key]);
    setStatList(tempStats);
    SetStatsStorage(statList);
    removeTask(key);
  }
  // Getting completed stat list
  function Stats(){
    
    if(statDrop !== false){
      return(
        <div className='stat-dropdown'>
          <ul >
            <p>Your current completed tasks: </p>
            {
              statList.length > 0 && statList.map((item,key) => 
              <div role="row" className='statElem' key={key + 2}>
                  <li key={key}>{item} {<CiStar key={key + 1} color='goldenrod' fontSize={"1.4rem"}/>} </li>
              </div>
              )
            }
          </ul>
        </div>
      )
    }
  }
  // Stats dropdown
  function StatsDrop(){
    if(statDrop !== false && statList.length > 0){
      return(
        <Stats/>
      )
    }
  }

  // Creating button with custom id , icons and text
  function DropdownItem(props) {
    
    return(
      <div role='row'>
        <button className='menu-button' onClick={FunctionBase} id={`${props.id}`}>{<props.icon/>}{props.text}</button>
      </div>
    
    );
  }
   // Creating dropdown menu with react elements
   function Dropdown(){
    return(
      <div className={`dropdown-container ${drop? 'active': 'inactive'}`}>
        <DropdownItem text={"Create Task"} alt="Create Task" icon ={CiBookmarkPlus} id={"AddTask"}/>
        <DropdownItem text={"Clear Tasks"} alt="Clear Tasks" icon ={CiSquareRemove} id={"ClearTasks"}/>
        <DropdownItem text={"Clear Stats"} alt="Clear Stats" icon ={CiDatabase} id={"ClearStats"}/>
      </div>
    )
  }
  // Allowing user to hit enter to submit a task
  function EnterClick(e){
    if(e.target.value !== "" && e.keyCode === 13){
      CreateTask();
    }
  }
  // Conditional rendering of taskbar based on user's actions
  function TaskBar()
  {
    if(inputState !== true){
      return(
      
        <div role='row' className='taskbar' id='taskbar'>
          
        </div>
      );
    }else if(inputState !== false){
      
      return(
        <div role='row' className='taskbar' id='taskbar'>
          <Input/>
          
        </div>
      );
    }
  }
  // Handling user input
  function Input(){
    
    return(
      <div role='row' className='input-row'>
         <input type="text" id='taskInput' key={Math.floor(Math.random) * 1000} 
         placeholder='Enter the task' autoFocus="autofocus" 
         value={value} onChange={(e) =>{setValue(e.target.value);setDrop(false);
          setStatDrop(false);}}
         onKeyDown={(e) => EnterClick(e)} autoComplete="off"/>
         <button onClick={() => CreateTask()}><CiCircleCheck/></button>
        
         <button onClick={() => setInputState(false)}><CiCircleRemove/></button>
      </div>
    )
  }
  // Reading task from input bar, adding task value to array.
function CreateTask(){
  var inputBar = document.getElementById('taskInput');
  if(inputBar.value !== null && inputBar.value !== ""){
    
    let tasks = list;
    tasks.push(value);
    setList(tasks);
    setValue("");
    SetTasksStorage(list);
  }
}
}


export default App;


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
