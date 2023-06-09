import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

//amplify import
//amplify local setup
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
import { DataStore } from '@aws-amplify/datastore';
import { Migrate } from './src/models';
import 'core-js/es/symbol/async-iterator';
Amplify.configure(awsExports);



const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    DataStore.query(Migrate).then((tasks) =>
      setTasks(tasks.map((task) => ({ id: task.id, text: task.text })))
    );
  }, []);

  const handleAddTask = async () => {
    if (newTask.length > 0 && !tasks.some(task => task.text === newTask)) {
      let newTasks;
  
      if (editId !== null) {
        // Update existing task
        try {
          const task = await DataStore.query(Migrate, editId);
          if (task) {
            task.task = newTask;
            await DataStore.save(task); // fix: save the updated task back to the Datastore
          }
          newTasks = tasks.map(task =>
            task.id === editId ? { ...task, text: newTask } : task
          );
          setEditId(null);
        } catch (error) {
          console.log('Error updating task:', error);
        }
      } else {
        // Add new task
        try {
          const task = await DataStore.save(new Migrate({ task: newTask }));
          newTasks = [...tasks, { id: task.id, text: task.task }];
        } catch (error) {
          console.log('Error adding new task:', error);
        }
      }
  
      setTasks(newTasks);
      setNewTask('');
  
      console.log('Tasks saved successfully');
    } else {
      alert('Task already exists or input is empty');
    }
  };
  
  const handleEditTask = async (id) => {
    try {
      const task = await DataStore.query(Migrate, id);
      if (task) {
        setNewTask(task.task);
        setEditId(id);
        console.log('Tasks being edited');
      }
    } catch (error) {
      console.log('Error querying task:', error);
    }
  };
  
  const handleDeleteTask = async (id) => {
    try {
      const task = await DataStore.query(Migrate, id);
      if (task) {
        await DataStore.delete(task);
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
      }
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          placeholder="Add a task"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>{editId !== null ? 'Save' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
      {tasks.map((Task) => (
        <View style={styles.task} key={Task.id}>
          <Text style={styles.taskText}>{Task.text}</Text>
          <TouchableOpacity
            style={styles.taskButton}
            onPress={() => handleEditTask(Task.id)}
          >
            <Text style={styles.taskButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.taskButton}
            onPress={() => handleDeleteTask(Task.id)}
          >
            <Text style={styles.taskButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,

  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    flex: 1,
  },
  taskButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 5,
  },
  taskButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default App;