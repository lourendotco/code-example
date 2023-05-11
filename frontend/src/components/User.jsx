import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUser(res.data.find((u) => u.id === id)));
  }, [id]);

  if (!user) return;
  return (
    <div className="text-lime-900">
      <h2 className="font-bold">{user.name ? user.name : user.username}</h2>
      <ul>
        {user.blogs.map((b) => (
          <li key={b._id} onClick={() => navigate(`../blogs/${b._id}`)}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
