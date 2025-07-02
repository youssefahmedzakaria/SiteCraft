"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Alert } from "@/components/SiteCraft/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/SiteCraft/ui/dialog";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { Store, Users, ShoppingCart, TrendingUp, TrendingDown, Package, BadgeCheck, Lightbulb, Gift, Mail } from "lucide-react";

export default function StoreDetailsPage({ params }: { params: { storeId: string } }) {
  const { storeId } = params;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mailDialog, setMailDialog] = useState<{ open: boolean; subject: string; message: string }>({ open: false, subject: '', message: '' });
  const [mailSending, setMailSending] = useState(false);
  const [mailSuccess, setMailSuccess] = useState('');
  const [mailError, setMailError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`http://localhost:8080/api/admin/stores/${storeId}/stats`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch store stats");
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || "Failed to fetch store stats");
        setLoading(false);
      });
  }, [storeId]);

  const handleSendMail = async () => {
    setMailSending(true);
    setMailSuccess('');
    setMailError('');
    try {
      const res = await fetch(`http://localhost:8080/api/admin/stores/${storeId}/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: mailDialog.subject, message: mailDialog.message })
      });
      if (res.ok) {
        setMailSuccess('Mail sent successfully!');
        setMailDialog({ open: false, subject: '', message: '' });
      } else {
        setMailError('Failed to send mail.');
      }
    } catch {
      setMailError('Failed to send mail.');
    }
    setMailSending(false);
  };

  const openMailDialog = (subject: string, message: string) => {
    setMailDialog({ open: true, subject, message });
    setMailSuccess('');
    setMailError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Store className="h-7 w-7 text-blue-600" />
              Store Details
            </h1>
            <div className="text-gray-500 text-sm mt-1">Store ID: <span className="font-mono">{storeId}</span></div>
          </div>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>
        {loading && <div className="text-center py-12 text-gray-500">Loading store stats...</div>}
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500">Total Staff</div>
                  <div className="text-2xl font-bold">{stats.totalStaff}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                <ShoppingCart className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-xs text-gray-500">Total Orders</div>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-xs text-gray-500">Total Sales</div>
                  <div className="text-2xl font-bold">EGP {stats.totalSales.toLocaleString()}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                <TrendingDown className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-500">Last Month Orders</div>
                  <div className="text-2xl font-bold">{stats.lastMonthOrders}</div>
                  <div className="text-xs text-gray-500 mt-2">Last Month Sales: <span className="font-bold">EGP {stats.lastMonthSales.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                <Package className="h-8 w-8 text-pink-500" />
                <div>
                  <div className="text-xs text-gray-500">Total Products</div>
                  <div className="text-2xl font-bold">{stats.productCount}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                <BadgeCheck className="h-8 w-8 text-cyan-500" />
                <div>
                  <div className="text-xs text-gray-500">Current Plan</div>
                  <div className="text-lg font-bold">{stats.currentPlan}</div>
                </div>
              </div>
            </div>
            {/* Recommendations and Analytics */}
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="font-semibold text-blue-800">Plan Recommendation</div>
                    <div className="text-blue-700 text-sm">{stats.planRecommendation}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900 flex items-center gap-1" onClick={() => openMailDialog('Plan Recommendation', stats.planRecommendation)}>
                  <Mail className="h-4 w-4" /> Notify
                </Button>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-green-400" />
                  <div>
                    <div className="font-semibold text-green-800">Offer Recommendation</div>
                    <div className="text-green-700 text-sm">{stats.offerRecommendation}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-900 flex items-center gap-1" onClick={() => openMailDialog('Offer Recommendation', stats.offerRecommendation)}>
                  <Mail className="h-4 w-4" /> Notify
                </Button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-400" />
                  <div>
                    <div className="font-semibold text-yellow-800">Advice</div>
                    <div className="text-yellow-700 text-sm">{stats.advice}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1" onClick={() => openMailDialog('Advice', stats.advice)}>
                  <Mail className="h-4 w-4" /> Notify
                </Button>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-gray-500" />
                  <div>
                    <div className="font-semibold text-gray-800">Custom Message</div>
                    <div className="text-gray-700 text-sm">Send a custom message to the business owner.</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setMailDialog({ open: true, subject: '', message: '' })}>
                  Write & Send
                </Button>
              </div>
            </div>
            {/* Mail Dialog */}
            <Dialog open={mailDialog.open} onOpenChange={open => setMailDialog(d => ({ ...d, open }))}>
              <DialogContent>
                <DialogTitle>Send Mail to Store Owner</DialogTitle>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Subject</label>
                  <Textarea
                    value={mailDialog.subject}
                    onChange={e => setMailDialog(d => ({ ...d, subject: e.target.value }))}
                    placeholder="Subject"
                    rows={1}
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
          </>
        )}
      </div>
    </div>
  );
} 