import { 
    getNoteFromTable
} from '../backend/NoteTable.js';

let NOTE_ID = "";

window.addEventListener("DOMContentLoaded", init);


function init() {
    NOTE_ID = window.location.hash.substring(1);
    console.log(NOTE_ID);
    populateNote();   
}

/**
 * Populates the note with existing data from the backend.
 * Retrieves the note data using the note ID.
 * Sets the note title, markdown content, and date in the DOM.
 */
function populateNote() {
    const note = getNoteFromTable(NOTE_ID);
    document.querySelector('.noteTitle h1').innerText = note.title;
    document.querySelector('markdown-editor').wysimark.setMarkdown(note.text);
    document.querySelector('.date input').value = note.date;
}