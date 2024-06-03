

/** ---------------------------- */ 

import { getNoteTableFromStorage, createNewNoteObject} from "../backend/NoteTable.js";

const filteredTags = [];
window.addEventListener("DOMContentLoaded", init);


function init(){
    loadNotes();
    document.getElementById('sort-select').addEventListener('change', loadNotes);
}

function loadNotes(){
    const noteTable = getNoteTableFromStorage();
    const entriesHolder = document.getElementById('entries-holder');
    entriesHolder.innerHTML = ''; // clear existing to reload

    const sortBy = document.getElementById('sort-select').value;
    const notesArray = Object.values(noteTable);

    notesArray.sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
          } else if (sortBy === 'date') {
            return new Date(a.date) - new Date(b.date);
          } else if (sortBy === 'lastEdited') {
            return new Date(b.lastEdited) - new Date(a.lastEdited);
          }
        });

    notesArray.forEach(note => {
        const noteElement = createNoteElement(note);
        entriesHolder.appendChild(noteElement);
    });
}

//Function to create a Note Element;
/**
 * creates HTML element based on the object and returns it.
 * @param {*} noteObject noteObject to create the HTML off of.
 * @returns a noteObject, or an empty div if it's being passed over.
 */
function createNoteElement(noteObject){
  //Wrapper container for a note Element. That will incude a note Contianer and a button.
  //check if
  let relevantTag = false;
  noteObject.tags.forEach(tag => {
    filteredTags.forEach(otherTag => {
      if(tag === otherTag)
        relevantTag = true;
    });
  });

  if(filteredTags.length > 0 && !relevantTag)
    return document.createElement("div"); 

  const noteContainerMain = document.createElement("span");
  noteContainerMain.className = "note-wrapper";

  //Note Container that is an anchor to another page. 
  const noteContainer = document.createElement("div");
  //noteContainer.href = "../library/library.html";
  noteContainer.className = "note";

  //append note container to wrapper container. 
  noteContainerMain.appendChild(noteContainer);
  
  // Create a header
  const headerElement = document.createElement('header');
  noteContainer.appendChild(headerElement);

  // Create a container for the content (text, date, and lastEdited)
  const contentContainer = document.createElement('a');
  contentContainer.classList.add('content-container');
  contentContainer.href="../note/view-note.html" + "#" + noteObject.noteID;
  noteContainer.appendChild(contentContainer);

  // Create a date container
  const dateContainer = document.createElement('div');
  dateContainer.classList.add('dates');
  contentContainer.appendChild(dateContainer);

  // Title of note
  const titleElement = document.createElement('h2');
  const linkElement = document.createElement('a');
  linkElement.href = "../note/view-note.html" + "#" + noteObject.noteID;
  linkElement.textContent = noteObject.title;
  titleElement.appendChild(linkElement);
  headerElement.appendChild(titleElement);

  // Call the function getFormattedDate()
  const date = getFormattedDate(noteObject.date);
  const lastEdited = getFormattedDate(noteObject.lastEdited);

  // Date Started of note
  const dateElement = document.createElement('p');
  dateElement.textContent = `Started ${date}`;
  dateContainer.appendChild(dateElement);

  // Last Edited of note
  const lastEditedElement = document.createElement('p');
  lastEditedElement.textContent = `Worked on: ${lastEdited}`;
  dateContainer.appendChild(lastEditedElement);

  // Text of note
  const textElement = document.createElement('p');
  textElement.id = 'note-text';
  textElement.textContent = noteObject.text;
  contentContainer.appendChild(textElement);

  // Create a tags-project container
  const tagsProjectContainer = document.createElement('div');
  tagsProjectContainer.classList.add('tags-project');
  headerElement.appendChild(tagsProjectContainer);

  // Add each tag separately
  noteObject.tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.textContent = tag;
    if(filteredTags.indexOf(tag) != -1)
      tagElement.setAttribute("filtered", true);
    else
      tagElement.setAttribute("filtered", false)

    tagElement.addEventListener("click", () => filterByTag(tag));

    tagsProjectContainer.appendChild(tagElement);
  });
  
  // Add line separating the tags and projects
  if(noteObject.projectList.length != 0) {
    const verticalLine = document.createElement('div');
    verticalLine.id = 'vertical-line';
    tagsProjectContainer.appendChild(verticalLine);
  }
  
  // Add each project separately
  noteObject.projectList.forEach(project => {
    const projectElement = document.createElement('span');
    const linkElement = document.createElement('a');
    linkElement.href="../project/view-project.html";
    linkElement.textContent = project;
    projectElement.appendChild(linkElement);
    tagsProjectContainer.appendChild(projectElement);
  });


  //Favorite button of the note. 
  let favorited = noteObject.favorited;


  const button = document.createElement("button");
  button.dataset.noteID = noteObject.noteID;
  button.dataset.favorited = noteObject.favorited;
  if( favorited == true){
   button.innerText = "Favorited";
   button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
  }

  else{
    button.innerText = "Note Favorited"; 
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24" opacity = "0.2"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
  }

  button.className = "favorite-button";
  button.onclick = () => toggleFavorite(button);

      
  
  //Append favorite button to the wrapper container. 
  noteContainerMain.appendChild(button);

  return noteContainerMain;

}

