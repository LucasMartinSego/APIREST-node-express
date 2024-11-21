import express from "express";
import fs from "fs";

const app = express();

// Middleware para analizar JSON
app.use(express.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.error("No se ha encontrado el archivo", error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2)); // Formatea el JSON para mayor legibilidad
    } catch (error) {
        console.error("No se pudo escribir el archivo", error);
    }
};

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Welcome to the jungle!");
});

// Obtener todos los libros
app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

// Obtener un libro por su ID
app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;
    const book = data.books.find((book) => book.id === parseInt(id));
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;

    if (!body.title || !body.author || !body.year) {
        return res.status(400).json({ message: "Missing required fields: title, author, year" });
    }

    const newBook = {
        id: data.books.length + 1,
        ...body
    };
    data.books.push(newBook);

    writeData(data);
    res.status(201).json(newBook);

});

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = req.params.id;

    const bookIndex = data.books.findIndex((book) => book.id === parseInt(id));

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Book updated successfully", book: data.books[bookIndex] });
});

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;

    const bookIndex = data.books.findIndex((book) => book.id === parseInt(id));

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    data.books.splice(bookIndex, 1);

    writeData(data);
    res.json({ message: "Book deleted successfully" });
})


// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
