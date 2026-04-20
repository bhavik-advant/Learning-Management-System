'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  type AdminUserDetails,
  getMentors,
  type MentorOption,
  updateUserDetails,
} from '@/services/apis/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const roleStyles = {
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  MENTOR: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  TRAINEE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export default function UserDetails({ user }: { user: AdminUserDetails }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(() => user.username);
  const [image, setImage] = useState(() => user.image ?? '');
  const [role, setRole] = useState<AdminUserDetails['role']>(() => user.role);
  const [mentorId, setMentorId] = useState<string>(() => user.mentorId ?? '');
  const [formError, setFormError] = useState<string | null>(null);

  const isTrainee = role === 'TRAINEE';

  const { data: mentors = [], isLoading: mentorsLoading } = useQuery({
    queryKey: ['admin', 'mentors'],
    queryFn: getMentors,
    enabled: isEditing && isTrainee,
  });

  const selectedMentorLabel = useMemo(() => {
    if (!user.mentorId) return 'No mentor assigned';
    const mentor = (mentors as MentorOption[]).find(item => item.id === user.mentorId);
    return mentor?.username ?? user.mentorName ?? 'Mentor assigned';
  }, [mentors, user.mentorId, user.mentorName]);

  const updateMutation = useMutation({
    mutationFn: (payload: {
      username: string;
      image: string;
      role: 'ADMIN' | 'MENTOR' | 'TRAINEE';
      mentorId: string | null;
    }) => updateUserDetails(user.id, payload),
    onSuccess: updated => {
      queryClient.setQueryData(['admin', 'user', user.id], updated);
      setUsername(updated.username);
      setImage(updated.image ?? '');
      setRole(updated.role);
      setMentorId(updated.mentorId ?? '');
      setIsEditing(false);
      setFormError(null);
    },
    onError: error => {
      setFormError(error instanceof Error ? error.message : 'Failed to update user');
    },
  });

  const handleSave = () => {
    setFormError(null);
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }
   
    if (isTrainee && !mentorId) {
      setFormError('Please assign a mentor for trainee');
      return;
    }

    updateMutation.mutate({
      username: username.trim(),
      image: image.trim(),
      role,
      mentorId: isTrainee ? mentorId : null,
    });
  };

  const handleCancel = () => {
    setUsername(user.username);
    setImage(user.image ?? '');
    setRole(user.role);
    setMentorId(user.mentorId ?? '');
    setFormError(null);
    setIsEditing(false);
  };

  const startEditing = () => {
    setUsername(user.username);
    setImage(user.image ?? '');
    setRole(user.role);
    setMentorId(user.mentorId ?? '');
    setFormError(null);
    setIsEditing(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.username}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-2xl font-bold text-gray-500">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{username}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>

          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
              roleStyles[role]
            }`}
          >
            {role}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mb-6">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            onClick={startEditing}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
          >
            Edit User
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input label="Username" value={username} onChange={setUsername} />
          <Input label="Image URL" value={image} onChange={setImage} />
          <SelectRole value={role} onChange={setRole} />

          {isTrainee ? (
            <div className="space-y-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Mentor</label>
              <select
                value={mentorId}
                onChange={e => setMentorId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
              >
                <option value="">
                  {mentorsLoading ? 'Loading mentors...' : 'Select mentor'}
                </option>
                {mentors.map(mentor => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.username} ({mentor.email})
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      ) : null}

      {formError ? <p className="text-sm text-red-600 mb-4">{formError}</p> : null}

      <div className="border-t border-gray-200 dark:border-gray-800 mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DetailItem label="User ID" value={user.id} />

        {user.role === 'TRAINEE' ? (
          <DetailItem label="Mentor" value={selectedMentorLabel} />
        ) : null}

        <DetailItem label="Created At" value={formatDate(user.createdAt)} />

        <DetailItem label="Last Updated" value={formatDate(user.updatedAt)} />
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
      />
    </div>
  );
}

function SelectRole({
  value,
  onChange,
}: {
  value: 'ADMIN' | 'MENTOR' | 'TRAINEE';
  onChange: (value: 'ADMIN' | 'MENTOR' | 'TRAINEE') => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as 'ADMIN' | 'MENTOR' | 'TRAINEE')}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
      >
        <option value="ADMIN">ADMIN</option>
        <option value="MENTOR">MENTOR</option>
        <option value="TRAINEE">TRAINEE</option>
      </select>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