function toggleFavorite(button){

  const noteID = button.dataset.noteID;
  const note = getNoteFromTable(noteID);

  if(note){
    const newFavoritedStatus = !note.favorited;

    modifyNoteFavorited(noteID, newFavoritedStatus);
    if (newFavoritedStatus) {
      button.innerText = 'Favorited';
      button.dataset.favorited = newFavoritedStatus;
    } else {
      button.innerText = 'Not Favorited';
      button.dataset.favorited = newFavoritedStatus;
      button.style.backgroundColor = ''; // Revert to default or another style
    }
  }
  reset();
  init();
}

/**
 * adds a tag to filteredTags[] and reloads the notes based on it.
 * @param {*} tag 
 */
function filterByTag(tag)
{
  let idx = filteredTags.indexOf(tag);
  if(idx == -1)
    filteredTags.push(tag);
  else
    filteredTags.splice(idx, 1);
  reset();
  init();
};

/**
  * Takes in a date string and converts it to the format Month Day with the corresponding suffix
  * @param {string}  dateString string in the format YYYY-MM-DD
  * @return {string} a string in the correct format
  */
function getFormattedDate(dateString) {
  //catches exception where a date is left blank.
  if(dateString == "")
  {
    return "";
  }
  const date = new Date(dateString);
  const day = date.getDate();
  let suffix = "";
  // Determine the suffix based on the day
  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  }
  else if (day === 2 || day === 22) {
    suffix = "nd";
  }
  else if (day === 3 || day === 23) {
    suffix = "rd";
  }
  else {
    suffix = "th";
  }

  // Format the string
  const options = { month: 'long' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return `${formattedDate} ${day}${suffix}`;
}



const expandIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24">
  <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
</svg>`;

const collapseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24">
  <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
</svg>`;

let isRecentsCollapsed = false;
let isFavoritesCollapsed = false;

function toggleCollapse(event, type) {
  event.preventDefault();

  if (type === 'recents') {
    const recentsContainer = document.getElementById('recents');
    recentsContainer.classList.toggle('collapsed');
    isRecentsCollapsed = !isRecentsCollapsed;
    const collapseButton = document.getElementById('collapseButton1');
    collapseButton.innerHTML = isRecentsCollapsed ? collapseIcon : expandIcon;

  } else if (type === 'favorites') {
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.classList.toggle('collapsed');
    isFavoritesCollapsed = !isFavoritesCollapsed;
    const collapseButton = document.getElementById('collapseButton2');
    collapseButton.innerHTML = isFavoritesCollapsed ? collapseIcon : expandIcon;
  }
}

const recentsCollapseButton = document.getElementById('collapseButton1');
recentsCollapseButton.addEventListener('click', (event) => toggleCollapse(event, 'recents'));
recentsCollapseButton.innerHTML = expandIcon;

const favoritesCollapseButton = document.getElementById('collapseButton2');
favoritesCollapseButton.addEventListener('click', (event) => toggleCollapse(event, 'favorites'));
recentsCollapseButton.innerHTML = expandIcon;