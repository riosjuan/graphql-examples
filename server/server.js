const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const uuidv1 = require('uuid/v1');
var cors = require('cors')
// GraphQL schema

const people = [
  {
    id:'e908c54d-6737-48bf-8e0a-4fa9e7d9d443',
    name:'Ivan',
    tasks:[],
  },
  {
    id:'efdc8f08-3183-4f0d-b091-ec15e36436ba',
    name:'Eduardo',
    tasks:[],
  },
  {
    id:'403c4b2c-ce02-429f-ba35-819c804a93d6',
    name:'Ozgur',
    tasks:[],
  },
  {
    id:'4f9901f4-c401-459a-a8d4-c0552b4ca750',
    name:'Claudio',
    tasks:[],
  },
  {
    id:'3ce34593-6cf3-4063-8b10-5c7af4e9a6b1',
    name:'Lin',
    tasks:[],
  },
]

const tasks = [
    {
        id: '1e13ef87-945e-48cf-9da1-0ec6ede54e87',
        title: 'Make server test',
        description: 'Create a node js graphql server',
        done: false,
    },
]

var schema = buildSchema(`
    type Person {
      id:ID!
      name:String!
      tasks:[Task!]!
    }

    type Task {
        id: ID!
        title: String!
        description: String!
        done: Boolean!
        for:Person
    }

    type Query {
        allTasks:[Task!]!
        allPeople:[Person!]!
    }

    type Mutation {
        addTask(title:String!, description:String!):ID
        checkTask(id:ID!):Boolean
        uncheckTask(id:ID!):Boolean
        editTask(id:ID! ,title: String!, description: String!): Boolean
        removeTask(id:ID!): Boolean
        assignTask(id:ID!, personId:ID!):Boolean
    }

    type Subscription {
        newTask:Task!  
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
    if (target && !target.done){
        target.done = true;
        return true;
    } 
    return false;
};

const uncheckTask = ({id}) => {
  const target = tasks.find((task)=> task.id === id);
  if (target && target.done){
      target.done = false;
      return true;
  } 
  return false;
};

const assignTask = ({id, personId}) => {
  const target = tasks.find((task)=> task.id === id);
  const person = people.find((person)=> person.id === personId);
  if (target && person){
      target.for = person;
      if (!person.tasks.find((task)=>task.id===id)){
        person.tasks.push(target);
        return true;
      }
      return false;
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
    allPeople: () => people,
    addTask,
    checkTask,
    uncheckTask,
    editTask,
    removeTask,
    assignTask,
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