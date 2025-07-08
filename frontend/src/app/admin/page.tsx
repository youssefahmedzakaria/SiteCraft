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
import { useTranslation } from '@/contexts/translation-context';

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
  const { t, isRTL } = useTranslation();
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
        setMailSuccess(t('admin.mail.success'));
        setMailDialog({ ...mailDialog, open: false });
      } else {
        setMailError(t('admin.mail.error'));
      }
    } catch {
      setMailError(t('admin.mail.error'));
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
    if (!addAdminEmail.trim()) return;
    setAddAdminLoading(true);
    setAddAdminError('');
    setAddAdminSuccess('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/stores/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: addAdminEmail.trim() })
      });
      if (res.ok) {
        setAddAdminSuccess(t('admin.admins.success'));
        setAddAdminEmail('');
        setAdminDialogOpen(false);
      } else {
        setAddAdminError(t('admin.admins.error'));
      }
    } catch {
      setAddAdminError(t('admin.admins.error'));
    }
    setAddAdminLoading(false);
  };

  const handleRemoveAdmin = async (userId: number) => {
    try {
      await fetch(`http://localhost:8080/api/admin/stores/admins/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setAdmins(admins => admins.filter(admin => admin.id !== userId));
    } catch {
      console.error('Failed to remove admin');
    }
  };

  if (!sessionChecked || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <Button onClick={() => setAdminDialogOpen(true)}>
            {t('admin.admins.addAdmin')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center">
              <StoreIcon className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.stats.totalStores')}</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.stats.activeStores')}</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center">
              <StarOff className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.stats.suspendedStores')}</p>
                <p className="text-2xl font-bold text-red-600">{suspendedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">{t('admin.stores.title')}</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar
                placeholder={t('admin.stores.search')}
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    {t('admin.stores.filter.all')} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('All')}>
                    {t('admin.stores.filter.all')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                    {t('admin.stores.filter.active')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Suspended')}>
                    {t('admin.stores.filter.suspended')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : error ? (
            <div className="p-8">
              <Alert variant="destructive">
                <p>{error}</p>
              </Alert>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium cursor-pointer" onClick={() => handleSort('storeName')}>
                      {t('admin.stores.columns.storeName')}
                    </th>
                    <th className="text-left p-4 font-medium cursor-pointer" onClick={() => handleSort('status')}>
                      {t('admin.stores.columns.status')}
                    </th>
                    <th className="text-left p-4 font-medium">
                      {t('admin.stores.columns.subscriptionType')}
                    </th>
                    <th className="text-left p-4 font-medium cursor-pointer" onClick={() => handleSort('lastMonthSales')}>
                      {t('admin.stores.columns.lastMonthSales')}
                    </th>
                    <th className="text-left p-4 font-medium cursor-pointer" onClick={() => handleSort('lastMonthOrders')}>
                      {t('admin.stores.columns.lastMonthOrders')}
                    </th>
                    <th className="text-left p-4 font-medium">
                      {t('admin.stores.columns.ownerEmail')}
                    </th>
                    <th className="text-left p-4 font-medium">
                      {t('admin.stores.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStores.map((store) => (
                    <tr key={store.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">{store.storeName}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          store.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {store.status}
                        </span>
                      </td>
                      <td className="p-4">{store.subscriptionType}</td>
                      <td className="p-4">${store.lastMonthSales}</td>
                      <td className="p-4">{store.lastMonthOrders}</td>
                      <td className="p-4">{store.ownerEmail}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {store.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(store.id, true)}
                            >
                              {t('admin.stores.actions.suspend')}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(store.id, false)}
                            >
                              {t('admin.stores.actions.unsuspend')}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenMail(store.id)}
                          >
                            {t('admin.stores.actions.sendMail')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/e-commerce/${store.storeName.toLowerCase().replace(/\s+/g, '-')}`}>
                              {t('admin.stores.actions.view')}
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mail Dialog */}
        <Dialog open={mailDialog.open} onOpenChange={(open) => setMailDialog({ ...mailDialog, open })}>
          <DialogContent>
            <DialogTitle>{t('admin.mail.title')}</DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.mail.subject')}</label>
                <Input
                  value={mailDialog.subject}
                  onChange={(e) => setMailDialog({ ...mailDialog, subject: e.target.value })}
                  placeholder="Enter subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.mail.message')}</label>
                <Textarea
                  value={mailDialog.message}
                  onChange={(e) => setMailDialog({ ...mailDialog, message: e.target.value })}
                  placeholder="Enter message..."
                  rows={6}
                />
              </div>
              {mailSuccess && (
                <Alert>
                  <p>{mailSuccess}</p>
                </Alert>
              )}
              {mailError && (
                <Alert variant="destructive">
                  <p>{mailError}</p>
                </Alert>
              )}
              <div className="flex gap-2">
                <Button onClick={handleSendMail} disabled={mailSending}>
                  {mailSending ? t('admin.mail.sending') : t('admin.mail.send')}
                </Button>
                <Button variant="outline" onClick={() => setMailDialog({ ...mailDialog, open: false })}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin Management Dialog */}
        <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
          <DialogContent>
            <DialogTitle>{t('admin.admins.title')}</DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.admins.adminEmail')}</label>
                <Input
                  value={addAdminEmail}
                  onChange={(e) => setAddAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  type="email"
                />
              </div>
              {addAdminSuccess && (
                <Alert>
                  <p>{addAdminSuccess}</p>
                </Alert>
              )}
              {addAdminError && (
                <Alert variant="destructive">
                  <p>{addAdminError}</p>
                </Alert>
              )}
              <div className="flex gap-2">
                <Button onClick={handleAddAdmin} disabled={addAdminLoading}>
                  {addAdminLoading ? t('admin.admins.adding') : t('admin.admins.add')}
                </Button>
                <Button variant="outline" onClick={() => setAdminDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 