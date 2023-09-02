//here we will create all functions related to users

const users = [];

const addUser = ({ id, name, room }) => {
    //we need to collapse the name of users
    //eg=> arijit dutta -> arijitdutta
    //same for room
    name = name.trim();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.name === name && user.room === room);

    if(existingUser){
        return { error : 'UserName already taken'};
    }

    const user = { id, name, room };

    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);


const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };