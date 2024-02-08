import express from "express"
import cors from "cors";
import userServices from "./user-services";

const app = express();
const port = 8000;

// const users = {
//     users_list: [
//         {
//             id: "xyz789",
//             name: "Charlie",
//             job: "Janitor"
//         },
//         {
//             id: "abc123",
//             name: "Mac",
//             job: "Bouncer"
//         },
//         {
//             id: "ppp222",
//             name: "Mac",
//             job: "Professor"
//         },
//         {
//             id: "yat999",
//             name: "Dee",
//             job: "Aspring actress"
//         },
//         {
//             id: "zap555",
//             name: "Dennis",
//             job: "Bartender"
//         }
//     ]
// };

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

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
    );
}

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"] === name && user["job"] === job
    );
}

const findUserById = (id) => 
    users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
    if(!("id" in user)) {

        let newUser = {
            id: randomUserID(),
            name: user.name,
            job: user.job   
        };

        user = newUser  
    } 

    users["users_list"].push(user);
    
    return user;
}

const deleteUser = (id) => {
    users["users_list"].splice(users["users_list"].findIndex((user) => user["id"] === id), 1); 
}

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    
    if (name != undefined && job != undefined) {
        let result = findUserByNameAndJob(name, job);
        result = { users_list: result };
        res.send(result);
    }
    else if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } 
    else if (job != undefined) {
        let result = findUserByJob(job);
        result = { users_list: result };
        res.send(result);
    }
    else {
        res.send(users);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    let newUser = addUser(userToAdd);
    if (newUser === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.status(201).send(JSON.stringify(newUser));
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        deleteUser(id);
        res.status(204).send();
    }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});