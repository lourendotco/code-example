import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const history = useNavigate();
  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);
  const handleClick = (id) => {
    history(id);
  };
  return (
    <div className=" text-lime-900">
      <h1 className="font-semibold">users</h1>
      <table>
        <tbody>
          <tr>
            <td className="w-40 font-medium">user</td>
            <td>blogs</td>
          </tr>
          {users.map((u, i) => (
            <tr
              onClick={() => handleClick(u.id)}
              key={u.username}
              className={i % 2 ? "bg-lime-100" : "bg-lime-50"}
            >
              <td>{u.name ? u.name : u.username}</td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
