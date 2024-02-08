import express from "express"
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

function randomUserID () {
    let userID = "";

    const characters = "abcdefghijklmnopqrstuvwxyz";
    for(let i = 0; i < 3; i++) {
        userID += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    for(let i = 0; i < 3; i++) {
        userID += Math.floor(Math.random() * 9);
    }

    return userID;
}

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userServices.getUsers(name, job)
    .then((users) => {
        // console.log(users)
        const userList = Array.isArray(users) ? users : [users];
        res.send({ users_list: userList })
    })
    .catch((error) => {
        console.log(error)
    });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;

    userServices.addUser(userToAdd)
    .then((user) => {
        res.status(201).send(JSON.stringify(user));
    })
    .catch((error) => {
        console.log(error)
        res.status(404).send("Resource not found.");
    });
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id

    userServices.findUserById(id)
    .then((user) => {
        const userList = Array.isArray(user) ? user : [user];
        res.send({ users_list: userList })
    })
    .catch((error) => {
        console.log(error)
    });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    console.log(id)
    userServices.deleteUser(id)
    .then((data) => {
        console.log(data)
        if(data) {
            res.status(204).send();
        }
    })
    .catch((error) => {
        console.log(error)
    });
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});