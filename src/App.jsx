import './App.css'
import { useState, useEffect } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ ename: "", salary: "", city: "", state: "" });
  const [editId, setEditId] = useState(null); // For Update

  const BASE_URL = "http://localhost:8080";

  // GET
  const fetchEmployees = () => {
    fetch(`${BASE_URL}/getAllEmployeeDetails`)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE or UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // UPDATE - this is what was missing!
      fetch(`${BASE_URL}/updateEmployee12/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(() => {
          alert("Employee Updated!");
          setEditId(null);
          setForm({ ename: "", salary: "", city: "", state: "" });
          fetchEmployees();
        });
    } else {
      // CREATE
      fetch(`${BASE_URL}/createemployeelist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(() => {
          alert("Employee Added!");
          setForm({ ename: "", salary: "", city: "", state: "" });
          fetchEmployees();
        });
    }
  };

  // DELETE - you already fixed
  const deleteEmployee = (id) => {
    fetch(`${BASE_URL}/delEmployee12/${id}`, {
      method: "DELETE",
    }).then(() => {
      alert("Employee Deleted!");
      fetchEmployees();
    });
  };

  // EDIT BUTTON CLICK - fills form
  const handleEdit = (emp) => {
    setForm({
      ename: emp.ename,
      salary: emp.salary,
      city: emp.city,
      state: emp.state,
    });
    setEditId(emp.eid);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Management System</h1>

      <form onSubmit={handleSubmit}>
        <input name="ename" placeholder="Name" value={form.ename} onChange={handleChange} required />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <button type="submit">{editId ? "Update Employee" : "Add Employee"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ ename: "", salary: "", city: "", state: "" }); }}>Cancel</button>}
      </form>

      <button onClick={fetchEmployees} style={{ marginTop: "10px" }}>Refresh Employees</button>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Salary</th><th>City</th><th>State</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.eid}>
              <td>{emp.eid}</td>
              <td>{emp.ename}</td>
              <td>{emp.salary}</td>
              <td>{emp.city}</td>
              <td>{emp.state}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => deleteEmployee(emp.eid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editId && <p>Editing Employee ID: {editId}</p>}
    </div>
  );
}

export default App;
