import "./App.css"; // Importing the CSS file for styling the component

import React, { useEffect, useState } from 'react' // Importing React and useState hook from React library

interface Note { // Defining an interface for the Note object with id, title, and content properties
    id: number;
    title: string;
    content: string;
}

const App = () => { // Declaring a functional component named App
    const [notes, setNotes] = useState<Note[]>([
        // <Note []> specifices that notes states will be an array of Note object
        // useState<Note []>([]) will specify how many comonents in notes when it is first render
        {
            id: 1,
            title: "test note 1",
            content: "bla bla note1",
        },
        // Additional Note objects with id, title, and content properties
        {
            id: 2,
            title: "test note 2 ",
            content: "bla bla note2",
        },
        {
            id: 3,
            title: "test note 3",
            content: "bla bla note3",
        },
        {
            id: 4,
            title: "test note 4 ",
            content: "bla bla note4",
        },
        {
            id: 5,
            title: "test note 5",
            content: "bla bla note5",
        },
        {
            id: 6,
            title: "test note 6",
            content: "bla bla note6",
        },
    ]);

    const [title, setTitle] = useState("") // Initializing state for the title input field
    const [content, setContent] = useState("") // Initializing state for the content textarea field

    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    // selectedNote will be Note or null
    // initial state is null

    useEffect(() => {
        // we have to wrap async funtion in useEffect because it does not support useEffect async directly 
        // connect to external system
        const baseUrl = ""
        const fetchNotes = async () => {
            try {
                const response = await fetch(baseUrl) // connect to the backend API
                const notes: Note[] = await response.json() // convert the response to json 
                setNotes(notes)
            } catch (e) {
                console.log(e)
            }
        }
        fetchNotes()
    }, [])
    /**
     * 
     * The second argument to useEffect is an array of dependencies. This array tells React when to re-run the useEffect callback. When you pass an empty array ([]), it means that the useEffect should only run once, after the initial render of the component.
     */

    const handleNoteClick = (note: Note) => {
        setSelectedNote(note)
        setTitle(note.title);
        setContent(note.content);
    }

    const handleAddNote = async (
        event: React.FormEvent
        // React.FormEvent to satisfy the TSX's typing requirement
    ) => {
        event.preventDefault()
        // Prevent the form from submitting an refreshing the page

        //* Mannually generate code for the frontend
        // const newNote: Note = {
        //     id: notes.length + 1,
        //     title: title,
        //     content: content
        // }

        const baseUrl = ""
        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content
                })
            })

            const newNote = await response.json()
            setNotes([newNote, ...notes])
            // ... is the spread operator: make a copy of old array and instead new components
            setTitle("")
            setContent("")
            // set the content and title back to empty 
        } catch (e) {
            console.log(e)
        }



    }

    const handleUpdateNote = async (
        event: React.FormEvent
    ) => {
        event.preventDefault()

        if (!selectedNote) {
            return
        }

        // const updatedNote: Note = {
        //     id: selectedNote.id,
        //     title: title,
        //     content: content
        // }
        try {
            const baseURL = ""
            const response = await fetch(baseURL,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            )

            const updatedNote = await response.json()
            const updatedNotesList = notes.map((note) =>
                note.id === selectedNote.id
                    ? updatedNote
                    : note
            )
            // create a note list with map
            // update the note with matched id with selected note
            // TODO: this kinda redandent, can we just find the note with the id, replace, re-render

            setNotes(updatedNotesList)
            setTitle("")
            setContent("")
            setSelectedNote(null)
        } catch (e) {
            console.log(e)
        }


    }

    /**
     * Set title, content, and selectedNote to their initial state
     */
    const handleCancel = () => {
        setTitle("")
        setContent("")
        setSelectedNote(null)
    }

    const deleteNote = async (event: React.MouseEvent, noteId: number) => {
        event.stopPropagation()
        // since the delete button is nested within the clickable selectedNote, we do not want to accidently delete note when we select note
        const baseURL = ""
        try {
            const response = await fetch(baseURL,
                {
                    method: "DELETE",
                }
            )
            const updatedNotes = notes.filter((note) => note.id !== noteId)
            // iterate through the note array and take only the notes whom id does not match current note

            setNotes(updatedNotes)
        } catch (e) {
            console.log(e)
        }


    }

    return ( // Returning the JSX elements to render
        <div className="app-container"> {/* Creating a container div with a specific class name */}
            <form
                className="note-form"
                onSubmit={(event) => { selectedNote ? handleUpdateNote(event) : handleAddNote(event) }}> {/* Creating a form with a specific class name */}

                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    // onChange listens for changes in the input field
                    // event.target.value: This gets the current value of the input field. Whenever the user types in the field, event.target.value will be the new text entered.
                    placeholder="Title" // The world "Title" is displaced when the field is empty 
                    required
                ></input>
                <textarea
                    placeholder="Content" rows={10} required
                    // rows will display 10 lines of text. If the user types more, it will display a scrollbar
                    value={content} // Binding the value of the textarea to the content state
                    onChange={(event) => setContent(event.target.value)} // Handling textarea change and updating the content state
                />

                {
                    selectedNote ? (
                        <div className="edit-buttons">
                            <button type="submit">Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    ) : (
                        <button type="submit">Add Note</button>
                    )
                } {/* display save and canvel button in case of selectedNote else, diplay add note button */}

            </form>
            <div className="notes-grid"> {/* Creating a grid for displaying notes */}
                {/* {} below is the JS expression embedded */}
                {notes.map((note) => (
                    // map() will map each note in notes to the structure below 
                    <div
                        className="note-item"
                        onClick={() => handleNoteClick(note)}> {/* Creating a div for each note item */}
                        <div className="notes-header"> {/* Header section for the note item */}
                            <button onClick={(event) => deleteNote(event, note.id)}>x</button> {/* Button for deleting the note */}
                        </div>
                        <h2>{note.title}</h2> {/* Displaying the title of the note */}
                        <p>{note.content}</p> {/* Displaying the content of the note */}
                    </div>
                ))}
            </div>
        </div >
    );
};

export default App; // Exporting the App component as the default export