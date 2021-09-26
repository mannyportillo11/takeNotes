const express = require('express');
const path = require("path");
const fs = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

const notes = require ("./Develop/db/db.json");

// Middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

currentID = notes.length;

app.get("/api/notes", function (req, res) {

    return res.json(notes);
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;

    newNote["id"] = currentID +1;
    currentID++;
    console.log(newNote);

    notes.push(newNote);

    rewriteNotes();

    return res.status(200).end();
});

app.delete("/api/notes/:id", function (req, res) {
    res.send('Got a DELETE request at /api/notes/:id')

    var id = req.params.id;

    var idLess = notes.filter(function (less) {
        return less.id < id;
    });

    var idGreater = notes.filter(function (greater) {
        return greater.id > id;
    });

    notes = idLess.concat(idGreater);

    rewriteNotes();
})

app.use(express.static("public"));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

function rewriteNotes() {
    fs.writeFile("Develop/db/db.json", JSON.stringify(notes), function (err) {
        if (err) {
            console.log("error")
            return console.log(err);
        }

        console.log("Success!");
    });
}