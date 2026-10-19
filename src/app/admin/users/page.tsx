"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Shield,
  Key,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Mail,
  User,
  AlertCircle,
  Save,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { AdminUser } from "@/lib/cms/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New / Edit User Modal
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      const list = json.data || json;
      if (Array.isArray(list)) {
        setUsers(list);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser || !editingUser.email || !editingUser.name) {
      setErrorMsg("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const isNew = !editingUser.id;
      const url = isNew ? "/api/admin/users" : `/api/admin/users/${editingUser.id}`;
      const method = isNew ? "POST" : "PUT";

      const payload: any = { ...editingUser };
      if (newPassword) {
        payload.password = newPassword;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg(isNew ? "New user created!" : "User updated!");
        fetchUsers();
        setEditingUser(null);
        setNewPassword("");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(json.error || "Failed to save user.");
      }
    } catch (err) {
      setErrorMsg("Network error saving user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        alert(json.error || "Cannot delete user.");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const openNewUserModal = () => {
    setEditingUser({
      name: "",
      email: "",
      role: "CONTENT_EDITOR",
      isActive: true,
    });
    setNewPassword("");
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-gold/20 text-gold-dark border-gold/40";
      case "CONTENT_EDITOR":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "ENQUIRY_MANAGER":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "MEDIA_MANAGER":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-stone-100 text-stone-700 border-stone-300";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Admin Users & Role-Based Access (RBAC)
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage administrative team members, grant permissions, and configure role
            access across FarmCare360.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          onClick={openNewUserModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Admin User
        </AdminButton>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <AdminCard bodyClassName="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-forest" />
            <span>Loading admin users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-border bg-ivory-surface/60 text-charcoal-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Admin Member</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-ivory-surface/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-charcoal">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-charcoal-subtle">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-charcoal-subtle">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(user);
                            setNewPassword("");
                          }}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-forest hover:bg-cream/40"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.email !== "admin@farmcare360.com" && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Edit / Create User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-elevated border border-cream-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-cream-border/70 bg-ivory-surface">
              <h3 className="font-serif text-lg font-bold text-forest">
                {editingUser.id ? "Edit Admin User" : "Add New Admin Member"}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  placeholder="name@farmcare360.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Role / Privileges
                </label>
                <select
                  value={editingUser.role || "CONTENT_EDITOR"}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Control)</option>
                  <option value="CONTENT_EDITOR">
                    CONTENT_EDITOR (Pages, Services, Models, Transparency)
                  </option>
                  <option value="ENQUIRY_MANAGER">
                    ENQUIRY_MANAGER (Leads CRM & Notes)
                  </option>
                  <option value="MEDIA_MANAGER">
                    MEDIA_MANAGER (Media Assets Vault)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  {editingUser.id
                    ? "New Password (leave empty to keep current)"
                    : "Password *"}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-bold text-charcoal">
                    Account Active & Can Log In
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-cream-border/70 bg-ivory-surface">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="gold"
                size="sm"
                loading={saving}
                onClick={handleSaveUser}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                Save User
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Admin User"
        message={`Are you sure you want to delete admin account "${userToDelete?.email}"?`}
        confirmText="Delete User"
        onConfirm={handleDeleteUser}
        onCancel={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
