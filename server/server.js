const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const uuidv1 = require('uuid/v1');
var cors = require('cors')
// GraphQL schema

const tasks = [
    {
        id: '1e13ef87-945e-48cf-9da1-0ec6ede54e87',
        title: 'Make server test',
        description: 'Create a node js graphql server',
        done: false,
    },
]

var schema = buildSchema(`
    type Task {
        id: ID!
        title: String!
        description: String!
        done: Boolean!
    }

    type Query {
        allTasks:[Task!]!
    }
    type Mutation {
        addTask(title:String!, description:String!):ID
        checkTask(id:ID!):Boolean
        editTask(id:ID! ,title: String!, description: String!): Boolean
        removeTask(id:ID!): Boolean
    }
`);

const addTask = ({title, description}) => {
    const id = uuidv1();
    tasks.push({
        id,
        title,
        description,
        done:false,
    })
    return id;
};

const checkTask = ({id}) => {
    const target = tasks.find((task)=> task.id === id);
    if (target){
        target.done = true;
        return true;
    } 
    return false;
};

const removeTask = ({id}) => {
    const index = tasks.findIndex((task)=> task.id === id);
    if (index === -1){
        return false;
    } 
    tasks.splice(index, 1);
    return true;
};

const editTask = ({id, title, description}) => {
    const target = tasks.find((task)=> task.id === id);
    if (target){
        target.title = title;
        target.description = description;
        return true;
    } 
    return false;
};

// Root resolver
var root = {
    allTasks: () => tasks,
    addTask,
    checkTask,
    editTask,
    removeTask,
};
// Create an express server and a GraphQL endpoint
var app = express();

app.use(cors());

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));