import React, { useState } from "react";
import {
  Button,
  Card,
  TextField,
  Typography,
  Stack,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import TodoItem from "./TodoItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: string;
  text: string;
  createdAt: string;
  isCompleted: boolean;
}

const ToDoComponents = () => {
  const queryClient = useQueryClient();

  const [newTodo, setNewTodo] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const { data: todos = [], isError } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      axios.get("http://localhost:5001/todos").then((res) => res.data.data),
    onError: () => showSnackbar("Failed to fetch todos", "error"),
  });

  const sortedTodos = [...todos].sort(
    (a: Todo, b: Todo) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const createTodos = useMutation({
    mutationFn: (data: Omit<Todo, "id" | "createdAt">) =>
      axios.post("http://localhost:5001/todos", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setNewTodo("");
      showSnackbar("Todo Created Successfully");
    },
    onError: () => showSnackbar("Failed to create todo", "error"),
  });

  const deleteTodos = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`http://localhost:5001/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      showSnackbar("Todo Deleted Successfully");
    },
    onError: () => showSnackbar("Failed to delete todo", "error"),
  });

  const toggleTodo = useMutation({
    mutationFn: (todo: Todo) => {
      return axios.patch(`http://localhost:5001/todos/${todo.id}`, {
        isCompleted: !todo.isCompleted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      showSnackbar("Toggled Successfully");
    },
    onError: () => showSnackbar("Failed to toggle todo", "error"),
  });

  const editTodos = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      axios.patch(`http://localhost:5001/todos/${id}`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setEditId(null);
      setEditText("");
      showSnackbar("Todo Updated Successfully");
    },
    onError: () => showSnackbar("Failed to update todo", "error"),
  });

  return (
    <Card
      sx={{
        maxHeight: "70vh",
        margin: "5vh auto",
        padding: "2rem",
        borderRadius: "1rem",
        minWidth: "40vw",
      }}
    >
      <Typography variant="h4">ToDos</Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ marginTop: "1rem", mb: 2 }}
      >
      <TextField
          label="Add ToDo"
          variant="outlined"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          sx={{
            width: "50%",
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#e66465",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#e66465",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={() =>
            createTodos.mutate({ text: newTodo, isCompleted: false })
          }
          sx={{
            background: "linear-gradient(45deg, #e66465, #9198e5)",
            color: "#fff",
          }}
        >
          Submit
        </Button>
      </Stack>

      {isError && <Typography color="error">Failed to load todos</Typography>}

      {sortedTodos.map((todo: Todo) =>
        editId === todo.id ? (
          <Stack
            direction="row"
            spacing={2}
            key={todo.id}
            sx={{ mb: 2, alignItems: "center" }}
          >
            <TextField
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              fullWidth
              sx={{
              
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#e66465",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#e66465",
                },
              }}
            />
            <Button
              onClick={() => editTodos.mutate({ id: editId!, text: editText })}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #e66465, #9198e5)",
                color: "#fff",
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setEditId(null);
                setEditText("");
              }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo.mutate(todo)}
            onDelete={() => deleteTodos.mutate(todo.id)}
            onEdit={() => {
              setEditId(todo.id);
              setEditText(todo.text);
            }}
          />
        )
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ToDoComponents;
