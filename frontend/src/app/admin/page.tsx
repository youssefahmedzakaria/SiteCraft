'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/SiteCraft/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/SiteCraft/ui/dialog';
import { Input } from '@/components/SiteCraft/ui/input';
import { Textarea } from '@/components/SiteCraft/ui/textarea';
import { Alert } from '@/components/SiteCraft/ui/alert';
import { SearchBar } from '@/components/SiteCraft/ui/searchBar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/SiteCraft/ui/dropdown-menu';
import { ChevronDown, Store, StarOff, Store as StoreIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from "next/link";

// Type for store overview
interface StoreOverviewDTO {
  id: number;
  storeName: string;
  status: string;
  subscriptionType: string;
  lastMonthSales: number;
  lastMonthOrders: number;
  ownerEmail: string;
}

// Admin type
interface AdminUser {
  id: number;
  name: string;
  email: string;
}

const PREDEFINED_MAILS = [
  {
    subject: 'Low Sales Advice',
    message: 'Your sales are low this month. Here are some tips to improve...'
  },
  {
    subject: 'Subscription Reminder',
    message: 'Your subscription is about to expire. Please renew to avoid interruption.'
  }
];

type SortKey = 'storeName' | 'lastMonthSales' | 'lastMonthOrders' | 'status';
type SortOrder = 'asc' | 'desc';

type StatusFilter = 'All' | 'Active' | 'Suspended';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, checkSession } = useAuth();
  const [stores, setStores] = useState<StoreOverviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mailDialog, setMailDialog] = useState<{ open: boolean; storeId: number | null; subject: string; message: string }>({ open: false, storeId: null, subject: '', message: '' });
  const [mailSending, setMailSending] = useState(false);
  const [mailSuccess, setMailSuccess] = useState('');
  const [mailError, setMailError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('storeName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Admin management state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [addAdminEmail, setAddAdminEmail] = useState('');
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminError, setAddAdminError] = useState('');
  const [addAdminSuccess, setAddAdminSuccess] = useState('');

  const [sessionChecked, setSessionChecked] = useState(false);

  const [adminDialogOpen, setAdminDialogOpen] = useState(false);

  // Check session on mount
  React.useEffect(() => {
    checkSession().finally(() => setSessionChecked(true));
    // eslint-disable-next-line
  }, []);

  // Redirect or block if not admin, only after session is checked
  React.useEffect(() => {
    if (!sessionChecked) return; // Wait until session is checked
    console.log('DEBUG REDIRECT CHECK:', { authLoading, isAuthenticated, user });
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/');
    }
  }, [sessionChecked, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    setLoading(true);
    fetch('http://localhost:8080/api/admin/stores/overview')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data: StoreOverviewDTO[]) => {
        setStores(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load stores. Make sure your backend is running and accessible.');
        setLoading(false);
      });
  }, [isAuthenticated, user?.role]);

  // Fetch admins
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    setAdminLoading(true);
    fetch('http://localhost:8080/api/admin/stores/admins', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data: AdminUser[]) => {
        setAdmins(data);
        setAdminLoading(false);
      })
      .catch(() => {
        setAdminError('Failed to load admins.');
        setAdminLoading(false);
      });
  }, [isAuthenticated, user?.role, addAdminSuccess]);

  const handleSuspend = async (id: number, suspend: boolean) => {
    const endpoint = `http://localhost:8080/api/admin/stores/${id}/${suspend ? 'suspend' : 'unsuspend'}`;
    await fetch(endpoint, { method: 'POST' });
    setStores(stores => stores.map(s => s.id === id ? { ...s, status: suspend ? 'suspended' : 'active' } : s));
  };

  const handleOpenMail = (storeId: number, subject = '', message = '') => {
    setMailDialog({ open: true, storeId, subject, message });
    setMailSuccess('');
    setMailError('');
  };

  const handleSendMail = async () => {
    setMailSending(true);
    setMailSuccess('');
    setMailError('');
    try {
      const res = await fetch(`http://localhost:8080/api/admin/stores/${mailDialog.storeId}/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: mailDialog.subject, message: mailDialog.message })
      });
      if (res.ok) {
        setMailSuccess('Mail sent successfully!');
        setMailDialog({ ...mailDialog, open: false });
      } else {
        setMailError('Failed to send mail.');
      }
    } catch {
      setMailError('Failed to send mail.');
    }
    setMailSending(false);
  };

  // Filtering and searching
  const filteredStores = stores.filter(store => {
    const matchesSearch =
      store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && store.status === 'active') ||
      (statusFilter === 'Suspended' && store.status === 'suspended');
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedStores = [...filteredStores].sort((a, b) => {
    let aValue: any = a[sortKey];
    let bValue: any = b[sortKey];
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Stats
  const totalCount = stores.length;
  const activeCount = stores.filter(s => s.status === 'active').length;
  const suspendedCount = stores.filter(s => s.status === 'suspended').length;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Add admin
  const handleAddAdmin = async () => {
    setAddAdminLoading(true);
    setAddAdminError('');
    setAddAdminSuccess('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/stores/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: addAdminEmail })
      });
      if (res.ok) {
        setAddAdminSuccess('Admin added successfully!');
        setAddAdminEmail('');
      } else {
        const msg = await res.text();
        setAddAdminError(msg || 'Failed to add admin.');
      }
    } catch {
      setAddAdminError('Failed to add admin.');
    }
    setAddAdminLoading(false);
  };

  // Remove admin
  const handleRemoveAdmin = async (userId: number) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    setAdminLoading(true);
    setAdminError('');
    try {
      const res = await fetch(`http://localhost:8080/api/admin/stores/admins/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setAdmins(admins => admins.filter(a => a.id !== userId));
      } else {
        setAdminError('Failed to remove admin.');
      }
    } catch {
      setAdminError('Failed to remove admin.');
    }
    setAdminLoading(false);
  };

  console.log('authLoading:', authLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  if (authLoading) return <div>Loading auth...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;
  if (!user) return <div>No user data</div>;
  if (user.role !== 'admin') return <div>Not an admin. Your role: {user.role}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 mt-12">
      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Stores</h1>
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Manage all business stores in the system
            </h2>
          </div>
          <Button
            className="mt-4 md:mt-0"
            variant="default"
            onClick={() => setAdminDialogOpen(true)}
          >
            Manage Admins
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-800">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <StoreIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Stores</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Stores</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <StarOff className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspended Stores</p>
              <p className="text-2xl font-bold">{suspendedCount}</p>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="border-t border-logo-border mt-6 mb-3 space-y-2 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-grow">
              <SearchBar
                placeholder="Search by store name or owner email..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            {/* Status Filter */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    <span className="ml-2">{statusFilter}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('All')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Suspended')}>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-logo-light-button">
              <tr>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('storeName')}
                >
                  Store Name {sortKey === 'storeName' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                  Subscription
                </th>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastMonthSales')}
                >
                  Last Month Sales {sortKey === 'lastMonthSales' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastMonthOrders')}
                >
                  Last Month Orders {sortKey === 'lastMonthOrders' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {sortKey === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                  Owner Email
                </th>
                <th
                  className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStores.map(store => (
                <tr key={store.id}>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{store.storeName}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">{store.subscriptionType}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">EGP {store.lastMonthSales.toLocaleString()}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">{store.lastMonthOrders}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${store.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{store.status === 'active' ? 'Active' : 'Suspended'}</span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">{store.ownerEmail}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={store.status === 'suspended' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}
                        onClick={() => handleSuspend(store.id, store.status !== 'suspended')}
                      >
                        {store.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      </Button>
                      <Link href={`/admin/stores/${store.id}`} passHref>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mail Dialog */}
        <Dialog open={mailDialog.open} onOpenChange={open => setMailDialog(d => ({ ...d, open }))}>
          <DialogContent>
            <DialogTitle>Send Mail to Store Owner</DialogTitle>
            <div className="mb-2">
              <label className="block mb-1 font-medium">Predefined Mails</label>
              <div className="flex gap-2 mb-2">
                {PREDEFINED_MAILS.map((mail, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => setMailDialog(d => ({ ...d, subject: mail.subject, message: mail.message }))}
                  >
                    {mail.subject}
                  </Button>
                ))}
              </div>
              <label className="block mb-1 font-medium">Subject</label>
              <Input
                value={mailDialog.subject}
                onChange={e => setMailDialog(d => ({ ...d, subject: e.target.value }))}
                placeholder="Subject"
              />
              <label className="block mb-1 font-medium mt-2">Message</label>
              <Textarea
                value={mailDialog.message}
                onChange={e => setMailDialog(d => ({ ...d, message: e.target.value }))}
                placeholder="Type your message..."
                rows={5}
              />
            </div>
            {mailError && <Alert variant="destructive">{mailError}</Alert>}
            {mailSuccess && <Alert variant="default">{mailSuccess}</Alert>}
            <div className="flex gap-2 justify-end mt-4">
              <Button onClick={handleSendMail} disabled={mailSending || !mailDialog.subject || !mailDialog.message}>
                {mailSending ? 'Sending...' : 'Send Mail'}
              </Button>
              <Button variant="secondary" onClick={() => setMailDialog(d => ({ ...d, open: false }))}>Cancel</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin Management Dialog */}
        <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Admin Management</DialogTitle>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleAddAdmin();
                }}
                className="flex flex-col sm:flex-row gap-2 items-center"
              >
                <Input
                  type="email"
                  placeholder="Enter email to add admin"
                  value={addAdminEmail}
                  onChange={e => setAddAdminEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={addAdminLoading || !addAdminEmail}>
                  {addAdminLoading ? 'Adding...' : 'Add Admin'}
                </Button>
              </form>
              {addAdminError && <Alert variant="destructive" className="mt-2">{addAdminError}</Alert>}
              {addAdminSuccess && <Alert variant="default" className="mt-2">{addAdminSuccess}</Alert>}
            </div>
            <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-logo-light-button">
                  <tr>
                    <th className="px-3 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider">Email</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminLoading ? (
                    <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                  ) : admins.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-4">No admins found.</td></tr>
                  ) : (
                    admins.map(admin => (
                      <tr key={admin.id}>
                        <td className="px-3 py-4 text-center">{admin.name}</td>
                        <td className="px-3 py-4 text-center">{admin.email}</td>
                        <td className="px-3 py-4 text-center">
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveAdmin(admin.id)}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {adminError && <Alert variant="destructive" className="mt-2">{adminError}</Alert>}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
} 