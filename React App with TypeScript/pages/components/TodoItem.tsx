import React from "react";
import { Card, Typography, Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: Props) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(217,216,216,0.8)",
        marginBottom: "1rem",
        padding: "0.5rem",
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Checkbox
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id)}
          sx={{
            color: "#e66465",
            "&.Mui-checked": {
              color: "#e66465",
            },
          }}
          inputProps={{ "aria-label": "Mark task as completed" }}
        />
        <Typography
          sx={{
            textDecoration: todo.isCompleted ? "line-through" : "none",
            color: todo.isCompleted ? "#a9a9a9" : "inherit",
          }}
        >
          {todo.text}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <DeleteIcon
        sx={{ color: "#e66465", cursor: "pointer" }}
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      />
      <EditIcon
        sx={{ color: "#e66465", cursor: "pointer" }}
        onClick={() => onEdit(todo.id)}
        aria-label="Edit task"
      />
      </Box>
    </Card>
  );
};

export default TodoItem;
