import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Shield, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const handleLogin = async () => {
        try {
            await login();
            navigate('/');
        } catch (err) {
            setError('Failed to authenticate identity.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-cyan-400 p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 p-8 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-3 bg-cyan-950/50 rounded-full border border-cyan-500/50 mb-4 animate-pulse">
                            <Shield className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            SECURE ACCESS
                        </h1>
                        <p className="text-cyan-600/80 mt-2 font-mono text-sm">
                            Identity verification required
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-950/50 border border-red-500/50 text-red-400 text-sm font-mono rounded flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full group relative px-6 py-3 bg-cyan-950/30 border border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 rounded flex items-center justify-center gap-3 font-['Rajdhani'] font-bold text-lg tracking-wide overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 blur-md pointer-events-none" />
                        <LogIn className="w-5 h-5 group-hover:text-cyan-300 transition-colors" style={{ color: '#22d3ee' }} />
                        <span className="group-hover:text-cyan-300 transition-colors" style={{ color: '#22d3ee' }}>INITIALIZE GOOGLE LINK</span>
                    </button>

                    <div className="mt-8 pt-6 border-t border-cyan-900/30 text-center">
                        <p className="text-xs text-cyan-700/60 font-mono">
                            SYSTEM V.2.0.4 // UNORGANIZED SECTOR
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
