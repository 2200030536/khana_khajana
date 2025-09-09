import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import './AdminUser.css';

export default function AdminUser() {
  const [counts, setCounts] = useState(null);
  const [students, setStudents] = useState([]);
  const [messUsers, setMessUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [countsRes, studentsRes, messRes, txRes, menusRes] = await Promise.all([
          axios.get('/admin/counts'),
          axios.get('/admin/students?limit=5'),
          axios.get('/admin/mess-users?limit=5'),
          axios.get('/admin/transactions?limit=5'),
          axios.get('/admin/menus')
        ]);

        setCounts(countsRes.data.data || countsRes.data);
        setStudents((studentsRes.data.data && studentsRes.data.data.students) || studentsRes.data.students || []);
        setMessUsers((messRes.data.data && messRes.data.data.users) || messRes.data.users || []);
        setTransactions((txRes.data.data && txRes.data.data.transactions) || txRes.data.transactions || []);
        const fetchedMenus = (menusRes.data.data && menusRes.data.data.menus) || menusRes.data.menus || [];
        setMenus(fetchedMenus.slice(0,5));
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard" style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <div className="cards" style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div className="card">
          <div className="card-title">Total Students</div>
          <div className="card-value">{counts?.totalStudents ?? '—'}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Mess Users</div>
          <div className="card-value">{counts?.totalMessUsers ?? '—'}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Menus</div>
          <div className="card-value">{counts?.totalMenus ?? '—'}</div>
        </div>
        <div className="card">
          <div className="card-title">Active Subscriptions</div>
          <div className="card-value">{counts?.activeSubscriptions ?? '—'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18 }}>
        <section style={{ flex: 1 }}>
          <h3>Recent Students</h3>
          <ul>
            {students.length === 0 && <li>No students</li>}
            {students.map(s => (
              <li key={s._id || s.id}>{s.name} — {s.email} {s.department ? `(${s.department})` : ''}</li>
            ))}
          </ul>

          <h3>Recent Mess Users</h3>
          <ul>
            {messUsers.length === 0 && <li>No mess users</li>}
            {messUsers.map(u => (
              <li key={u._id || u.id}>{u.name} — {u.email}</li>
            ))}
          </ul>
        </section>

        <section style={{ flex: 1 }}>
          <h3>Recent Transactions</h3>
          <ul>
            {transactions.length === 0 && <li>No transactions</li>}
            {transactions.map(t => (
              <li key={t._id || t.uniqueToken || Math.random()}>
                Student: {t.studentId} — Plan: {t.planType} — Status: {t.status} — Amount: {t.amount}
              </li>
            ))}
          </ul>

          <h3>Recent Menus</h3>
          <ul>
            {menus.length === 0 && <li>No menus</li>}
            {menus.map(m => (
              <li key={m._id || m.day}>{m.day}: {m.breakfast}, {m.lunch}, {m.snacks}, {m.dinner}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}