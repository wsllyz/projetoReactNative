import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'https://jsonplaceholder.typicode.com/posts';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  const addPost = async () => {
    if (!title.trim() || !body.trim()) return;
    try {
      const response = await axios.post(API_URL, { title, body, userId: 1 });
      setPosts([response.data, ...posts]);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Erro ao adicionar post:', error);
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedItem);
      console.log('Item updated:', response.data);
      fetchPosts(); // Recarregar posts para refletir a atualização
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      console.log('Item deleted');
      fetchPosts(); // Recarregar posts após a exclusão
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  const handleUpdateSubmit = () => {
    if (editingId) {
      updateItem(editingId, { title, body });
      setTitle('');
      setBody('');
      setEditingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título do Post"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Conteúdo do Post"
        value={body}
        onChangeText={setBody}
        style={styles.input}
      />
      <Button title="Adicionar Post" onPress={addPost} />
      {editingId && (
        <Button title="Atualizar Post" onPress={handleUpdateSubmit} />
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Button title="Editar" onPress={() => handleUpdate(item)} />
            <Button title="Deletar" onPress={() => deleteItem(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default App;
