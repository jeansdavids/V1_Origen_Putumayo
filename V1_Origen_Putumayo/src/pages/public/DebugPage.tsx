import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const DebugPage: React.FC = () => {
    const { user, session, isAdmin } = useAuth();
    const [dbUser, setDbUser] = useState<any>(null);
    const [loadingDb, setLoadingDb] = useState(false);
    const [configStatus, setConfigStatus] = useState<any>({});

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    useEffect(() => {
        // Check config immediately
        setConfigStatus({
            url: supabaseUrl,
            keyPresent: !!supabaseKey,
            keyLength: supabaseKey ? supabaseKey.length : 0,
            keyStart: supabaseKey ? supabaseKey.substring(0, 5) + '...' : 'MISSING'
        });
    }, [supabaseUrl, supabaseKey]);

    const fetchDbUser = async () => {
        // 1. Raw Fetch Status (General Connection)
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/products_public?select=count`, {
                headers: { 'apikey': supabaseKey || '' }
            });
            setConfigStatus((prev: any) => ({ ...prev, rawConnection: response.ok ? 'OK' : 'FAILED' }));
        } catch (e) {
            setConfigStatus((prev: any) => ({ ...prev, rawConnection: 'ERROR' }));
        }

        if (!user) return;

        setLoadingDb(true);
        setDbUser(null);

        try {
            console.log('Checking admin via direct fetch...');
            const response = await fetch(
                `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${user.id}&select=*`,
                {
                    headers: {
                        'apikey': supabaseKey || '',
                        'Authorization': `Bearer ${supabaseKey || ''}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setDbUser(data && data.length > 0 ? data[0] : { message: 'User not found' });
            } else {
                setDbUser({ error: 'Failsafe fetch failed', status: response.status });
            }
        } catch (err: any) {
            setDbUser({ error: 'Crash: ' + err.message });
        } finally {
            setLoadingDb(false);
        }
    };

    useEffect(() => {
        fetchDbUser();
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-3xl font-bold mb-6">Debug Info</h1>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Configuration Check</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>URL:</strong> {configStatus.url}</div>
                    <div><strong>Key Present:</strong> {configStatus.keyPresent ? 'YES' : 'NO'}</div>
                    <div><strong>Key Prefix:</strong> {configStatus.keyStart}</div>
                    <div className="col-span-2 font-bold text-blue-600">Client Connection: {configStatus.dbConnection || 'Checking...'}</div>
                    <div className="col-span-2 font-bold text-purple-600">Raw Fetch: {configStatus.rawConnection || 'Waiting...'}</div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify({
                        isLoggedIn: !!user,
                        isAdmin,
                        email: user?.email,
                        userId: user?.id,
                    }, null, 2)}
                </pre>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Database Check</h2>
                <p className="mb-2"><strong>User ID to copy:</strong></p>
                <div className="flex items-center gap-2 mb-4">
                    <code className="bg-gray-100 p-2 rounded block">{user?.id || 'Not logged in'}</code>
                    {user?.id && (
                        <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                            Copy
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={fetchDbUser}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        disabled={loadingDb}
                    >
                        {loadingDb ? 'Loading...' : 'Retry Fetch'}
                    </button>
                </div>

                <p><strong>Status:</strong> {loadingDb ? 'Loading...' : (dbUser ? 'Finished' : 'Waiting')}</p>
                <pre className="bg-gray-100 p-4 rounded overflow-auto mt-2">
                    {dbUser ? JSON.stringify(dbUser, null, 2) : 'No data yet'}
                </pre>
            </div>
        </div>
    );
};

export default DebugPage;
